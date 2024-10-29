import { IsNotEmpty, IsString, IsInt, IsEnum, IsArray } from 'class-validator';
import { ProductConditionType } from '@prisma/client';

export class PostProductsUploadDto {
  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsEnum(ProductConditionType)
  @IsNotEmpty()
  condition: ProductConditionType;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  contact: string;
}
