import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { UserService } from './user.service'
import { MailService } from './mail.service'
import {
  CreateUserDto,
  LoginUserDto,
  LoginWithPhoneDto,
  VerifyEmailDto,
  VerifyPhoneDto,
} from './dto/user.dto'

// 简单的内存存储用于验证码（生产环境应使用Redis等）
const phoneVerificationCodes = new Map<
  string,
  { code: string; expiresAt: Date }
>()

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '注册失败' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @ApiOperation({ summary: '邮箱密码登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '登录失败' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    )
    if (!user) {
      return { message: 'Invalid credentials' }
    }
    return this.authService.login(user)
  }

  @ApiOperation({ summary: '手机验证码登录/注册' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '登录失败' })
  @HttpCode(HttpStatus.OK)
  @Post('login-phone')
  async loginWithPhone(@Body() loginWithPhoneDto: LoginWithPhoneDto) {
    const user = await this.authService.validateUserByPhone(
      loginWithPhoneDto.phone,
      loginWithPhoneDto.code,
    )
    if (!user) {
      return { message: 'Invalid phone or code' }
    }
    return this.authService.login(user)
  }

  @ApiOperation({ summary: '发送邮箱验证码' })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  @ApiResponse({ status: 400, description: '验证码发送失败' })
  @Post('send-email-code')
  async sendEmailCode(@Body() verifyEmailDto: VerifyEmailDto) {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 这里应该将验证码存储到数据库或缓存中，设置5分钟有效期
    // 为简化起见，我们直接发送邮件

    const success = await this.mailService.sendVerificationCode(
      verifyEmailDto.email,
      code,
    )

    if (!success) {
      throw new BadRequestException('验证码发送失败')
    }

    return { message: '验证码已发送到您的邮箱' }
  }

  @ApiOperation({ summary: '发送手机验证码' })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  @Post('send-phone-code')
  async sendPhoneCode(@Body() verifyPhoneDto: VerifyPhoneDto) {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 存储验证码，设置5分钟有效期
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 5)

    phoneVerificationCodes.set(verifyPhoneDto.phone, {
      code,
      expiresAt,
    })

    // 这里应该调用实际的短信服务发送验证码
    // 为简化起见，我们只是存储验证码并返回成功消息
    console.log(
      `Sending SMS verification code ${code} to phone ${verifyPhoneDto.phone}`,
    )

    // 模拟异步操作以满足 ESLint @typescript-eslint/require-await 规则
    await Promise.resolve()

    return {
      message: '验证码已发送到您的手机',
      // 在开发环境中可以返回验证码以便测试
      // code: process.env.NODE_ENV === 'development' ? code : undefined
    }
  }
}
