import { User } from '../../../database/entities/user.entity'

export interface AuthenticatedRequest {
  user: User
  // 可以根据需要添加其他属性
}
