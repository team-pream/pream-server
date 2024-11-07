import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { UsersService } from './users.service';
import { BankType, GetProfileResponseDto } from './dto/profile.dto';
import {
  PatchMeRequestDto,
  MeResponseDto,
  PatchUsersAddressRequestDto,
  PatchUserOnboarding,
  NicknameDto,
} from './dto/me.dto';
import { PetType } from '@prisma/client';
import {
  PatchPetRequestDto,
  PatchPetResponseDto,
  PostPetRequestDto,
  PostPetResponseDto,
} from './dto/pet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ERROR_RESPONSE } from '~/errors/error';

@ApiTags('Users')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 프로필 등록 API',
    description:
      '<b>온보딩 1단계에서 사용되는 API</b>로, 사용자 프로필(이메일, 닉네임, 휴대폰번호)을 등록합니다.',
  })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: PatchUserOnboarding })
  @UseGuards(JwtAuthGuard)
  @Patch('/onboarding')
  async updateOnboardingUser(
    @Body() updateUserDto: PatchUserOnboarding,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.usersService.patchUsersOnboarding(userId, updateUserDto);
  }

  @ApiOperation({
    summary: '닉네임 중복 검사 API',
    description: '닉네임 중복 검사를 수행합니다.',
  })
  @ApiBody({ type: NicknameDto })
  @ApiResponse({ status: 200, description: '사용 가능한 닉네임인 경우' })
  @ApiResponse({
    status: 400,
    description: '닉네임이 중복될 경우',
    example: ERROR_RESPONSE.DUPLICATED_NICKNAME,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/check-nickname')
  async checkNicknameAvailability(
    @Body() nicknameDto: NicknameDto,
    @Response() res,
  ) {
    const isAvailableNickname =
      await this.usersService.checkNicknameAvailability(nicknameDto.nickname);

    if (isAvailableNickname) {
      return res.status(200).send();
    } else {
      throw new BadRequestException(ERROR_RESPONSE.DUPLICATED_NICKNAME);
    }
  }

  @ApiOperation({
    summary: '사용자 & 반려동물 프로필 조회',
    description: '사용자 프로필과 반려동물 프로필을 <b>함께</b> 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 조회 성공',
    type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @Get('profile')
  async getUser(@Request() req: JwtRequest) {
    return this.usersService.getUsersProfile(req.user.id);
  }

  @ApiOperation({
    summary: '사용자 프로필 수정',
    description:
      '사용자 프로필의 닉네임, 휴대폰번호, 판매정산계죄를 수정합니다.<br/>수정하려는 항목만 선택적으로 전달할 수 있습니다.',
  })
  @ApiBody({
    type: PatchMeRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 수정 성공',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @Patch('me')
  async updateUser(
    @Body()
    updateData: {
      nickname?: string;
      phone?: string;
      bankAccount?: { bank: BankType; accountNumber: string };
    },
    @Request() req?: any,
  ) {
    const userId = req.user?.id;
    return this.usersService.patchUsersMe(userId, updateData);
  }

  @ApiOperation({
    summary: '반려동물 프로필 등록',
    description: '등록된 반려동물 프로필이 없는 경우 새롭게 등록합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: PostPetRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: '반려동물 프로필 등록 성공',
    type: PostPetResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @ApiResponse({
    status: 400,
    description: '필수 항목이 누락된 경우',
    example: ERROR_RESPONSE.PET_REQUIRED_FIELD_MISSING,
  })
  @ApiResponse({
    status: 409,
    description: '이미 등록된 반려동물이 있는 경우',
    example: ERROR_RESPONSE.PET_ALREADY_EXISTS,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('pet')
  async postUsersPet(
    @Body() body: { name: string; petType: PetType },
    @Request() req: JwtRequest,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req.user?.id;
    return this.usersService.postUsersPet(userId, body, image);
  }

  @ApiOperation({
    summary: '반려동물 프로필 수정',
    description: '반려동물 프로필이 있는 경우 기존 데이터를 수정합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: PatchPetRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '반려동물 프로필 수정 성공',
    type: PatchPetResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Patch('pet')
  async getPetProfile(
    @Body() body: { name?: string; petType?: PetType },
    @Request() req: JwtRequest,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req.user?.id;
    return this.usersService.patchPet(userId, body, image);
  }

  @ApiOperation({
    summary: '반려동물 프로필 삭제',
    description: '반려동물 프로필이 있는 경우 기존 데이터를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '반려동물 프로필 삭제 성공',
    example: {
      // type: 'toast',
      message: '반려동물 프로필이 삭제되었습니다.',
    },
  })
  @ApiResponse({
    status: 404,
    description: '삭제할 반려동물 프로필이 없는 경우',
    example: ERROR_RESPONSE.PET_DOES_NOT_EXIST,
  })
  @Delete('pet')
  async DeletePProfile(@Request() req: JwtRequest) {
    const userId = req.user?.id;
    return this.usersService.deleteUsersPet(userId);
  }

  @ApiOperation({
    summary: '사용자 주소 수정/등록',
    description: '사용자 주소를 수정하거나 새롭게 등록할 수 있습니다.',
  })
  @ApiBody({
    description: '<strong>모든 필드를 전달해야 합니다.</strong>',
    type: PatchUsersAddressRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '주소 수정/등록 성공',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '필수 항목이 누락된 경우',
    example: ERROR_RESPONSE.ADDRESS_REQUIRED_FIELD_MISSING,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: () => {
        return new BadRequestException(
          ERROR_RESPONSE.ADDRESS_REQUIRED_FIELD_MISSING,
        );
      },
    }),
  )
  @Patch('address')
  async updateAddress(
    @Body() patchUsersAddressRequestDto: PatchUsersAddressRequestDto,
    @Request() req: JwtRequest,
  ) {
    const userId = req.user.id;
    return this.usersService.patchUsersAddress({
      userId,
      patchUsersAddressRequestDto,
    });
  }
}
