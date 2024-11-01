import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
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
import { UsersService } from './users.service';
import { GetProfileResponseDto } from './dto/profile.dto';
import { PatchMeRequestDto, PatchMeResponseDto } from './dto/me.dto';
import { PetType } from '@prisma/client';
import {
  PatchPetRequestDto,
  PatchPetResponseDto,
  PostPetRequestDto,
  PostPetResponseDto,
} from './dto/pet.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 & 반려동물 프로필 조회',
    description: '사용자 프로필과 반려동물 프로필을 <b>함께</b> 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 조회 성공',
    type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: { errorCode: -825 },
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
  @ApiBody({
    type: PatchMeRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 수정 성공',
    type: PatchMeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: { errorCode: -825 },
  })
  @Patch('me')
  async updateUser(
    @Body()
    updateData: {
      nickname?: string;
      phone?: string;
      bankAccount?: { bank: string; accountNumber: string };
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
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
    example: { errorCode: -825 },
  })
  @ApiResponse({
    status: 400,
    description: '필수 항목이 누락된 경우',
    example: { errorCode: -843 },
  })
  @ApiResponse({
    status: 409,
    description: '이미 등록된 반려동물이 있는 경우',
    example: { errorCode: -842 },
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
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
    example: { errorCode: -825 },
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '반려동물 프로필 삭제 성공',
    example: {
      type: 'toast',
      message: '반려동물 프로필이 삭제되었습니다.',
    },
  })
  @ApiResponse({
    status: 404,
    description: '삭제할 반려동물 프로필이 없는 경우',
    example: { errorCode: -844 },
  })
  @Delete('pet')
  async DeletePProfile(@Request() req: JwtRequest) {
    const userId = req.user?.id;
    return this.usersService.deleteUsersPet(userId);
  }
}
