import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '~/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AwsService } from '~/aws/aws.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, JwtService, AwsService],
})
export class ProductModule {}
