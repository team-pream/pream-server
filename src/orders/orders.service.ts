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
      throw new BadRequestException(ERROR_RESPONSE.NO_STATUS_TO_CONFIRM_ORDER);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: order.productId },
      data: { status: 'SOLD_OUT' },
    });

    return updatedProduct;
  }

  async getOrders({ userId }: { userId: string }) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { product: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 일주일
    const currentTime = new Date();

    const orderSheet = orders.map((order) => {
      const isOneWeekOld =
        currentTime.getTime() - order.createdAt.getTime() > oneWeekInMs;

      if (isOneWeekOld) {
        this.prisma.product.update({
          where: { id: order.product.id },
          data: { status: 'SOLD_OUT' },
        });
      }

      return {
        id: order.id,
        receiverName: order.receiverName,
        paymentAmount: order.paymentAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        phone: order.phone,
        product: {
          id: order.product.id,
          title: order.product.title,
          price: order.product.price,
          status: order.product.status,
          images: order.product.images,
        },
        isCancelable:
          !isOneWeekOld &&
          order.paymentStatus !== 'CANCELED' &&
          order.product.status !== 'SOLD_OUT',
        isConfirmed:
          isOneWeekOld &&
          order.paymentStatus !== 'CANCELED' &&
          order.product.status === 'SOLD_OUT',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    return orderSheet;
  }
}
