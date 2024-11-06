import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { TossPaymentDto } from './dto/payment.dto';
import { Response } from 'express';

@ApiTags('Payments')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('/success')
  success(@Res() res: Response) {
    return res.send(200);
  }

  @Post('/toss')
  tossPayments(@Body() tossPaymentDto: TossPaymentDto) {
    return this.paymentsService.tossPayment(tossPaymentDto);
  }
}
