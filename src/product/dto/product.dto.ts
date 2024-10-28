import { ApiProperty } from '@nestjs/swagger';

export enum ProductStatusType {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  RESERVED = 'RESERVED',
}

export class ProductResponseDto {
  @ApiProperty({
    example: 1,
    description: '상품 ID',
  })
  id: number;

  @ApiProperty({
    example: '1번 사용한 강아지 카시트예요!',
    description: '상품 이름',
  })
  title: string;

  @ApiProperty({
    example: 40000,
    description: '상품 가격',
  })
  price: number;

  @ApiProperty({
    example: 'AVAILABLE',
    description: '상품 상태',
    enum: ProductStatusType,
  })
  status: ProductStatusType;

  @ApiProperty({
    example: [
      'https://github.com/user-attachments/assets/890c728b-8e32-474f-9db1-a036e6955713',
      'https://github.com/user-attachments/assets/9d7b8d29-dd5f-42a3-b74b-f002fac8e738',
      'https://github.com/user-attachments/assets/74bfb5e4-48cb-4bcd-bf80-64ef7d877be3',
    ],
    description: '상품 이미지 URL 리스트',
  })
  images: string[];

  @ApiProperty({
    example: '올해 7월에 강아지랑 펜션 놀러갈 때 한번 사용한 카시트예요!!',
    description: '상품 설명',
  })
  description: string;

  @ApiProperty({
    example: 7,
    description: '카테고리 ID',
  })
  categoryId: number;

  @ApiProperty({
    example: '718ca736-e63a-4311-9674-9932a61b707f',
    description: '판매자 ID',
  })
  sellerId: string;

  @ApiProperty({
    example: true,
    description:
      '로그인한 유저가 이 상품을 좋아요 했는지 여부 (로그인하지 않은 경우 false)',
  })
  isLiked: boolean;
}

export class ProductListResponseDto {
  @ApiProperty({
    example: 1,
    description: '총 상품 수',
  })
  totalCount: number;

  @ApiProperty({
    type: [ProductResponseDto],
    description: '상품 리스트',
  })
  products: ProductResponseDto[];
}
