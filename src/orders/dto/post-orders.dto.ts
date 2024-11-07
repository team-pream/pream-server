import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentMethodType,
  PaymentStatusType,
  ProductStatusType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';

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

class ShippingAddressDto {
  @ApiProperty({
    description: '도로명 주소',
    example: '서울 강남구 선릉로14길',
  })
  @IsString()
  roadAddress: string;

  @ApiProperty({
    description: '상세 주소',
    example: '위워크 4층 멀티캠퍼스',
  })
  @IsString()
  detailAddress: string;
}

class ProductDto {
  @ApiProperty({
    description: '상품 아이디',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: '상품 제목',
    example: '캣휠 팝니다',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '상품 설명',
    example: '캣휠 팝니다 팔아요 팔아요 사세요',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: '상품 이미지',
    example: 'https://image.com/catwheel.jpg',
    isArray: true,
  })
  @IsArray()
  images: string[];
}

export class PostOrderProductResponseDto {
  @ApiProperty({
    description: '사용자 아이디',
    example: '99ceg23bgegeb',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '수취인',
    example: '김프림',
  })
  @IsString()
  receiverName: string;

  @ApiProperty({
    description: '결제 금액',
    example: 10000,
  })
  @IsInt()
  paymentAmount: number;

  @ApiProperty({
    description: '결제 수단',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD,
  })
  @IsEnum(PaymentMethodType)
  paymentMethod: PaymentMethodType;

  @ApiProperty({
    description: '배송 주소',
    type: ShippingAddressDto,
  })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({
    description: '휴대폰 번호',
    example: '01000000000',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: '상품 아이디',
    example: 13,
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    description: '상품 상태',
    enum: ProductStatusType,
    example: ProductStatusType.AVAILABLE,
  })
  @IsString()
  status: ProductStatusType;

  @ApiProperty({
    description: '결제 상태',
    enum: PaymentStatusType,
    example: PaymentStatusType.READY,
  })
  @IsEnum(PaymentMethodType)
  paymentStatus: PaymentStatusType;

  @ApiProperty({
    description: '상품 정보',
    type: ProductDto,
  })
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;
}
