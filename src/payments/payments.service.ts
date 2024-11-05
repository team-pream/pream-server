import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { PostOrdersRequestDto } from './dto/post-orders.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async postOrderSheet({
    userId,
    productId,
    postOrdersRequest,
  }: {
    userId: string;
    productId: number;
    postOrdersRequest: PostOrdersRequestDto;
  }) {
    const {
      receiverName,
      paymentAmount,
      paymentMethod,
      shippingAddress,
      phone,
    } = postOrdersRequest;

    const { username } = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return this.prisma.order.create({
      data: {
        userId,
        productId: Number(productId),
        receiverName: receiverName ?? username,
        status: 'PAYMENT_PENDING',
        paymentStatus: 'READY',
        paymentAmount,
        paymentMethod,
        shippingAddress,
        phone,
      },
    });
  }
}
