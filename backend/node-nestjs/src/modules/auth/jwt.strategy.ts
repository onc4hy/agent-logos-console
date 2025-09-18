import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UserService } from './user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // 在生产环境中应该使用环境变量
    })
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub)
    return user ? { id: user.id, email: user.email, name: user.name } : null
  }
}
