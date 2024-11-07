// src/products/dto/update-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ProductConditionType } from '@prisma/client';
import { IsString, IsOptional, IsInt, IsNumber, Min } from 'class-validator';

export class PatchProductsDetailDto {
  @ApiProperty({
    example: 'NEW',
    description: '상품의 품질(새상품 / 사용감 적음 / 사용감 많음)',
    required: false,
  })
  @IsOptional()
  @IsString()
  condition?: ProductConditionType;

  @ApiProperty({
    example: 20000,
    description: '상품 가격',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 20000,
    description: '상품 가격',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiProperty({
    example: '츄르 3개 팝니다',
    description: '상품 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: '츄르 3개 너무 많아서 팝니다',
    description: '상품 상세 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://open.kakao.com/o/gjgjgjgj',
    description: '연락처',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    example: `{ bank: 'WR', accountNumber: '300000000000' }`,
    description: '판매정산계좌 - JSON 형식으로 전달받습니다.',
    required: false,
  })
  @IsString()
  bankAccount: string;
}
