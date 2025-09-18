import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { User } from '../../database/entities/user.entity'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MailService } from './mail.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key', // 在生产环境中应该使用环境变量
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [UserService, AuthService, MailService],
  controllers: [AuthController],
  exports: [UserService, AuthService, MailService],
})
export class AuthModule {}
