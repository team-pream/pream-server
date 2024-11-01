import { Injectable, UnauthorizedException } from '@nestjs/common';
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
}
