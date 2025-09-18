import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'
// 导入正确的类型
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>

  constructor(private configService: ConfigService) {
    // 创建邮件传输器
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    })
  }

  /**
   * 发送邮件验证码
   * @param to 收件人邮箱
   * @param code 验证码
   */
  async sendVerificationCode(to: string, code: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>(
          'MAIL_FROM',
          '"AI Agent Platform" <no-reply@aiagent.com>',
        ),
        to,
        subject: '邮箱验证码',
        text: `您的验证码是: ${code}，有效期为5分钟。`,
        html: `
          <div style="padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333;">邮箱验证码</h2>
              <p>您好！</p>
              <p>您正在注册AI Agent平台账户，您的验证码是：</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #409EFF; letter-spacing: 5px;">${code}</span>
              </div>
              <p>验证码有效期为5分钟，请尽快使用。</p>
              <p>如非本人操作，请忽略此邮件。</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
            </div>
          </div>
        `,
      })

      console.log('邮件发送成功:', info.messageId)
      return true
    } catch (error) {
      console.error('邮件发送失败:', error)
      return false
    }
  }
}
