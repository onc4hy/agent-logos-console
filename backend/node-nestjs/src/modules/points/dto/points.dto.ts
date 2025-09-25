// points.dto.ts
export class CheckInDto {
  userId: number
}

export class AddPointsDto {
  userId: number
  points: number
  reason: string // 积分变动原因
}

// 新增返回类型定义
export class CheckInResponseDto {
  success: boolean
  pointsEarned: number
  totalPoints: number
  consecutiveDays: number
}

export class GetUserPointsResponseDto {
  points: number
}
