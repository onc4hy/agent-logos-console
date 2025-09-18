<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 text-on-surface-light">价格方案</h1>
      <p class="text-center text-on-surface-light mb-12 max-w-2xl mx-auto">选择最适合你的方案，开启AI创作之旅</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- 基础版 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-surface-high-light">
          <div class="p-6">
            <h3 class="text-2xl font-bold text-primary mb-2">基础版</h3>
            <div class="mb-6">
              <span class="text-3xl font-bold">¥29</span>
              <span class="text-on-surface-light">/月</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>创建3个智能体</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>基础人格定制</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>发布到2个平台</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>基础数据分析</span>
              </li>
              <li class="flex items-center text-on-surface-light">
                <el-icon class="mr-2"><Close /></el-icon>
                <span>高级人格定制</span>
              </li>
              <li class="flex items-center text-on-surface-light">
                <el-icon class="mr-2"><Close /></el-icon>
                <span>多平台一键分发</span>
              </li>
            </ul>
            <el-button type="primary" size="large" class="w-full" @click="selectPlan('basic')">选择基础版</el-button>
          </div>
        </div>

        <!-- 专业版 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary relative">
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
            最受欢迎
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold text-primary mb-2">专业版</h3>
            <div class="mb-6">
              <span class="text-3xl font-bold">¥99</span>
              <span class="text-on-surface-light">/月</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>创建10个智能体</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>高级人格定制</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>发布到5个平台</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>高级数据分析</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>专属品牌空间</span>
              </li>
              <li class="flex items-center text-on-surface-light">
                <el-icon class="mr-2"><Close /></el-icon>
                <span>创作者收益计划</span>
              </li>
            </ul>
            <el-button type="primary" size="large" class="w-full" @click="selectPlan('pro')">选择专业版</el-button>
          </div>
        </div>

        <!-- 企业版 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-surface-high-light">
          <div class="p-6">
            <h3 class="text-2xl font-bold text-primary mb-2">企业版</h3>
            <div class="mb-6">
              <span class="text-3xl font-bold">¥299</span>
              <span class="text-on-surface-light">/月</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>无限创建智能体</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>高级人格定制</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>无限平台发布</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>高级数据分析</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>专属品牌空间</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-success mr-2"><Check /></el-icon>
                <span>创作者收益计划</span>
              </li>
            </ul>
            <el-button type="primary" size="large" class="w-full" @click="selectPlan('enterprise')">选择企业版</el-button>
          </div>
        </div>
      </div>

      <div class="mt-16 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-8 text-on-surface-light">常见问题</h2>
        <div class="bg-white rounded-xl shadow-lg p-6 faq-container">
          <el-collapse accordion>
            <el-collapse-item name="1">
              <template #title>
                <h3 class="text-xl font-semibold">如何选择合适的套餐？</h3>
              </template>
              <p class="text-on-surface-light pl-6 pr-4">如果你是个人创作者，基础版或专业版就足够了。如果你是团队或企业用户，建议选择企业版以获得更多功能和资源。</p>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <h3 class="text-xl font-semibold">可以随时升级或降级套餐吗？</h3>
              </template>
              <p class="text-on-surface-light pl-6 pr-4">当然可以。你可以在任何时候升级或降级套餐，费用将按比例计算。</p>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template #title>
                <h3 class="text-xl font-semibold">是否有免费试用期？</h3>
              </template>
              <p class="text-on-surface-light pl-6 pr-4">我们提供14天的免费试用期，你可以在此期间体验所有功能。</p>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template #title>
                <h3 class="text-xl font-semibold">支持哪些支付方式？</h3>
              </template>
              <p class="text-on-surface-light pl-6 pr-4">我们支持微信支付、支付宝、银行卡等多种支付方式。</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon, ElCollapse, ElCollapseItem } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectPlan = (plan: string) => {
  // 这里应该跳转到支付页面并传递选择的套餐
  router.push(`/checkout?plan=${plan}`)
}
</script>

<style scoped>
/* 去掉el-collapse的顶部横线 */
:deep(.faq-container .el-collapse) {
  border-top: none;
}
</style>
