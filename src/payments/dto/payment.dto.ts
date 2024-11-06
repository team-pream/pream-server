import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaymentCancelDto } from './payment-cancel.dto';

export class TossPaymentsRequestDto {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  amount: number;
}

export class Failure {
  @ApiProperty({
    description: '오류 타입',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: '결제 실패 사유',
    required: true,
  })
  message: string;
}

export class TossPaymentSuccessResponseDto {
  @ApiProperty({
    example: '4d381eb6eb8',
    description: '주문번호',
    required: true,
  })
  orderId: string;

  @ApiProperty({
    example: '강아지 훈련용 장난감',
    description: '주문한 상품의 이름',
    required: true,
  })
  orderName: string;

  @ApiProperty({
    example: '2024-11-07T00:46:08+09:00',
    description: '결제 승인 시간',
    required: true,
    nullable: true,
  })
  approvedAt: Date;

  @ApiProperty({
    example: null,
    description: '할인 금액',
    required: true,
    nullable: true,
  })
  discount: number | null;

  @ApiProperty({
    example: null,
    description: '결제 취소 이력',
    required: true,
    nullable: true,
  })
  cancels: PaymentCancelDto | null;

  @ApiProperty({
    example: false,
    description: '부분 취소 가능 여부',
    required: true,
  })
  isPartialCancelable: boolean;

  @ApiProperty({
    example: 'KR',
    description: '결제한 국가',
    required: true,
  })
  country: string;

  @ApiProperty({
    example: null,
    description: '결제 승인 실패 사유',
    required: true,
    nullable: true,
  })
  failure: Failure | null;

  @ApiProperty({
    example: 'KRW',
    description: '결제 시 사용한 통화',
    required: true,
  })
  currency: string;

  @ApiProperty({
    example: 4000,
    description: '총 결제 금액',
    required: true,
  })
  totalAmount: number;

  @ApiProperty({
    example: 4000,
    description: '취소할 수 있는 금액',
    required: true,
  })
  balanceAmount: number;

  @ApiProperty({
    example: 3636,
    description: '공급가액',
    required: true,
  })
  suppliedAmount: number;

  @ApiProperty({
    example: 3640,
    description: '부가세',
    required: true,
  })
  vat: number;

  @ApiProperty({
    example: 0,
    description: '결제 금액 중 면세 금액',
    required: true,
  })
  taxFreeAmount: number;

  @ApiProperty({
    example: 10000,
    description: '결제 수단',
    required: true,
  })
  paymentMethod: string;
}
