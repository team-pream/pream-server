import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getProductById({
    productId,
    userId,
  }: {
    productId: number;
    userId: string;
  }) {
    const likedProductIds = userId ? await this.getLikedProductIds(userId) : [];

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        condition: true,
        images: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException({ errorCode: -855 });
    }

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      status: product.status,
      images: product.images,
      description: product.description,
      createdAt: product.createdAt,
      category: product.category,
      seller: product.seller,
      likesCount: product._count.likes,
      isLiked: likedProductIds.includes(product.id),
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
