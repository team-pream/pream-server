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
      throw new UnauthorizedException({ errorCode: -836 });
    }
  }

  async patchUsersMe(
    userId: string,
    data: { nickname?: string; phone?: string; bankAccount?: any },
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
      throw new UnauthorizedException({ errorCode: -836 });
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
      throw new ConflictException({ errorCode: -842 });
    }

    if (!data.petType || !data.name) {
      throw new BadRequestException({ errorCode: -843 });
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
      throw new NotFoundException({ errorCode: -837 });
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
      throw new NotFoundException({ errorCode: -844 });
    }

    try {
      await this.prisma.pet.delete({
        where: { userId },
      });
      return {
        type: 'toast',
        message: '반려동물 프로필이 삭제되었습니다.',
      };
    } catch {
      throw new UnauthorizedException({ errorCode: -836 });
    }
  }
}
