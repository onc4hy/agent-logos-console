<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'

const router = useRouter()
const activeTab = ref('sms')

// 短信登录表单
const smsForm = reactive({
  phone: '',
  code: ''
})

// 密码登录表单
const passwordForm = reactive({
  email: '',
  password: ''
})

// 表单验证规则
const smsRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
} as FormRules

const passwordRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email' as const, message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
} as FormRules

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

// 短信登录处理
const handleSmsLogin = () => {
  // 这里应该调用登录API
  ElMessage.success('登录成功')

  // 通过事件更新主布局的登录状态
  window.dispatchEvent(new CustomEvent('user-login', { detail: { isLoggedIn: true, name: '用户' } }))

  router.push('/dashboard')
}

// 密码登录处理
const handlePasswordLogin = () => {
  // 这里应该调用登录API
  ElMessage.success('登录成功')

  // 通过事件更新主布局的登录状态
  window.dispatchEvent(new CustomEvent('user-login', { detail: { isLoggedIn: true, name: '用户' } }))

  router.push('/dashboard')
}
</script>

<template>
  <AuthLayout>
    <div class="mx-auto my-8 max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">欢迎回来</h1>
        <p class="text-on-surface-light">登录您的账户以继续</p>
      </div>

      <el-tabs v-model="activeTab" class="mb-6">
        <el-tab-pane label="短信验证码登录" name="sms">
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
                  class="flex-1"
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
                @click="handleSmsLogin"
                size="large"
                class="w-full"
              >
                登录/注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="账号密码登录" name="password">
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="0">
            <el-form-item prop="email">
              <el-input
                v-model="passwordForm.email"
                placeholder="请输入邮箱"
                size="large"
                prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="passwordForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="handlePasswordLogin"
                size="large"
                class="w-full"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="text-center">
        <router-link to="/register" class="text-primary text-sm">没有账号？立即注册</router-link>
      </div>
    </div>
  </AuthLayout>
</template>
