import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '~/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({})
@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, JwtService],
})
export class PaymentsModule {}
