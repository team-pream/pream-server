import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import {
  NicknameDto,
  UpdateUserDto,
  UserResponseDto,
} from '~/user/dto/user-response.dto';
import { UserService } from '~/user/user.service';
import { UserPetRequestDto } from './dto/pet-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '사용자 프로필 조회',
    description:
      '사용자 프로필과 반려동물 프로필을 조회합니다.<br/>반려동물 정보는 배열로 주어지지만, 대표 반려동물 정보 하나만 조회됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 조회 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 사용자',
    example: { errorCode: -836 },
  })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUser(@Request() req: JwtRequest) {
    return this.userService.getUser(req.user.id);
  }

  @ApiOperation({
    summary: '사용자 프로필 등록 API',
    description:
      '<b>온보딩 1단계에서 사용되는 API</b>로, 사용자 프로필(이메일, 닉네임, 휴대폰번호)을 등록합니다.',
  })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Patch('/onboarding')
  async updateOnboardingUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateUserDto);
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
    example: { errorCode: -834 },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/check-nickname')
  async checkNicknameAvailability(
    @Body() nicknameDto: NicknameDto,
    @Response() res,
  ) {
    const isAvailableNickname =
      await this.userService.checkNicknameAvailability(nicknameDto.nickname);

    if (isAvailableNickname) {
      return res.status(200).send();
    } else {
      throw new BadRequestException({ errorCode: -834 });
    }
  }

  @ApiOperation({
    summary: '반려동물 프로필 등록 API',
    description:
      '<b>온보딩 2-3단계에서 사용되는 API</b>로, 반려동물 프로필(강아지/고양이, 이름)을 등록합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '반려동물 프로필 등록 성공',
    example: {
      id: 'bd0e0cc2-0f87-4616-98a8-eac196baed82',
      userId: '718ca736-e63a-4311-9674-9932a61b707f',
      name: '치즈',
      image: null,
      petType: 'CAT',
    },
  })
  @ApiResponse({
    status: 400,
    description: '이미 등록된 반려동물이 있는 경우',
    example: { errorCode: -839 },
  })
  @ApiBody({ type: UserPetRequestDto })
  @UseGuards(JwtAuthGuard)
  @Post('/pet')
  async updateOnboardingUserPet(
    @Body() userPetRequestDto: UserPetRequestDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.userService.createUserPet(userId, userPetRequestDto);
  }

  @ApiOperation({
    summary: '프로필 수정 API',
    description: '마이페이지에서 사용자와 반려동물 정보를 수정합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      '<b>변경되지 않은 필드의 값들도 모두 포함해서 보내야 합니다.</b>',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 수정 성공',
    example: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '프로필 수정 실패',
    example: {
      errorCode: -840,
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('image'))
  async patchUserProfileEdit(
    @Body() patchProfileRequestDto: any,
    @Request() req,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req.user.id;

    try {
      return this.userService.updateUserProfile({
        userId,
        data: patchProfileRequestDto,
        image,
      });
    } catch {
      throw new BadRequestException({ errorCode: -840 });
    }
  }
}
