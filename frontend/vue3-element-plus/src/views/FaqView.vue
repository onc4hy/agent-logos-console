<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 text-on-surface-light">常见问题</h1>
      <p class="text-center text-on-surface-light mb-12 max-w-2xl mx-auto">解答你在使用智能体调音台过程中可能遇到的问题</p>

      <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8 faq-container">
        <el-collapse accordion>
          <el-collapse-item name="1">
            <template #title>
              <h3 class="text-xl font-semibold">什么是智能体调音台？</h3>
            </template>
            <p class="text-on-surface-light">智能体调音台是一个专为AI创作者设计的平台，帮助你创建、定制和部署具有独特个性的AI智能体。你可以通过我们的工具深度定制AI的人格特征、语言风格和行为模式，并一键部署到多个平台。</p>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <h3 class="text-xl font-semibold">我可以创建什么样的AI智能体？</h3>
            </template>
            <p class="text-on-surface-light">你可以创建各种类型的AI智能体，包括但不限于虚拟主播、AI助手、游戏角色、教育导师、客服代表等。我们的平台提供了丰富的定制选项，让你的AI智能体拥有独特的个性和行为模式。</p>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <h3 class="text-xl font-semibold">支持部署到哪些平台？</h3>
            </template>
            <p class="text-on-surface-light">我们支持部署到主流的AI平台，包括但不限于微信公众号、抖音、快手、B站、Discord、Telegram等。我们还在不断扩展支持的平台列表，确保你的AI智能体能够触及更多用户。</p>
          </el-collapse-item>

          <el-collapse-item name="4">
            <template #title>
              <h3 class="text-xl font-semibold">如何保证我的AI智能体的独特性？</h3>
            </template>
            <p class="text-on-surface-light">我们提供深度人格定制功能，包括语调、价值观、知识库、行为模式等多个维度的定制。通过这些工具，你可以创建出具有独特个性和风格的AI智能体，避免千篇一律的模板化体验。</p>
          </el-collapse-item>

          <el-collapse-item name="5">
            <template #title>
              <h3 class="text-xl font-semibold">数据安全和隐私如何保障？</h3>
            </template>
            <p class="text-on-surface-light">我们非常重视用户的数据安全和隐私保护。所有数据都经过加密存储，严格遵守相关法律法规。我们不会将你的数据用于任何未经授权的用途，也不会与第三方共享你的敏感信息。</p>
          </el-collapse-item>

          <el-collapse-item name="6">
            <template #title>
              <h3 class="text-xl font-semibold">如何获得技术支持？</h3>
            </template>
            <p class="text-on-surface-light">我们提供多种技术支持渠道，包括在线客服、技术文档、社区论坛等。付费用户还可以享受专属的技术支持服务。你可以在我们的社区中与其他创作者交流经验，获取帮助。</p>
          </el-collapse-item>

          <el-collapse-item name="7">
            <template #title>
              <h3 class="text-xl font-semibold">可以退款吗？</h3>
            </template>
            <p class="text-on-surface-light">我们提供14天无理由退款保证。如果你在使用过程中对我们的服务不满意，可以在14天内申请全额退款。退款申请通过审核后，款项将在3-5个工作日内原路返回。</p>
          </el-collapse-item>

          <el-collapse-item name="8">
            <template #title>
              <h3 class="text-xl font-semibold">如何参与创作者收益计划？</h3>
            </template>
            <p class="text-on-surface-light">创作者收益计划面向专业版和企业版用户开放。你可以通过推广我们的平台、分享创作经验等方式获得收益分成。具体的收益规则和分成比例请参考我们的创作者计划页面。</p>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="mt-12 text-center">
        <p class="text-on-surface-light mb-4">没有找到你想要的答案？</p>
        <el-button type="primary" @click="contactSupport">联系客服</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElCollapse, ElCollapseItem } from 'element-plus'

const contactSupport = () => {
  // 这里应该打开客服对话窗口或跳转到联系页面
  console.log('联系客服')
}
</script>

<style scoped>
/* 去掉el-collapse的顶部和底部横线 */
:deep(.faq-container .el-collapse) {
  border-top: none;
  border-bottom: none;
}

/* 去掉el-collapse-item之间的分割线 */
:deep(.faq-container .el-collapse-item__header) {
  border-bottom: none;
}

:deep(.faq-container .el-collapse-item__wrap) {
  border-bottom: none;
}
</style>
