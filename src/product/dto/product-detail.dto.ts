import { ApiProperty } from '@nestjs/swagger';

export enum ProductConditionType {
  NEW = 'NEW',
  SLIGHTLY_USED = 'SLIGHTLY_USED',
  HEAVILY_USED = 'HEAVILY_USED',
}

export enum ProductStatusType {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  RESERVED = 'RESERVED',
}

export class CategoryDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '캣타워/캣휠' })
  name: string;
}

export class SellerDto {
  @ApiProperty({ example: '34bc45e7-e59f-490c-a8df-595d9e7gdc3a' })
  id: string;

  @ApiProperty({ example: '냥이' })
  nickname: string;
}

export class ProductDetailDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '고양이를 위한 철제 캣휠 팝니다!' })
  name: string;

  @ApiProperty({ example: 70000 })
  price: number;

  @ApiProperty({ example: 'RESERVED', enum: ProductStatusType })
  status: ProductStatusType;

  @ApiProperty({ example: 'SLIGHTLY_USED', enum: ProductConditionType })
  condition: ProductConditionType;

  @ApiProperty({
    example: [
      'https://github.com/user-attachments/assets/72ce9fb8-1976-4b7c-b06f-1db3eca198dc',
      'https://github.com/user-attachments/assets/58eb0e87-aa2a-4e1d-9f6c-496e2092a52b',
      'https://github.com/user-attachments/assets/39b1c0cb-2f9b-4095-bb0c-4ab196791df0',
    ],
  })
  images: string[];

  @ApiProperty({
    example:
      '사용감은 있지만 구매하기엔 탈지 모르겠고 그런 분들 추천드려요!\\n저희 아가들은 잘 타는데 다른거 사주려구 싸게 내놓아요…!\\n분해 하려면 한참 걸려서 그대로 가져가실 분 구합니다 생각보다 무겁지 않아요!\\n저녁에 못타게 고정하는것도 옆에 있어요!!',
  })
  description: string;

  @ApiProperty({ example: '2024-10-24T01:30:18.457Z' })
  createdAt: Date;

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ type: SellerDto })
  seller: SellerDto;

  @ApiProperty({
    example: 0,
    description: '해당 상품에 좋아요를 누른 사람의 수',
  })
  likesCount: number;

  @ApiProperty({ example: false })
  isLiked: boolean;
}
