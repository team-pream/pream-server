import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { PostOrdersProductRequestDto } from './dto/post-orders.dto';

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
      throw new BadRequestException({
        errorCode: -910,
      });
    }

    const address = JSON.parse(JSON.stringify(shippingAddress));

    const { username } = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'AVAILABLE') {
      throw new NotAcceptableException({
        errorCode: -911,
      });
    }

    const orderSheet = await this.prisma.order.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
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
}
