import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { ERROR_RESPONSE } from '~/errors/error';
import {
  TossPaymentsRequestDto,
  TossPaymentSuccessResponseDto,
} from './dto/payment.dto';
import { TossPaymentsConfirmFilter } from './filter/payments-confirm.filter';

@ApiTags('Payments')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
  required: true,
})
@UseGuards(JwtAuthGuard)
@UseFilters(TossPaymentsConfirmFilter)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({
    summary: '결제 승인',
    description: '결제 요청 후 결제 승인을 요청합니다.',
  })
  @ApiBody({
    type: TossPaymentsRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: '결제 승인',
    type: TossPaymentSuccessResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @Post('toss')
  tossPayments(@Body() tossPaymentsDto: TossPaymentsRequestDto) {
    return this.paymentsService.tossPayment(tossPaymentsDto);
  }
}
