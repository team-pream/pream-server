import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { TossPaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private readonly tossUrl = 'https://api.tosspayments.com/v1/payments';
  private readonly tossApiKey = process.env.TOSS_SECRET_KEY;

  async tossPayment(tossPaymentDto: TossPaymentDto) {
    const { orderId, paymentKey, amount } = tossPaymentDto;

    try {
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
          },
          data: {
            orderId,
            amount,
            paymentKey,
          },
        },
      );

      return { status: response.status, data: response.data };
    } catch (error) {
      throw new Error(error);
    }
  }
}
