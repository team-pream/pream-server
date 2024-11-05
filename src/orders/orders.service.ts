import { BadRequestException, Injectable } from '@nestjs/common';
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
        errorCode: -845,
      });
    }

    const address = JSON.parse(JSON.stringify(shippingAddress));

    const { username } = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException({
        errorCode: -845,
      });
    }

    if (product.status !== 'AVAILABLE') {
      throw new BadRequestException({
        errorCode: -845,
      });
    }

    return await this.prisma.order.upsert({
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
  }
}
