import { ApiProperty } from '@nestjs/swagger';

export enum ProductStatusType {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD_OUT = 'SOLD_OUT',
}

export class SalesListProductResponseDto {
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
    description: '상품 품절/예약/구매가능 상태',
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
}
