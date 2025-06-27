import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateImageDto, UpdateImageDto, ImageQueryDto } from './dto/image.dto';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new image' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @CurrentUser() user: any,
  ) {
    return this.imagesService.create(createImageDto, file, user._id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get all public images with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Images retrieved successfully' })
  async findAll(@Query() query: ImageQueryDto, @CurrentUser() user?: any) {
    return this.imagesService.findAll(query, user?._id);
  }

  @Get('my-images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user images' })
  @ApiResponse({ status: 200, description: 'User images retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserImages(
    @CurrentUser() user: any,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 12,
  ) {
    return this.imagesService.getUserImages(user._id, page, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get image statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.imagesService.getImageStats();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all image categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    return this.imagesService.getCategories();
  }

  @Get('trending-tags')
  @ApiOperation({ summary: 'Get trending tags' })
  @ApiResponse({ status: 200, description: 'Trending tags retrieved successfully' })
  async getTrendingTags(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.imagesService.getTrendingTags(limit);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific image by ID' })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 403, description: 'Access denied to private image' })
  async findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.imagesService.findOne(id, user?._id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an image' })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only update your own images' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @CurrentUser() user: any,
  ) {
    return this.imagesService.update(id, updateImageDto, user._id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only delete your own images' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.imagesService.remove(id, user._id);
    return { message: 'Image deleted successfully' };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/Unlike an image' })
  @ApiResponse({ status: 200, description: 'Image like status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async likeImage(@Param('id') id: string, @CurrentUser() user: any) {
    return this.imagesService.likeImage(id, user._id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Download an image' })
  @ApiResponse({ status: 200, description: 'Download URL provided' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 403, description: 'Cannot download private image' })
  async downloadImage(@Param('id') id: string) {
    return this.imagesService.downloadImage(id);
  }
}
