import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(id: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      include: {
        pets: true,
      },
    });

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
  }
}
