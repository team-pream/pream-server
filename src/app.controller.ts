import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from '~/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '서버 실행 확인',
    description: 'Pream server is running!',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
