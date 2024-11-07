import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsISO8601,
  IsInt,
  MaxLength,
} from 'class-validator';

export class PaymentCancelDto {
  @ApiProperty({
    description: '결제를 취소한 금액입니다.',
    example: 15000,
  })
  @IsNumber()
  cancelAmount: number;

  @ApiProperty({
    description: '결제를 취소한 이유입니다. 최대 길이는 200자입니다.',
    example: '고객 요청에 따른 취소',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  cancelReason: string;

  @ApiProperty({
    description: '취소된 금액 중 면세 금액입니다.',
    example: 5000,
  })
  @IsNumber()
  taxFreeAmount: number;

  @ApiProperty({
    description: '취소된 금액 중 과세 제외 금액(컵 보증금 등)입니다.',
    example: 1000,
  })
  @IsInt()
  taxExemptionAmount: number;

  @ApiProperty({
    description: '결제 취소 후 환불 가능한 잔액입니다.',
    example: 8000,
  })
  @IsNumber()
  refundableAmount: number;

  @ApiProperty({
    description:
      '간편결제 서비스의 포인트, 쿠폰, 즉시할인과 같은 적립식 결제수단에서 취소된 금액입니다.',
    example: 2000,
  })
  @IsNumber()
  easyPayDiscountAmount: number;

  @ApiProperty({
    description:
      "결제 취소가 일어난 날짜와 시간 정보입니다. yyyy-MM-dd'T'HH:mm:ss±hh:mm ISO 8601 형식입니다.",
    example: '2022-01-01T00:00:00+09:00',
  })
  @IsISO8601()
  canceledAt: string;

  @ApiProperty({
    description:
      '취소 건의 키 값입니다. 여러 건의 취소 거래를 구분하는 데 사용됩니다. 최대 길이는 64자입니다.',
    example: '5zJ4xY7m0kODnyRpQWGrN2xqGlNvLrKwv1M9ENjbeoPaZdL6',
    maxLength: 64,
  })
  @IsString()
  @MaxLength(64)
  transactionKey: string;

  @ApiProperty({
    description: '취소 건의 현금영수증 키 값입니다. 최대 길이는 200자입니다.',
    example: null,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  receiptKey?: string | null;

  @ApiProperty({
    description:
      '취소 상태입니다. DONE이면 결제가 성공적으로 취소된 상태입니다.',
    example: 'DONE',
  })
  @IsString()
  cancelStatus: string;

  @ApiProperty({
    description:
      '취소 요청 ID입니다. 비동기 결제에만 적용되는 특수 값입니다. 일반결제, 자동결제(빌링), 페이팔 해외결제에서는 항상 null입니다.',
    example: null,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  cancelRequestId?: string | null;
}
