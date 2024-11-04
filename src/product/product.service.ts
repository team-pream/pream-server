import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { ProductStatusType } from './constants/product';
import { Product } from '@prisma/client';
import { PostProductsUploadDto } from './dto/post-products-upload.dto';
import { AwsService } from '~/aws/aws.service';
import { PatchProductsDetailDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private awsService: AwsService,
  ) {}

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
            contact: true,
            bankAccount: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        createdAt: true,
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
      condition: product.condition,
      images: product.images,
      description: product.description,
      createdAt: product.createdAt,
      category: product.category,
      seller: product.seller,
      likesCount: product._count.likes,
      isLiked: likedProductIds.includes(product.id),
    };
  }

  async getProductsCuration() {
    const newProducts = await this.prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        images: true,
        categoryId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const randomProducts = await this.getRandomProducts(10);

    const cheapProductIds = [
      289947809, 292952649, 137879392, 293104651, 267398757, 149716292,
    ];

    const cheapProducts = await this.prisma.product.findMany({
      where: { id: { in: cheapProductIds } },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        images: true,
        categoryId: true,
      },
    });

    const popularProductIds = [
      295848682, 294321046, 232232085, 292242428, 295838320, 223291642,
      293094076, 254440095, 295925329, 206069835, 259941454,
    ];

    const popularProducts = await this.prisma.product.findMany({
      where: { id: { in: popularProductIds } },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        images: true,
        categoryId: true,
      },
    });

    return {
      new: newProducts,
      random: randomProducts,
      cheap: cheapProducts,
      popular: popularProducts,
    };
  }

  async getProductsBySellerId({ userId }: { userId: string }) {
    return this.prisma.product.findMany({
      where: { sellerId: userId },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        images: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async getLikedProductIds(userId: string): Promise<number[]> {
    const likedProducts = await this.prisma.like.findMany({
      where: { userId },
      select: { productId: true },
    });
    return likedProducts.map((like) => like.productId);
  }

  private async getRandomProducts(limit: number = 10): Promise<Product[]> {
    return this.prisma.$queryRaw`
      SELECT id, title, price, status, images, 'categoryId'
      FROM "Product"
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;
  }

  async postProductsUpload({
    userId,
    postProductsUploadDto,
    images,
  }: {
    userId: string;
    postProductsUploadDto: PostProductsUploadDto;
    images: Express.Multer.File[];
  }) {
    const { condition, price, categoryId, title, description, contact } =
      postProductsUploadDto;

    const imageUrls = await Promise.all(
      images.map((image) =>
        this.awsService.uploadFile(
          image,
          process.env.AWS_S3_BUCKET_NAME,
          'product-images',
        ),
      ),
    );

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { contact },
      });

      return this.prisma.product.create({
        data: {
          sellerId: userId,
          images: imageUrls,
          condition,
          price: Number(price),
          categoryId: Number(categoryId),
          title,
          description,
          status: 'AVAILABLE',
        },
      });
    } catch {
      throw new Error('상품 등록에 실패했습니다.');
    }
  }

  async patchProductsDetail({
    userId,
    productId,
    patchProductsDetailDto,
    images,
  }: {
    userId: string;
    productId: number;
    patchProductsDetailDto: PatchProductsDetailDto;
    images?: Express.Multer.File[];
  }) {
    const {
      condition,
      price,
      categoryId,
      title,
      description,
      contact,
      bankAccount,
    } = patchProductsDetailDto;

    // 기존 상품 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.sellerId !== userId) {
      throw new BadRequestException({ errorCode: -855 });
    }

    let imageUrls = product.images;
    if (images && images.length > 0) {
      imageUrls = await Promise.all(
        images.map((image) =>
          this.awsService.uploadFile(
            image,
            process.env.AWS_S3_BUCKET_NAME,
            'product-images',
          ),
        ),
      );
    }

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { contact, bankAccount: JSON.parse(bankAccount) },
      });

      return this.prisma.product.update({
        where: { id: productId },
        data: {
          images: imageUrls,
          condition,
          price: Number(price),
          categoryId: Number(categoryId),
          title,
          description,
        },
      });
    } catch {
      throw new Error('상품 수정에 실패했습니다.');
    }
  }

  async deleteProductsDetail({
    userId,
    productId,
  }: {
    userId: string;
    productId: number;
  }) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.sellerId !== userId) {
      throw new ForbiddenException({ errorCode: -856 });
    }

    try {
      await this.prisma.product.delete({
        where: { id: productId },
      });
      return { message: '상품이 삭제되었습니다.' };
    } catch {
      throw new InternalServerErrorException({ errorCode: -857 });
    }
  }

  async searchProducts({
    keyword,
    status,
  }: {
    keyword: string;
    status?: ProductStatusType;
  }) {
    const whereConditions: any = { title: { contains: keyword } };

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
      products,
    };
  }
}
