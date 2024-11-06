import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PetType } from '@prisma/client';
import { AwsService } from '~/aws/aws.service';
import { PrismaService } from '~/prisma/prisma.service';
import { PatchUsersAddressRequestDto } from './dto/me.dto';
import { BankType } from './dto/profile.dto';
import { ERROR_RESPONSE } from '~/errors/error';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private awsService: AwsService,
  ) {}

  async getUsersProfile(id: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });

    if (profile) {
      return {
        id: profile.id,
        username: profile.username,
        nickname: profile.nickname,
        phone: profile.phone,
        address: profile.address,
        email: profile.email,
        contact: profile.contact,
        bankAccount: profile.bankAccount,
        pet: profile.pet
          ? {
              id: profile.pet.id,
              userId: profile.pet.userId,
              name: profile.pet.name,
              image: profile.pet.image,
              petType: profile.pet.petType,
            }
          : null,
      };
    } else {
      throw new UnauthorizedException(ERROR_RESPONSE.INVALID_USER);
    }
  }

  async patchUsersMe(
    userId: string,
    data: {
      nickname?: string;
      phone?: string;
      bankAccount?: { bank: BankType; accountNumber: string };
    },
  ) {
    try {
      return this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          nickname: true,
          phone: true,
          bankAccount: true,
          updatedAt: true,
        },
      });
    } catch {
      throw new UnauthorizedException(ERROR_RESPONSE.INVALID_USER);
    }
  }

  async postUsersPet(
    userId: string,
    data: { petType: PetType; name: string },
    image: Express.Multer.File,
  ) {
    const isPetExists = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (isPetExists) {
      throw new ConflictException(ERROR_RESPONSE.PET_ALREADY_EXISTS);
    }

    if (!data.petType || !data.name) {
      throw new BadRequestException(ERROR_RESPONSE.PET_REQUIRED_FIELD_MISSING);
    }

    let imageUrl = null;
    if (image) {
      imageUrl = await this.awsService.uploadFile(
        image,
        process.env.AWS_S3_BUCKET_NAME,
        'profile-images',
      );
    }

    const updatedPet = this.prisma.pet.create({
      data: {
        userId,
        ...data,
        ...(imageUrl !== null ? { image: imageUrl } : {}),
      },
      select: {
        id: true,
        name: true,
        image: true,
        petType: true,
        createdAt: true,
      },
    });

    return {
      ...updatedPet,
      image: imageUrl,
    };
  }

  async patchPet(
    userId: string,
    data: { petType?: PetType; name?: string },
    image?: Express.Multer.File,
  ) {
    const pet = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (!pet) {
      throw new NotFoundException(ERROR_RESPONSE.DUPLICATED_EMAIL);
    }

    let imageUrl = null;

    if (image) {
      imageUrl = await this.awsService.uploadFile(
        image,
        process.env.AWS_S3_BUCKET_NAME,
        'profile-images',
      );
    }

    return this.prisma.pet.update({
      where: { userId },
      data: {
        ...data,
        ...(imageUrl !== null ? { image: imageUrl } : {}),
      },
      select: {
        id: true,
        name: true,
        image: true,
        petType: true,
        updatedAt: true,
      },
    });
  }

  async deleteUsersPet(userId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (!pet) {
      throw new NotFoundException(ERROR_RESPONSE.PET_DOES_NOT_EXIST);
    }

    try {
      await this.prisma.pet.delete({
        where: { userId },
      });
      return {
        // type: 'toast',
        message: '반려동물 프로필이 삭제되었습니다.',
      };
    } catch {
      throw new UnauthorizedException(ERROR_RESPONSE.INVALID_USER);
    }
  }

  async patchUsersAddress({
    userId,
    patchUsersAddressRequestDto,
  }: {
    userId: string;
    patchUsersAddressRequestDto: PatchUsersAddressRequestDto;
  }) {
    const { zonecode, roadAddress, jibunAddress, detailAddress } =
      patchUsersAddressRequestDto;

    if (!zonecode || !roadAddress || !jibunAddress || !detailAddress) {
      throw new BadRequestException(
        ERROR_RESPONSE.ADDRESS_REQUIRED_FIELD_MISSING,
      );
    }

    const address = JSON.parse(JSON.stringify(patchUsersAddressRequestDto));

    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(ERROR_RESPONSE.INVALID_ACCESS_TOKEN);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { address },
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      nickname: updatedUser.nickname,
      phone: updatedUser.phone,
      address: updatedUser.address,
      email: updatedUser.email,
      contact: updatedUser.contact,
    };
  }
}
