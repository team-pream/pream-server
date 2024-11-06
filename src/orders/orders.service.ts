import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { PostOrdersProductRequestDto } from './dto/post-orders.dto';
import { PostOrdersProductCancelRequestDto } from './dto/cancel-orders.dto';
import { ERROR_RESPONSE } from '~/errors/error';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async postOrdersProduct({
    userId,
    productId,
    postOrdersRequest,
  }: {
    userId: string;
    productId: number;
    postOrdersRequest: PostOrdersProductRequestDto;
  }) {
    const {
      receiverName,
      paymentAmount,
      paymentMethod,
      shippingAddress,
      phone,
    } = postOrdersRequest;

    if (
      !userId ||
      !receiverName ||
      !paymentAmount ||
      !paymentMethod ||
      !shippingAddress ||
      !phone
    ) {
      throw new BadRequestException(
        ERROR_RESPONSE.ORDER_REQUIRED_FIELD_MISSING,
      );
    }

    const address = JSON.parse(JSON.stringify(shippingAddress));

    const { username } = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'AVAILABLE') {
      throw new NotAcceptableException(ERROR_RESPONSE.INVALID_ORDER_PRODUCT_ID);
    }

    const orderSheet = await this.prisma.tempOrder.upsert({
      where: {
        userId_productId_status_paymentStatus: {
          userId,
          productId,
          status: 'PAYMENT_PENDING',
          paymentStatus: 'READY',
        },
      },
      update: {
        receiverName: receiverName ?? username,
        status: 'PAYMENT_PENDING',
        paymentStatus: 'READY',
        paymentAmount,
        paymentMethod,
        shippingAddress: address,
        phone,
      },
      create: {
        userId,
        productId: Number(productId),
        receiverName: receiverName ?? username,
        status: 'PAYMENT_PENDING',
        paymentStatus: 'READY',
        paymentAmount,
        paymentMethod,
        shippingAddress: address,
        phone,
      },
    });

    return {
      ...orderSheet,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        images: product.images,
      },
    };
  }

  async postOrdersProductCancel({
    userId,
    orderId,
    postOrdersProductCancelRequest,
  }: {
    userId: string;
    orderId: string;
    postOrdersProductCancelRequest: PostOrdersProductCancelRequestDto;
  }) {
    const idempotency = uuid();

    const { cancelReason } = postOrdersProductCancelRequest;

    if (!orderId) {
      throw new BadRequestException(
        ERROR_RESPONSE.ORDER_REQUIRED_FIELD_MISSING,
      );
    }

    const { paymentKey } = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { paymentKey: true },
    });

    const orderSheet = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!orderSheet || !paymentKey) {
      throw new BadRequestException(ERROR_RESPONSE.INVALID_ORDER_ID);
    }

    if (userId !== orderSheet.userId) {
      throw new ForbiddenException(
        ERROR_RESPONSE.NO_PERMISSION_TO_CANCEL_ORDER,
      );
    }

    if (orderSheet.createdAt < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      throw new ForbiddenException(
        ERROR_RESPONSE.CANCEL_AVAILABLE_PERIOD_EXPIRED,
      );
    }

    const tossApiKey = process.env.TOSS_SECRET_KEY;

    try {
      console.log(
        paymentKey,
        `Basic ${Buffer.from(`${tossApiKey}:`).toString('base64')}`,
      );

      const response = await axios.post(
        `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
        {
          cancelReason: cancelReason ?? '사용자 취소',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${tossApiKey}:`).toString('base64')}`,
            'Idempotency-Key': `${idempotency}`,
          },
        },
      );

      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'ORDER_CANCELED', paymentStatus: 'CANCELED' },
      });

      return {
        orderName: response?.data.data.orderName,
        status: response?.data.data.status,
        approvedAt: response?.data.data.approvedAt,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
