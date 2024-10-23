import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { UpdateUserDto } from './dto/user-response.dto';
import { UserPetRequestDto } from './dto/pet-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new BadRequestException({ errorCode: -836 });
    }

    if (updateUserDto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id },
        },
      });
      if (emailExists) {
        throw new BadRequestException({ errorCode: -837 });
      }
    }

    if (updateUserDto.nickname) {
      const nicknameExists = await this.prisma.user.findFirst({
        where: {
          nickname: updateUserDto.nickname,
          id: { not: id },
        },
      });
      if (nicknameExists) {
        throw new BadRequestException({ errorCode: -834 });
      }
    }

    if (updateUserDto.phone) {
      const phoneExists = await this.prisma.user.findFirst({
        where: {
          phone: updateUserDto.phone,
          id: { not: id },
        },
      });
      if (phoneExists) {
        throw new BadRequestException({ errorCode: -838 });
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async getUser(id: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      include: {
        pets: true,
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
        pets: profile.pets.map((pet) => ({
          id: pet.id,
          userId: pet.userId,
          name: pet.name,
          imageURL: pet.image,
          petType: pet.petType,
        })),
      };
    } else {
      throw new UnauthorizedException({ errorCode: -836 });
    }
  }

  async checkNicknameAvailability(nickname: string): Promise<boolean> {
    const existingUser = await this.prisma.user.findUnique({
      where: { nickname },
    });

    return !existingUser;
  }

  async createUserPet(userId: string, userPetRequestDto: UserPetRequestDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException({ errorCode: -836 });
    }

    const existingPet = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (existingPet) {
      throw new BadRequestException({ errorCode: -839 });
    }

    const newPet = await this.prisma.pet.create({
      data: {
        userId,
        name: userPetRequestDto.name,
        petType: userPetRequestDto.petType,
      },
    });

    return {
      id: newPet.id,
      userId: newPet.userId,
      name: newPet.name,
      image: newPet.image,
      petType: newPet.petType,
    };
  }
}
