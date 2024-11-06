import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';
import {
  PostOrderProductResponseDto,
  PostOrdersProductRequestDto,
} from './dto/post-orders.dto';
import { ERROR_RESPONSE } from '~/errors/error';
import { PostOrdersProductCancelRequestDto } from './dto/cancel-orders.dto';

@ApiTags('Orders')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({
    summary: '주문 정보 전송',
    description: '결제로 넘어가기 전 주문 정보를 DB에 저장합니다.',
  })
  @ApiBody({
    type: PostOrdersProductRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: '주문 정보 등록 성공',
    type: PostOrderProductResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @ApiResponse({
    status: 400,
    description: '필수 요청 값이 누락된 경우',
    example: ERROR_RESPONSE.ORDER_REQUIRED_FIELD_MISSING,
  })
  @ApiResponse({
    status: 406,
    description: '유효하지 않은 상품 ID인 경우',
    example: ERROR_RESPONSE.INVALID_ORDER_PRODUCT_ID,
  })
  @Post(':productId')
  async postOrdersProduct(
    @Param('productId') productId: string,
    @Body() postOrdersRequest: PostOrdersProductRequestDto,
    @Request()
    req: JwtRequest,
  ) {
    const userId = req.user?.id;
    return this.ordersService.postOrdersProduct({
      userId,
      productId: Number(productId),
      postOrdersRequest,
    });
  }

  @ApiOperation({
    summary: '주문 취소',
    description:
      '상품 구매 후 구매확정을 하지 않고 1주일이 지나지 않았을 경우 취소합니다.',
  })
  @ApiBody({
    type: PostOrdersProductCancelRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '주문 취소 성공',
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: ERROR_RESPONSE.INVALID_ACCESS_TOKEN,
  })
  @Post(':orderId/cancel')
  async postOrdersProductCancel(
    @Param('orderId') orderId: string,
    @Body()
    postOrdersProductCancelRequest: PostOrdersProductCancelRequestDto,
    @Request()
    req: JwtRequest,
  ) {
    const userId = req.user?.id;
    return this.ordersService.postOrdersProductCancel({
      userId,
      orderId,
      postOrdersProductCancelRequest,
    });
  }
}
