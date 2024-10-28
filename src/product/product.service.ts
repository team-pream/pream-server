import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { ProductStatusType } from './constants/product';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(userId?: string) {
    const likedProductIds = userId ? await this.getLikedProductIds(userId) : [];

    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        images: true,
        description: true,
        categoryId: true,
        sellerId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalCount: products.length,
      products: products.map((product) => ({
        ...product,
        isLiked: likedProductIds.includes(product.id),
      })),
    };
  }

  async getProductsByCategory({
    categoryId,
    status,
    userId,
  }: {
    categoryId?: number;
    status?: ProductStatusType;
    userId?: string;
  }) {
    const likedProductIds = userId ? await this.getLikedProductIds(userId) : [];

    const whereConditions: any = { categoryId };
    if (status) {
      whereConditions.status = status;
    }

    const products = await this.prisma.product.findMany({
      where: whereConditions,
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        images: true,
        description: true,
        categoryId: true,
        sellerId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalCount: products.length,
      products: products.map((product) => ({
        ...product,
        isLiked: likedProductIds.includes(product.id),
      })),
    };
  }

  private async getLikedProductIds(userId: string): Promise<number[]> {
    const likedProducts = await this.prisma.like.findMany({
      where: { userId },
      select: { productId: true },
    });
    return likedProducts.map((like) => like.productId);
  }
}
