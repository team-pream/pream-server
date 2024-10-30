import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductListResponseDto } from './dto/product.dto';
import { PRODUCT_STATUS, ProductStatusType } from './constants/product';
import { JwtOptionalAuthGuard } from '~/auth/jwt/jwt-optional-auth.guard';
import { ProductDetailDto } from './dto/product-detail.dto';
import { GetProductsCurationResponseDto } from './dto/curated-product.dto';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { SalesListProductResponseDto } from './dto/sales-list-product.dto';

@ApiTags('Product')
@Controller('products')
@UseGuards(JwtOptionalAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({
    summary: '메인 페이지 상품 리스트 조회',
    description: '메인 페이지 상품 리스트를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '큐레이션 된 상품 목록을 반환합니다.',
    type: GetProductsCurationResponseDto,
  })
  @Get('curation')
  async getProductsCuration() {
    return await this.productService.getProductsCuration();
  }

  @ApiOperation({
    summary: '특정 카테고리 상품 리스트 조회',
    description:
      '특정 카테고리의 상품 목록을 조회합니다.<br/>상품 목록은 생성일(createdAt)값을 기준으로 내림차순(최신순) 정렬되어 반환됩니다.<br/>카테고리를 지정하지 않으면 전체 상품 목록이 반환됩니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: false,
  })
  @ApiQuery({
    name: 'category',
    description: '카테고리 id',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    description: '상품 상태<br/>AVAILABLE: 1, SOLD_OUT: 2',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description:
      '특정 카테고리의 상품 목록을 반환합니다.<br/>로그인하지 않은 사용자가 조회하는 경우, 각 상품의 isLiked 필드는 false로 반환됩니다.',
    type: ProductListResponseDto,
  })
  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('status') status?: ProductStatusType,
    @Request() req?: any,
  ) {
    const userId = req.user?.id;

    if (category) {
      return this.productService.getProductsByCategory({
        userId,
        status: PRODUCT_STATUS[status],
        categoryId: Number(category),
      });
    }

    return this.productService.getAllProducts();
  }

  @ApiOperation({
    summary: '판매 내역 조회',
    description: '사용자의 판매 등록 내역을 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      '판매하기 위해 등록한 상품의 내역을 조회합니다.<br/>상품 목록은 생성일(createdAt)값을 기준으로 내림차순(최신순) 정렬되어 반환됩니다.',
    type: [SalesListProductResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: '유효하지 않은 사용자 - Access token이 유효하지 않거나 만료됨',
    content: {
      'application/json': {
        example: {
          errorCode: -825,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 사용자 - Authorization 헤더가 없는 경우',
    content: {
      'application/json': {
        example: {
          errorCode: -954,
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('sales-list')
  async getProductsSalesHistory(@Request() req?: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException({ errorCode: -825 });
    }

    return await this.productService.getProductsBySellerId({
      userId,
    });
  }

  @ApiOperation({
    summary: '상품 상세 데이터 조회',
    description: '특정 상품의 상세 정보를 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: false,
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: '상품 ID',
  })
  @ApiResponse({
    status: 200,
    description:
      '특정 상품의 상세 정보를 반환합니다.<br/>로그인하지 않은 사용자가 조회하는 경우, 각 상품의 isLiked 필드는 false로 반환됩니다.',
    type: ProductDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: '상품 ID가 잘못되었거나 존재하지 않는 경우',
    example: { errorCode: -855 },
  })
  @Get(':productId')
  async getProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Request() req?: any,
  ) {
    const userId = req.user?.id;
    return await this.productService.getProductById({
      productId,
      userId,
    });
  }
}
