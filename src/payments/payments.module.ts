import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '~/prisma/prisma.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, JwtService],
})
export class PaymentsModule {}
