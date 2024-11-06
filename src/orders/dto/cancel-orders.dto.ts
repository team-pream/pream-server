import { ApiProperty } from '@nestjs/swagger';

export class PostOrdersProductCancelRequestDto {
  @ApiProperty({
    example: '사용자 취소',
    description: '취소 사유',
    nullable: true,
  })
  cancelReason?: string;
}
