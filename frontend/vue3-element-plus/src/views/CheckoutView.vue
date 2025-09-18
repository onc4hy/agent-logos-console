<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 text-on-surface-light">订阅购买</h1>
      <p class="text-center text-on-surface-light mb-12 max-w-2xl mx-auto">选择并购买适合你的订阅计划</p>

      <div class="max-w-4xl mx-auto">
        <el-steps :active="currentStep" finish-status="success" align-center class="mb-12">
          <el-step title="选择套餐"></el-step>
          <el-step title="确认订单"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>

        <!-- 步骤1: 选择套餐 -->
        <div v-if="currentStep === 0">
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-on-surface-light">选择套餐</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="plan in plans"
                :key="plan.id"
                :class="[
                  'border rounded-lg p-6 cursor-pointer transition-all',
                  selectedPlan?.id === plan.id
                    ? 'border-primary bg-blue-50 border-2'
                    : 'border-surface-high-light hover:border-primary'
                ]"
                @click="selectPlan(plan)"
              >
                <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
                <div class="mb-4">
                  <span class="text-2xl font-bold">¥{{ plan.price }}</span>
                  <span class="text-on-surface-light">/{{ plan.period }}</span>
                </div>
                <ul class="space-y-2 mb-4">
                  <li
                    v-for="feature in plan.features"
                    :key="feature"
                    class="flex items-center"
                  >
                    <el-icon class="text-success mr-2"><Check /></el-icon>
                    <span class="text-sm">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <el-button
              type="primary"
              size="large"
              :disabled="!selectedPlan"
              @click="nextStep"
            >
              下一步
            </el-button>
          </div>
        </div>

        <!-- 步骤2: 确认订单 -->
        <div v-else-if="currentStep === 1">
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-on-surface-light">确认订单</h2>

            <div class="border border-surface-high-light rounded-lg p-6 mb-6">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h3 class="text-lg font-bold">{{ selectedPlan?.name }}套餐</h3>
                  <p class="text-on-surface-light">有效期：{{ selectedPlan?.period }}</p>
                </div>
                <div class="text-lg font-bold">¥{{ selectedPlan?.price }}</div>
              </div>
            </div>

            <div class="flex justify-between items-center border-t border-surface-high-light pt-4">
              <span class="text-lg font-bold">总计：</span>
              <span class="text-2xl font-bold text-primary">¥{{ selectedPlan?.price }}</span>
            </div>
          </div>

          <div class="flex justify-between">
            <el-button @click="prevStep">上一步</el-button>
            <el-button type="primary" size="large" @click="nextStep">去支付</el-button>
          </div>
        </div>

        <!-- 步骤3: 支付 -->
        <div v-else-if="currentStep === 2">
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-on-surface-light">选择支付方式</h2>

            <div class="border border-surface-high-light rounded-lg p-6 mb-6">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h3 class="text-lg font-bold">{{ selectedPlan?.name }}套餐</h3>
                </div>
                <div class="text-lg font-bold">¥{{ selectedPlan?.price }}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                :class="[
                  'border rounded-lg p-6 cursor-pointer flex items-center',
                  selectedPaymentMethod?.id === method.id
                    ? 'border-primary bg-blue-50 border-2'
                    : 'border-surface-high-light hover:border-primary'
                ]"
                @click="selectPaymentMethod(method)"
              >
                <el-icon :size="32" class="mr-4">
                  <component :is="method.icon" />
                </el-icon>
                <div>
                  <h3 class="font-bold">{{ method.name }}</h3>
                  <p class="text-sm text-on-surface-light">{{ method.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <el-button @click="prevStep">上一步</el-button>
            <el-button
              type="primary"
              size="large"
              :disabled="!selectedPaymentMethod"
              @click="handlePayment"
            >
              立即支付
            </el-button>
          </div>
        </div>

        <!-- 步骤4: 完成 -->
        <div v-else>
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
            <el-icon :size="64" class="text-success mb-4"><SuccessFilled /></el-icon>
            <h2 class="text-2xl font-bold mb-4">支付成功！</h2>
            <p class="text-on-surface-light mb-6">恭喜你成功购买了{{ selectedPlan?.name }}套餐</p>
            <el-button type="primary" @click="$router.push('/dashboard')">进入控制台</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElSteps, ElStep, ElIcon } from 'element-plus'
import { Check, SuccessFilled } from '@element-plus/icons-vue'

// 定义套餐数据
const plans = [
  {
    id: 'basic',
    name: '基础版',
    price: 29,
    period: '月',
    features: [
      '创建3个智能体',
      '基础人格定制',
      '发布到2个平台',
      '基础数据分析'
    ]
  },
  {
    id: 'pro',
    name: '专业版',
    price: 99,
    period: '月',
    features: [
      '创建10个智能体',
      '高级人格定制',
      '发布到5个平台',
      '高级数据分析',
      '专属品牌空间'
    ]
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 299,
    period: '月',
    features: [
      '无限创建智能体',
      '高级人格定制',
      '无限平台发布',
      '高级数据分析',
      '专属品牌空间',
      '创作者收益计划'
    ]
  }

]

// 定义支付方式
const paymentMethods = [
  {
    id: 'wechat',
    name: '微信支付',
    description: '使用微信扫码支付',
    icon: 'Wallet'
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '使用支付宝扫码支付',
    icon: 'CreditCard'
  }
]

// 状态管理
const currentStep = ref(0)
const selectedPlan = ref<typeof plans[0] | null>(null)
const selectedPaymentMethod = ref<typeof paymentMethods[0] | null>(null)

// 选择套餐
const selectPlan = (plan: typeof plans[0]) => {
  selectedPlan.value = plan
}

// 选择支付方式
const selectPaymentMethod = (method: typeof paymentMethods[0]) => {
  selectedPaymentMethod.value = method
}

// 下一步
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 处理支付
const handlePayment = () => {
  // 这里应该调用实际的支付接口
  // 模拟支付成功
  setTimeout(() => {
    nextStep()
  }, 1000)
}
</script>