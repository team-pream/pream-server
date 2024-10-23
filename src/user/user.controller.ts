import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
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
}
