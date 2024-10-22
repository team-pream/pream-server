import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({
    summary: '전체 카테고리 리스트 조회',
    description: '전체 카테고리 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    type: [CategoryResponseDto],
  })
  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
