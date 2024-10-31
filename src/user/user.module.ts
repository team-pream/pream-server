import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '~/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AwsService } from '~/aws/aws.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, AwsService],
})
export class UserModule {}
