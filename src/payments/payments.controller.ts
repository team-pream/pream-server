import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
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
import { PostPaymentsOrderCancelRequestDto } from '~/payments/dto/cancel-orders.dto';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';

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
  @ApiResponse({
    status: 400,
    description: '올바르지 않은 주문 아이디 사용',
    example: ERROR_RESPONSE.INVALID_ORDER_ID,
  })
  @Post('toss')
  tossPayments(@Body() tossPaymentsDto: TossPaymentsRequestDto) {
    return this.paymentsService.tossPayment(tossPaymentsDto);
  }

  @ApiOperation({
    summary: '주문 취소',
    description:
      '상품 구매 후 구매확정을 하지 않고 1주일이 지나지 않았을 경우 취소합니다.',
  })
  @ApiBody({
    type: PostPaymentsOrderCancelRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '주문 취소 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'pymentKey 또는 주문 정보가 없을 때',
    example: ERROR_RESPONSE.INVALID_ORDER_ID,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @ApiResponse({
    status: 403,
    description: '취소 가능한 시간(일주일)이 지났을 때',
    example: ERROR_RESPONSE.CANCEL_AVAILABLE_PERIOD_EXPIRED,
  })
  @Post(':orderId/cancel')
  async postOrdersProductCancel(
    @Param('orderId') orderId: string,
    @Body()
    postPaymentsOrderCancelRequest: PostPaymentsOrderCancelRequestDto,
    @Request()
    req: JwtRequest,
  ) {
    const userId = req.user?.id;
    return this.paymentsService.postOrdersProductCancel({
      userId,
      orderId,
      postPaymentsOrderCancelRequest,
    });
  }
}
