import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { PostOrdersProductRequestDto } from './dto/post-orders.dto';
import { ERROR_RESPONSE } from '~/errors/error';

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

  async postOrdersOrderConfirm({
    userId,
    orderId,
  }: {
    userId: string;
    orderId: string;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order) {
      throw new NotFoundException(ERROR_RESPONSE.INVALID_ORDER_ID);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException(
        ERROR_RESPONSE.NO_PERMISSION_TO_CONFIRM_ORDER,
      );
    }

    if (order.product.status !== 'RESERVED') {
      throw new ForbiddenException(ERROR_RESPONSE.NO_STATUS_TO_CONFIRM_ORDER);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: order.productId },
      data: { status: 'SOLD_OUT' },
    });

    return updatedProduct;
  }
}
