import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PointsService } from './points.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CheckInResponseDto, GetUserPointsResponseDto } from './dto/points.dto'

interface AuthenticatedRequest extends Request {
  user: {
    id: number
    email: string
    name: string
  }
}

@ApiTags('积分')
@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  @ApiOperation({ summary: '用户签到' })
  @ApiResponse({
    status: 200,
    description: '签到成功',
    type: CheckInResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  async checkIn(
    @Request() req: AuthenticatedRequest,
  ): Promise<CheckInResponseDto> {
    return this.pointsService.checkIn(req.user.id)
  }

  @ApiOperation({ summary: '获取用户积分' })
  @ApiResponse({
    status: 200,
    description: '获取积分成功',
    type: GetUserPointsResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getPoints(
    @Request() req: AuthenticatedRequest,
  ): Promise<GetUserPointsResponseDto> {
    return this.pointsService.getUserPoints(req.user.id)
  }
}
