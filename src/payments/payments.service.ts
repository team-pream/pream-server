import axios from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { TossPaymentsRequestDto } from './dto/payment.dto';
import { v4 as uuid } from 'uuid';
import { ERROR_RESPONSE } from '~/errors/error';
import { CardIssuerCode, CardIssuerName } from '~/constants/payment';

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

    if (method === '카드') {
      const issuerCode: CardIssuerCode = response.data.card.issuerCode;
      paymentMethod = CardIssuerName[issuerCode];
    }

    if (method === '간편결제') {
      paymentMethod = response.data.easyPay.provider;
    }

    if (method === '휴대폰') {
      paymentMethod = response.data.method;
    }

    const newOrder = await this.prisma.order.create({
      data: {
        userId: tempOrderSheet.userId,
        receiverName: tempOrderSheet.receiverName,
        paymentAmount: tempOrderSheet.paymentAmount,
        status: 'PAYMENT_COMPLETED',
        paymentStatus: 'DONE',
        paymentMethod: tempOrderSheet.paymentMethod,
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
      paymentMethod,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        status: product.status,
        images: product.images,
      },
    };
  }
}
