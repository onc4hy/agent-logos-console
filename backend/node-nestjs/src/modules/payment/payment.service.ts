import { Injectable } from '@nestjs/common'
import { UserService } from '../auth/user.service'
import {
  CreatePaymentResponse,
  VerifyPaymentResponse,
  ProcessPaymentResponse,
} from './interfaces/payment.interface'
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto'

@Injectable()
export class PaymentService {
  constructor(private userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async createPayment(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponse> {
    // 这里应该集成实际的支付网关（微信支付、支付宝等）
    // 为简化起见，我们返回模拟数据

    const payment = {
      id: `pay_${Date.now()}`,
      userId,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      method: createPaymentDto.method,
      status: 'pending',
      createdAt: new Date(),
    }

    return {
      payment,
      // 模拟支付链接
      paymentUrl: `https://payment.example.com/pay/${payment.id}`,
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async verifyPayment(
    verifyPaymentDto: VerifyPaymentDto,
  ): Promise<VerifyPaymentResponse> {
    // 验证支付结果
    // 为简化起见，我们假设支付成功

    return {
      success: true,
      message: 'Payment verified successfully',
      transactionId: verifyPaymentDto.transactionId,
    }
  }

  async processSuccessfulPayment(
    userId: number,
    amount: number,
  ): Promise<ProcessPaymentResponse> {
    // 处理支付成功的逻辑
    // 例如：为用户添加积分或升级套餐

    // 假设每支付1元获得10积分
    const points = amount * 10
    const user = await this.userService.updatePoints(userId, points)

    return {
      userId,
      pointsAdded: points,
      totalPoints: user.points,
    }
  }
}
