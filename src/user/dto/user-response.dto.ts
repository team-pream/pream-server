import { ApiProperty } from '@nestjs/swagger';
import { PetResponseDto } from './pet-response.dto';

export class UserResponseDto {
  @ApiProperty({
    example: 'faef8d88-a62f-4af0-84f3-26157ff293c2',
    description: '유저 아이디',
  })
  id: string;

  @ApiProperty({
    example: '김프림',
    description: '유저 이름',
  })
  username: string;

  @ApiProperty({
    example: '두부 집사',
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: '010-0000-0000',
    description: '유저 전화번호',
  })
  phone: string;

  @ApiProperty({
    example: '서울시 강남구 선릉로',
    description: '유저 주소',
  })
  address: string;

  @ApiProperty({
    example: 'team0pream@gmail.com',
    description: '유저 이메일',
  })
  email: string;

  @ApiProperty({
    example: 'https://open.kakao.com/o/gf8f8d8',
    description: '유저 연락처',
  })
  contact: string;

  @ApiProperty({
    example: [
      {
        id: '57afd458-23ce-4dfb-8547-4d2904853cb4',
        userId: '3998b589-8f71-45bc-9c4b-acedf545b117',
        name: '두부',
        image:
          'https://github.com/user-attachments/assets/7e39f737-822e-4b85-90e2-ec8c1e96fd40',
        petType: 'DOG',
        createdAt: '2024-10-23T06:27:21.384Z',
        updatedAt: '2024-10-23T06:26:53.552Z',
      },
    ],
    isArray: true,
    description: '등록한 반려동물 리스트',
  })
  pets: PetResponseDto[];
}
