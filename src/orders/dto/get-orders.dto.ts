// src/order/dto/order-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsInt, IsString } from 'class-validator';
import { OrderStatusType, PaymentStatusType } from '@prisma/client';

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

export class GetOrdersResponseDto {
  @ApiProperty({
    example: '99ceg23bgegeb',
    description: '주문번호',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '김프림',
    description: '수취인 이름',
    required: true,
  })
  @IsString()
  receiverName: string;

  @ApiProperty({
    example: '10000',
    description: '결제 금액',
    required: true,
  })
  @IsInt()
  paymentAmount: number;

  @ApiProperty({
    example: 'ORDER_CANCELED',
    description: '주문상태',
    enum: OrderStatusType,
  })
  status: OrderStatusType;

  @ApiProperty({
    example: 'DONE',
    description: '결제 상태',
    enum: PaymentStatusType,
  })
  paymentStatus: PaymentStatusType;

  @ApiProperty({
    example: '토스페이',
    description: '결제 수단',
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: '배송지 정보',
    required: true,
    type: ShippingAddressDto,
  })
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ example: '01000000000', description: '휴대폰 번호' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '해당 상품 정보', type: ProductDto })
  @IsInt()
  product: ProductDto;

  @ApiProperty({ description: '취소 가능 여부 (일주일 지났는지)' })
  @IsBoolean()
  isCancelable: boolean;

  @ApiProperty({
    example: true,
    description: '구매 확정 여부 (일주일 지나면 자동 구매 확정)',
  })
  @IsBoolean()
  isConfirmed: boolean;

  @ApiProperty({ description: '주문 날짜' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: '주문 수정 날짜' })
  @IsDate()
  updatedAt: Date;
}
