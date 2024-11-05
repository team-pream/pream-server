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
import { PaymentsService } from './payments.service';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';
import { PostOrdersRequestDto } from './dto/post-orders.dto';

@ApiTags('Payments')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({
    summary: '주문 정보 전송',
    description: '결제로 넘어가기 전 주문 정보를 DB에 저장합니다.',
  })
  @ApiBody({
    type: PostOrdersRequestDto,
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
  @Post(':proudctId')
  async postOrderSheet(
    @Param('productId') productId: string,
    @Body() postOrdersRequest: PostOrdersRequestDto,
    @Request()
    req: JwtRequest,
  ) {
    const userId = req.user?.id;
    return this.paymentsService.postOrderSheet({
      userId,
      productId: Number(productId),
      postOrdersRequest,
    });
  }
}
