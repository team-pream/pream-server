import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { BankType } from './profile.dto';

export class PatchUsersAddressRequestDto {
  @ApiProperty({
    example: '06192',
    description: '우편번호',
  })
  @IsString()
  @IsNotEmpty()
  zonecode: string;

  @ApiProperty({
    example: '서울 강남구 선릉로 428',
    description: '도로명 주소',
  })
  @IsString()
  @IsNotEmpty()
  roadAddress: string;

  @ApiProperty({
    example: '서울 강남구 대치동 889-41',
    description: '지번 주소',
  })
  @IsString()
  @IsNotEmpty()
  jibunAddress: string;

  @ApiProperty({
    example: '멀티캠퍼스 선릉 4층 401호',
    description: '상세 주소',
  })
  @IsString()
  detailAddress: string;
}

export class MeResponseDto {
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
  })
  @IsString()
  @Length(2, 20)
  nickname: string | null;

  @ApiProperty({
    example: '010-0000-0000',
    description: '사용자 전화번호',
  })
  @IsPhoneNumber('KR')
  phone: string | null;

  @ApiProperty({
    example: {
      zonecode: '06192',
      roadAddress: '서울 강남구 선릉로 428',
      jibunAddress: '서울 강남구 대치동 889-41',
      detailAddress: '멀티캠퍼스 선릉 4층 401호',
    },
    description: '사용자 주소',
  })
  @IsString()
  address: PatchUsersAddressRequestDto | null;

  @ApiProperty({
    example: 'team0pream@gmail.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  email: string | null;

  @ApiProperty({
    example: { bank: 'WR', accountNumber: '300000000000' },
    description: '판매정산계좌',
    required: false,
  })
  @IsString()
  bankAccount?: { bank: BankType; accountNumber: string } | null;

  @ApiProperty({
    example: 'https://open.kakao.com/o/gf8f8d8',
    description: '사용자 연락처',
  })
  @IsString()
  contact: string | null;
}

export class PatchMeRequestDto {
  @ApiProperty({
    example: '두부 집사',
    description: '사용자 닉네임 (최소 2자, 최대 20자)',
    required: false,
  })
  @IsString()
  @Length(2, 20)
  nickname: string;

  @ApiProperty({
    example: '010-0000-0000',
    description: '사용자 전화번호',
    required: false,
  })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({
    example: { bank: 'WR', accountNumber: '300000000000' },
    description: '판매정산계좌',
    required: false,
  })
  @IsString()
  bankAccount?: { bank: BankType; accountNumber: string };
}
