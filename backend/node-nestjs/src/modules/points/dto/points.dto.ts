// points.dto.ts
export class CheckInDto {
  userId: number
}

export class AddPointsDto {
  userId: number
  points: number
  reason: string // 积分变动原因
}
