import { IsNotEmpty, IsString, IsInt, IsEnum, IsArray } from 'class-validator';
import { ProductConditionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PostProductsUploadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '고양이를 위한 철제 캣휠 팝니다!' })
  title: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  categoryId: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 70000 })
  price: string;

  @IsEnum(ProductConditionType)
  @IsNotEmpty()
  @ApiProperty({ example: 'SLIGHTLY_USED', enum: ProductConditionType })
  condition: ProductConditionType;

  @IsString()
  @ApiProperty({
    example:
      '사용감은 있지만 구매하기엔 탈지 모르겠고 그런 분들 추천드려요!\\n저희 아가들은 잘 타는데 다른거 사주려구 싸게 내놓아요…!\\n분해 하려면 한참 걸려서 그대로 가져가실 분 구합니다 생각보다 무겁지 않아요!\\n저녁에 못타게 고정하는것도 옆에 있어요!!',
  })
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [
      'https://github.com/user-attachments/assets/72ce9fb8-1976-4b7c-b06f-1db3eca198dc',
      'https://github.com/user-attachments/assets/58eb0e87-aa2a-4e1d-9f6c-496e2092a52b',
      'https://github.com/user-attachments/assets/39b1c0cb-2f9b-4095-bb0c-4ab196791df0',
    ],
  })
  images: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://open.kakao.com/weihio33kxc',
  })
  contact: string;
}
