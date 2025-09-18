import { Injectable } from '@nestjs/common'
import { UserService } from '../auth/user.service'

@Injectable()
export class PointsService {
  constructor(private userService: UserService) {}

  async checkIn(userId: number): Promise<any> {
    // 检查用户今天是否已经签到
    // 为简化起见，我们假设用户可以每天签到

    // 获取连续签到天数（模拟）
    const consecutiveDays = Math.floor(Math.random() * 7) + 1

    // 计算签到积分
    let points = 10
    if (consecutiveDays >= 7) {
      points += 50 // 连续签到7天额外奖励
    }

    // 更新用户积分
    const user = await this.userService.updatePoints(userId, points)

    return {
      success: true,
      pointsEarned: points,
      totalPoints: user.points,
      consecutiveDays,
    }
  }

  async getUserPoints(userId: number): Promise<any> {
    const user = await this.userService.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      points: user.points,
    }
  }
}
