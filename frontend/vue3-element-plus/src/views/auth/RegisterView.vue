<template>
  <AuthLayout>
    <div class="mx-auto mt-8 max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">创建账户</h1>
        <p class="text-on-surface-light">注册新账户以开始使用</p>
      </div>

      <el-tabs v-model="activeTab" class="mb-6">
        <el-tab-pane label="短信验证码注册" name="sms">
          <el-form :model="smsForm" :rules="smsRules" ref="smsFormRef" label-width="0">
            <el-form-item prop="phone">
              <el-input
                v-model="smsForm.phone"
                placeholder="请输入手机号"
                size="large"
                prefix-icon="Phone"
              />
            </el-form-item>

            <el-form-item prop="code">
              <div class="flex flex-1 gap-2">
                <el-input
                  v-model="smsForm.code"
                  placeholder="请输入验证码"
                  size="large"
                  prefix-icon="Lock"
                />
                <el-button
                  :disabled="smsCodeDisabled"
                  @click="sendSmsCode"
                  size="large"
                >
                  {{ smsCodeButtonText }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="handleSmsRegister"
                size="large"
                class="w-full"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="邮箱账号注册" name="email">
          <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef" label-width="0">
            <el-form-item prop="email">
              <el-input
                v-model="emailForm.email"
                placeholder="请输入邮箱"
                size="large"
                prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="emailForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="emailForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="handleEmailRegister"
                size="large"
                class="w-full"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="text-center">
        <router-link to="/login" class="text-primary text-sm">已有账号？立即登录</router-link>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormItemRule } from 'element-plus'

const router = useRouter()
const activeTab = ref('sms')

// 短信注册表单
const smsForm = reactive({
  phone: '',
  code: ''
})

// 邮箱注册表单
const emailForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const smsRules: Record<string, FormItemRule[]> = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const emailRules: Record<string, FormItemRule[]> = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== emailForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 短信验证码相关
const smsCodeDisabled = ref(false)
const smsCodeCountdown = ref(0)
const smsCodeButtonText = computed(() => {
  if (smsCodeCountdown.value > 0) {
    return `${smsCodeCountdown.value}秒后重新发送`
  }
  return '发送验证码'
})

// 发送短信验证码
const sendSmsCode = () => {
  if (!smsForm.phone) {
    ElMessage.error('请输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(smsForm.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  // 模拟发送验证码
  smsCodeDisabled.value = true
  smsCodeCountdown.value = 60

  const timer = setInterval(() => {
    smsCodeCountdown.value--
    if (smsCodeCountdown.value <= 0) {
      clearInterval(timer)
      smsCodeDisabled.value = false
    }
  }, 1000)

  ElMessage.success('验证码已发送')
}

// 短信注册处理
const handleSmsRegister = () => {
  // 这里应该调用注册API
  ElMessage.success('注册成功')

  // 通过事件更新主布局的登录状态
  window.dispatchEvent(new CustomEvent('user-login', { detail: { isLoggedIn: true, name: '用户' } }))

  router.push('/dashboard')
}

// 邮箱注册处理
const handleEmailRegister = () => {
  // 这里应该调用注册API
  ElMessage.success('注册成功')

  // 通过事件更新主布局的登录状态
  window.dispatchEvent(new CustomEvent('user-login', { detail: { isLoggedIn: true, name: '用户' } }))

  router.push('/dashboard')
}
</script>
