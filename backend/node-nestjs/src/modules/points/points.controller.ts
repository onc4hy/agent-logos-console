import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PointsService } from './points.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('积分')
@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  @ApiOperation({ summary: '用户签到' })
  @ApiResponse({ status: 200, description: '签到成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  async checkIn(@Request() req) {
    return this.pointsService.checkIn(req.user.id)
  }

  @ApiOperation({ summary: '获取用户积分' })
  @ApiResponse({ status: 200, description: '获取积分成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getPoints(@Request() req) {
    return this.pointsService.getUserPoints(req.user.id)
  }
}
