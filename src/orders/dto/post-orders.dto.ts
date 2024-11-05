import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodType } from '@prisma/client';
import { IsInt, IsString, IsEnum } from 'class-validator';

export class PostOrdersProductRequestDto {
  @ApiProperty({
    example: 20000,
    description: '결제 금액',
    nullable: false,
  })
  @IsInt()
  paymentAmount: number;

  @ApiProperty({
    example: 'CARD',
    description: '결제 수단',
    nullable: false,
  })
  @IsEnum(PaymentMethodType)
  paymentMethod: PaymentMethodType;

  @ApiProperty({
    example: '김프림',
    description: '수취인 이름',
    nullable: false,
  })
  @IsString()
  receiverName: string;

  @ApiProperty({
    example: '010-0000-0000',
    description: '주문자 전화번호',
    nullable: false,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: {
      roadAddress: '서울 강남구 선릉로 428',
      detailAddress: '멀티캠퍼스 선릉 4층 401호',
    },
    description: '사용자 주소',
    nullable: false,
  })
  @IsString()
  shippingAddress: string;
}
