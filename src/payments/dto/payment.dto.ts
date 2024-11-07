import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodType } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

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

class ShippingAddressDto {
  @ApiProperty({
    description: '도로명 주소',
    example: '경기 성남시 분당구 판교역로 166',
  })
  roadAddress: string;

  @ApiProperty({ description: '상세 주소', example: '상세 주소' })
  detailAddress: string;
}

class ProductDto {
  @ApiProperty({ description: '상품 ID', example: 137879392 })
  id: number;

  @ApiProperty({
    description: '상품 제목',
    example: '강아지장난감 애견훈련 노즈워크',
  })
  title: string;

  @ApiProperty({ description: '상품 가격', example: 10000 })
  price: number;

  @ApiProperty({ description: '상품 상태', example: 'RESERVED' })
  status: string;

  @ApiProperty({
    description: '상품 이미지',
    example: ['https://images.com/example'],
    isArray: true,
  })
  images: string[];
}

export class TossPaymentSuccessResponseDto {
  @ApiProperty({
    description: '주문 ID',
    example: 'c416aa767f',
  })
  id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '4923c34b',
  })
  userId: string;

  @ApiProperty({ description: '수령인 이름', example: '김프림' })
  receiverName: string;

  @ApiProperty({ description: '결제 금액', example: 10000 })
  paymentAmount: number;

  @ApiProperty({ description: '주문 상태', example: 'PAYMENT_COMPLETED' })
  status: string;

  @ApiProperty({ description: '결제 상태', example: 'DONE' })
  paymentStatus: string;

  @ApiProperty({
    description: '결제 수단',
    example: PaymentMethodType.CARD,
    enum: PaymentMethodType,
  })
  paymentMethod: PaymentMethodType;

  @ApiProperty({
    description: '상세 결제 수단',
    example: '토스페이',
    nullable: true,
  })
  detailPaymentMethod?: string;

  @ApiProperty({ description: '배송 주소', type: ShippingAddressDto })
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ description: '전화번호', example: '01012345678' })
  phone: string;

  @ApiProperty({ description: '상품 ID', example: 13392 })
  productId: number;

  @ApiProperty({
    description: '주문 생성 날짜',
    example: '2024-11-06T17:43:29.333Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '주문 수정 날짜',
    example: '2024-11-06T17:43:29.333Z',
  })
  updatedAt: string;

  @ApiProperty({ description: '주문한 상품 정보', type: ProductDto })
  product: ProductDto;
}
