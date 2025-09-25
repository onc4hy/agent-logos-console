export interface Payment {
  id: string
  userId: number
  amount: number
  currency: string
  method: string
  status: string
  createdAt: Date
}

export interface CreatePaymentResponse {
  payment: Payment
  paymentUrl: string
}

export interface VerifyPaymentResponse {
  success: boolean
  message: string
  transactionId: string
}

export interface ProcessPaymentResponse {
  userId: number
  pointsAdded: number
  totalPoints: number
}
