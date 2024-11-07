import axios from 'axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { TossPaymentsRequestDto } from './dto/payment.dto';
import { ERROR_RESPONSE } from '~/errors/error';
import { PostPaymentsOrderCancelRequestDto } from './dto/cancel-orders.dto';
import { v4 as uuid } from 'uuid';
import {
  CardIssuerCode,
  CardIssuerName,
  PAYMENT_METHODS,
} from '~/constants/payment';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private readonly tossUrl = 'https://api.tosspayments.com/v1/payments';
  private readonly tossApiKey = process.env.TOSS_SECRET_KEY;

  async tossPayment(tossPaymentsDto: TossPaymentsRequestDto) {
    const { orderId, paymentKey, amount } = tossPaymentsDto;
    const idempotency = uuid();

    const response = await axios.post(
      `${this.tossUrl}/${paymentKey}`,
      {
        orderId,
        amount,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${this.tossApiKey}:`).toString('base64')}`,
          'Idempotency-Key': `${idempotency}`,
        },
        data: {
          orderId,
          amount,
          paymentKey,
        },
      },
    );

    const tempOrderSheet = await this.prisma.tempOrder.findUnique({
      where: {
        id: orderId,
      },
    });

    const { id: tempOrderId, paymentAmount: tempPaymentAmount } =
      tempOrderSheet;

    if (response.data.orderId !== tempOrderId) {
      throw new BadRequestException(ERROR_RESPONSE.INVALID_ORDER_ID);
    }

    if (response.data.totalAmount !== tempPaymentAmount) {
      throw new BadRequestException(ERROR_RESPONSE.INVALID_PAYMENT_AMOUNT);
    }

    let paymentMethod = '정보 없음';
    const method = response.data.method;
    if (method === PAYMENT_METHODS.CARD) {
      const issuerCode: CardIssuerCode = response.data.card.issuerCode;
      paymentMethod = CardIssuerName[issuerCode];
    } else if (method === PAYMENT_METHODS.EASY_PAY) {
      paymentMethod = response.data.easyPay.provider;
    } else {
      paymentMethod = method;
    }

    const newOrder = await this.prisma.order.create({
      data: {
        userId: tempOrderSheet.userId,
        receiverName: tempOrderSheet.receiverName,
        paymentAmount: tempOrderSheet.paymentAmount,
        status: 'PAYMENT_COMPLETED',
        paymentStatus: 'DONE',
        paymentMethod: tempOrderSheet.paymentMethod,
        detailPaymentMethod: paymentMethod,
        paymentKey: response.data.paymentKey,
        shippingAddress: tempOrderSheet.shippingAddress,
        phone: tempOrderSheet.phone,
        productId: tempOrderSheet.productId,
      },
    });

    const product = await this.prisma.product.update({
      where: { id: tempOrderSheet.productId },
      data: { status: 'RESERVED' },
    });

    return {
      ...newOrder,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        status: product.status,
        images: product.images,
      },
    };
  }

  async postOrdersProductCancel({
    userId,
    orderId,
    postPaymentsOrderCancelRequest,
  }: {
    userId: string;
    orderId: string;
    postPaymentsOrderCancelRequest: PostPaymentsOrderCancelRequestDto;
  }) {
    const idempotency = uuid();

    const { cancelReason } = postPaymentsOrderCancelRequest;

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

    try {
      const response = await axios.post(
        `${this.tossUrl}/${paymentKey}/cancel`,
        {
          cancelReason: cancelReason ?? '사용자 취소',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${this.tossApiKey}:`).toString('base64')}`,
            'Idempotency-Key': `${idempotency}`,
          },
        },
      );

      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'ORDER_CANCELED', paymentStatus: 'CANCELED' },
      });

      await this.prisma.product.update({
        where: { id: orderSheet.productId },
        data: { status: 'AVAILABLE' },
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
