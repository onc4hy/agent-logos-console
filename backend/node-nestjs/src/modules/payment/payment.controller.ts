import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PaymentService } from './payment.service'
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('支付')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiOperation({ summary: '创建支付订单' })
  @ApiResponse({ status: 201, description: '支付订单创建成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(req.user.id, createPaymentDto)
  }

  @ApiOperation({ summary: '验证支付结果' })
  @ApiResponse({ status: 200, description: '支付验证成功' })
  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(verifyPaymentDto)
  }
}
