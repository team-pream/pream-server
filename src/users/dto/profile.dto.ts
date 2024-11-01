import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { PetDto } from './pet.dto';

export class ProfileDto {
  @ApiProperty({
    example: 'faef8d88-a62f-4af0-84f3-26157ff293c2',
    description: '사용자 아이디',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '김프림',
    description: '사용자 이름',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: '두부 집사',
    description: '사용자 닉네임 (최소 2자, 최대 20자)',
    nullable: true,
  })
  @IsString()
  @Length(2, 20)
  nickname: string | null;

  @ApiProperty({
    example: '010-0000-0000',
    description: '사용자 전화번호',
    nullable: true,
  })
  @IsPhoneNumber('KR')
  phone: string | null;

  @ApiProperty({
    example: '서울시 강남구 선릉로',
    description: '사용자 주소',
    nullable: true,
  })
  @IsString()
  address: string | null;

  @ApiProperty({
    example: 'team0pream@gmail.com',
    description: '사용자 이메일',
    nullable: true,
  })
  @IsEmail()
  email: string | null;

  @ApiProperty({
    example: 'https://open.kakao.com/o/gf8f8d8',
    description: '사용자 연락처',
    nullable: true,
  })
  @IsString()
  contact: string | null;

  @ApiProperty({
    example: {
      id: '57afd458-23ce-4dfb-8547-4d2904853cb4',
      userId: '3998b589-8f71-45bc-9c4b-acedf545b117',
      name: '두부',
      image:
        'https://github.com/user-attachments/assets/7e39f737-822e-4b85-90e2-ec8c1e96fd40',
      petType: 'DOG',
    },
    description: '등록한 반려동물 정보<br/>등록한 반려동물이 없을 경우 null',
  })
  pet: PetDto | null;
}
