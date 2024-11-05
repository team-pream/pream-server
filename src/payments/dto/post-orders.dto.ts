import { IsInt, IsString, IsEnum } from 'class-validator';
import { PaymentMethodType } from '@prisma/client';

export class PostOrdersRequestDto {
  @IsInt()
  paymentAmount: number;

  @IsEnum(PaymentMethodType)
  paymentMethod: PaymentMethodType;

  @IsString()
  receiverName: string;

  @IsString()
  shippingAddress: string;

  @IsString()
  phone: string;
}
