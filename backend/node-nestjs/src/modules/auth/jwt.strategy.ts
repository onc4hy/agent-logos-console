import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UserService } from './user.service'

// 定义JWT payload的接口
interface JwtPayload {
  sub: number
  email: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const jwtFromRequest: JwtFromRequestFunction =
      ExtractJwt.fromAuthHeaderAsBearerToken()
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // 在生产环境中应该使用环境变量
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub)
    return user ? { id: user.id, email: user.email, name: user.name } : null
  }
}
