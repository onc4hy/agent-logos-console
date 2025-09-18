<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <el-page-header @back="goBack" class="mb-6">
          <template #content>
            <span class="text-xl font-bold">部署详情</span>
          </template>
        </el-page-header>

        <el-card class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  :class="deployment.platform === 'Coze' ? 'bg-blue-500' : 'bg-green-500'"
                >
                  <span class="text-white font-bold">{{ deployment.platform === 'Coze' ? 'C' : 'D' }}</span>
                </div>
                <div>
                  <h2 class="text-xl font-bold">{{ deployment.platform }}平台部署详情</h2>
                  <p class="text-on-surface-light">{{ agent.name }}</p>
                </div>
              </div>
              <el-tag :type="deployment.status === 'success' ? 'success' : deployment.status === 'failed' ? 'danger' : 'info'">
                {{ deployment.status === 'success' ? '部署成功' : deployment.status === 'failed' ? '部署失败' : '部署中' }}
              </el-tag>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-bold mb-2">基本信息</h3>
              <el-descriptions :column="1" size="small" border>
                <el-descriptions-item label="部署ID">{{ deployment.id }}</el-descriptions-item>
                <el-descriptions-item label="平台">{{ deployment.platform }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="deployment.status === 'success' ? 'success' : deployment.status === 'failed' ? 'danger' : 'info'">
                    {{ deployment.status === 'success' ? '成功' : deployment.status === 'failed' ? '失败' : '进行中' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="部署时间">{{ deployment.time }}</el-descriptions-item>
                <el-descriptions-item label="版本">{{ deployment.version }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <div>
              <h3 class="font-bold mb-2">配置信息</h3>
              <el-descriptions :column="1" size="small" border>
                <el-descriptions-item label="API Token" v-if="deployment.platform === 'Coze'">
                  {{ cozeConfig.apiToken }}
                </el-descriptions-item>
                <el-descriptions-item label="Bot ID" v-if="deployment.platform === 'Coze'">
                  {{ cozeConfig.botId }}
                </el-descriptions-item>
                <el-descriptions-item label="API Key" v-if="deployment.platform === 'Dify'">
                  {{ difyConfig.apiKey }}
                </el-descriptions-item>
                <el-descriptions-item label="应用ID" v-if="deployment.platform === 'Dify'">
                  {{ difyConfig.appId }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <h3 class="text-lg font-bold">部署日志</h3>
          </template>

          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div v-for="(log, index) in deploymentLogs" :key="index" class="mb-1">
              <span class="text-gray-500">[{{ log.time }}]</span> {{ log.message }}
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElCard,
  ElPageHeader,
  ElTag,
  ElDescriptions,
  ElDescriptionsItem
} from 'element-plus'

const route = useRoute()
const router = useRouter()

// 部署信息
const deployment = ref({
  id: '',
  platform: 'Coze',
  status: 'success',
  time: '',
  version: 'v1.0.0'
})

// 智能体信息
const agent = ref({
  id: '',
  name: '智能体名称',
  description: '智能体描述',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1'
})

// Coze平台配置
const cozeConfig = ref({
  apiToken: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  botId: 'bot_xxxxxxxxxxxxxxxx'
})

// Dify平台配置
const difyConfig = ref({
  apiKey: 'app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  appId: 'app_xxxxxxxxxxxxxxxx'
})

// 部署日志
const deploymentLogs = ref([
  { time: '14:30:22', message: '开始部署到Coze平台...' },
  { time: '14:30:23', message: '验证API Token...' },
  { time: '14:30:24', message: 'API Token验证通过' },
  { time: '14:30:25', message: '获取Bot信息...' },
  { time: '14:30:26', message: 'Bot信息获取成功' },
  { time: '14:30:27', message: '上传智能体配置...' },
  { time: '14:30:30', message: '配置上传完成' },
  { time: '14:30:32', message: '部署成功完成' }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 初始化数据
onMounted(() => {
  // 从路由参数获取部署ID
  const deploymentId = route.params.id as string
  if (deploymentId) {
    // 这里应该从后端获取部署详细信息
    deployment.value.id = deploymentId
    deployment.value.time = new Date().toLocaleString()

    // 模拟根据ID获取不同平台的数据
    if (deploymentId.includes('coze')) {
      deployment.value.platform = 'Coze'
    } else if (deploymentId.includes('dify')) {
      deployment.value.platform = 'Dify'
    }
  }

  // 从查询参数获取智能体ID
  const agentId = route.query.agentId as string
  if (agentId) {
    agent.value.id = agentId
    agent.value.name = `智能体${agentId}`
    agent.value.description = `这是智能体${agentId}的详细描述信息`
  }
})
</script>
