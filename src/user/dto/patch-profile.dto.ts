import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PatchProfileRequestDto {
  @ApiProperty({
    example: '두부 집사',
    description: '유저 닉네임 (최소 2자, 최대 20자)',
    nullable: true,
  })
  @IsString()
  @Length(2, 20)
  nickname: string | null;

  @ApiProperty({
    example: '두부',
    description: '반려동물 이름',
  })
  @IsString()
  @Length(1, 20)
  petName: string;

  @ApiProperty({
    example: 'DOG',
    description: '강아지/고양이',
  })
  @IsString()
  petType: 'CAT' | 'DOG';

  @ApiProperty({
    example:
      'https://github.com/user-attachments/assets/7e39f737-822e-4b85-90e2-ec8c1e96fd40',
    description: '프로필 이미지 URL',
  })
  image: string;
}

export class PatchProfileResponseDto {
  @ApiProperty({
    example: 'faef8d88-a62f-4af0-84f3-26157ff293c2',
    description: '반려동물 아이디',
  })
  id: string;

  @ApiProperty({
    example: 'fff293c2-aef8d88-a62f-4af0-84f3-26157',
    description: '반려동물 주인 아이디',
  })
  userId: string;

  @ApiProperty({
    example: '두부',
    description: '반려동물 이름',
  })
  name: string;

  @ApiProperty({
    example:
      'https://github.com/user-attachments/assets/7e39f737-822e-4b85-90e2-ec8c1e96fd40',
    description: '프로필 이미지 URL',
  })
  imageURL: string;

  @ApiProperty({
    example: 'DOG',
    description: '강아지/고양이',
  })
  petType: 'CAT' | 'DOG';
}
