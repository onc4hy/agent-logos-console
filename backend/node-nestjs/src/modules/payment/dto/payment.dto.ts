// payment.dto.ts
export class CreatePaymentDto {
  amount: number
  currency: string
  method: 'wechat' | 'alipay' // 支付方式
  planId?: string // 套餐ID
}

export class VerifyPaymentDto {
  paymentId: string
  transactionId: string // 第三方交易ID
}
