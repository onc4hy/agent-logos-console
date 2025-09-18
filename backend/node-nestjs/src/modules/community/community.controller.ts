import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PostService } from './post.service'
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('社区')
@Controller('community')
export class CommunityController {
  constructor(private postService: PostService) {}

  @ApiOperation({ summary: '创建帖子' })
  @ApiResponse({ status: 201, description: '帖子创建成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('posts')
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user.id, createPostDto)
  }

  @ApiOperation({ summary: '获取所有帖子' })
  @ApiResponse({ status: 200, description: '获取帖子列表成功' })
  @Get('posts')
  async findAllPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postService.findAll(page, limit)
  }

  @ApiOperation({ summary: '获取指定帖子' })
  @ApiResponse({ status: 200, description: '获取帖子成功' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  @Get('posts/:id')
  async findOnePost(@Param('id') id: string) {
    return this.postService.findOne(+id)
  }

  @ApiOperation({ summary: '更新帖子' })
  @ApiResponse({ status: 200, description: '更新帖子成功' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+id, updatePostDto)
  }

  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ status: 200, description: '删除帖子成功' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  async removePost(@Param('id') id: string) {
    return this.postService.remove(+id)
  }

  @ApiOperation({ summary: '获取当前用户的所有帖子' })
  @ApiResponse({ status: 200, description: '获取帖子列表成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  async findMyPosts(@Request() req) {
    return this.postService.findByUser(req.user.id)
  }

  @ApiOperation({ summary: '添加评论' })
  @ApiResponse({ status: 201, description: '评论添加成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('comments')
  async addComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.postService.addComment(req.user.id, createCommentDto)
  }

  @ApiOperation({ summary: '点赞帖子' })
  @ApiResponse({ status: 200, description: '点赞成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('posts/:id/like')
  async likePost(@Param('id') id: string) {
    await this.postService.likePost(+id)
    return { message: 'Post liked successfully' }
  }

  @ApiOperation({ summary: '点赞评论' })
  @ApiResponse({ status: 200, description: '点赞成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/like')
  async likeComment(@Param('id') id: string) {
    await this.postService.likeComment(+id)
    return { message: 'Comment liked successfully' }
  }
}
