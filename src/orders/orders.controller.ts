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
import { PostOrdersProductRequestDto } from './dto/post-orders.dto';

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
    // type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: { errorCode: -825 },
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
}
