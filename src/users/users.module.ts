import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '~/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AwsService } from '~/aws/aws.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService, AwsService],
})
export class UsersModule {}
