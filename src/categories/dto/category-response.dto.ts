import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: '카테고리 아이디' })
  id: number;

  @ApiProperty({
    example:
      'https://github.com/user-attachments/assets/276e67eb-63cd-4051-9f83-f53483520434',
    description: '아이콘 이미지 URL',
  })
  name: string;

  @ApiProperty({ example: '위생용품', description: '카테고리 이름' })
  icon: string;
}
