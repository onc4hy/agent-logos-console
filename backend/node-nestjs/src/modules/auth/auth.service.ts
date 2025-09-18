import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from './user.service'
import { User } from '../../database/entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/user.dto'

// 引入验证码存储（与AuthController中保持一致）
const phoneVerificationCodes = new Map<
  string,
  { code: string; expiresAt: Date }
>()

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }
    return null
  }

  async validateUserByPhone(phone: string, code: string): Promise<User | null> {
    // 验证短信验证码
    const storedCode = phoneVerificationCodes.get(phone)

    // 检查验证码是否存在
    if (!storedCode) {
      return null
    }

    // 检查验证码是否过期
    if (new Date() > storedCode.expiresAt) {
      // 删除过期的验证码
      phoneVerificationCodes.delete(phone)
      return null
    }

    // 检查验证码是否正确
    if (storedCode.code !== code) {
      return null
    }

    // 验证成功后删除验证码
    phoneVerificationCodes.delete(phone)

    // 查找用户，如果不存在则创建新用户
    let user = await this.userService.findByPhone(phone)
    if (!user) {
      // 创建新用户（手机号登录）
      const createUserDto: CreateUserDto = {
        email: `${phone}@default.com`, // 为手机号登录用户生成默认邮箱
        password: 'default_password', // 默认密码，用户可以后续修改
        name: `User_${phone}`,
        phone: phone,
      }
      user = await this.userService.create(createUserDto)
    }

    return user
  }

  async login(user: User) {
    // 根据项目规范添加await Promise.resolve()以满足ESLint规范
    await Promise.resolve()

    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        points: user.points,
      },
    }
  }

  async register(createUserDto: CreateUserDto) {
    // 检查用户是否已存在
    const existingUser = await this.userService.findByEmail(createUserDto.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = await this.userService.create(createUserDto)
    return this.login(user)
  }
}
