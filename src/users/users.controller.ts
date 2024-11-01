import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { UsersService } from './users.service';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('Users')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
})
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 & 반려동물 프로필 조회',
    description: '사용자 프로필과 반려동물 프로필을 <b>함께</b> 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 조회 성공',
    type: ProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 사용자',
    example: { errorCode: -836 },
  })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUser(@Request() req: JwtRequest) {
    return this.usersService.getUsersProfile(req.user.id);
  }
}
