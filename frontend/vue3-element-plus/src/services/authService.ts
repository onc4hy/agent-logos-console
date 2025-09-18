// src/services/authService.ts
import api from './api'

// 定义API响应类型
interface ApiResponse {
  message?: string
  access_token?: string
  user?: {
    id: number
    email: string
    name: string
    phone?: string
  }
}

// 发送手机验证码
export const sendPhoneCode = async (phone: string) => {
  try {
    const response: ApiResponse = await api.post('/auth/send-phone-code', { phone })
    return { success: true, data: response }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message || '发送验证码失败' }
    }
    return { success: false, error: '发送验证码失败' }
  }
}

// 发送邮箱验证码
export const sendEmailCode = async (email: string) => {
  try {
    const response: ApiResponse = await api.post('/auth/send-email-code', { email })
    return { success: true, data: response }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message || '发送验证码失败' }
    }
    return { success: false, error: '发送验证码失败' }
  }
}

// 手机验证码登录/注册
export const loginWithPhone = async (phone: string, code: string) => {
  try {
    const response: ApiResponse = await api.post('/auth/login-phone', { phone, code })
    return { success: true, data: response }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message || '登录失败' }
    }
    return { success: false, error: '登录失败' }
  }
}

// 邮箱密码登录
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const response: ApiResponse = await api.post('/auth/login', { email, password })
    return { success: true, data: response }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message || '登录失败' }
    }
    return { success: false, error: '登录失败' }
  }
}

// 用户注册
export const register = async (userData: { email: string; password: string; name: string; phone?: string }) => {
  try {
    const response: ApiResponse = await api.post('/auth/register', userData)
    return { success: true, data: response }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message || '注册失败' }
    }
    return { success: false, error: '注册失败' }
  }
}

// 退出登录
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// 检查用户是否已登录
export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}

// 获取用户信息
export const getUserInfo = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// 保存用户信息
export const saveUserInfo = (token: string, user: { id: number; email: string; name: string; phone?: string }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}
