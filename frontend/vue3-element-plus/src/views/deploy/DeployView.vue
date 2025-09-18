<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-8 text-on-surface-light">部署智能体</h1>

      <div class="max-w-4xl mx-auto">
        <el-card class="mb-8">
          <template #header>
            <div class="flex items-center">
              <el-avatar :size="40" :src="agent.avatar" class="mr-3" />
              <div>
                <h2 class="text-xl font-bold">{{ agent.name }}</h2>
                <p class="text-on-surface-light">{{ agent.description }}</p>
              </div>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Coze平台部署 -->
            <div class="border border-surface-high-light rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold">C</span>
                </div>
                <h3 class="text-lg font-bold">Coze平台</h3>
                <el-tag :type="cozeStatus === 'deployed' ? 'success' : cozeStatus === 'deploying' ? 'warning' : 'info'" class="ml-auto">
                  {{ getPlatformStatusText(cozeStatus) }}
                </el-tag>
              </div>

              <div class="mb-4">
                <label class="block text-on-surface-light mb-2">API Token</label>
                <el-input
                  v-model="cozeConfig.apiToken"
                  placeholder="请输入Coze平台的API Token"
                  show-password
                />
              </div>

              <div class="mb-4">
                <label class="block text-on-surface-light mb-2">Bot ID</label>
                <el-input
                  v-model="cozeConfig.botId"
                  placeholder="请输入Bot ID"
                />
              </div>

              <div class="flex justify-end">
                <el-button
                  type="primary"
                  @click="deployToCoze"
                  :loading="cozeStatus === 'deploying'"
                  :disabled="cozeStatus === 'deploying'"
                >
                  {{ cozeStatus === 'deployed' ? '重新部署' : '部署到Coze' }}
                </el-button>
              </div>
            </div>

            <!-- Dify平台部署 -->
            <div class="border border-surface-high-light rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white font-bold">D</span>
                </div>
                <h3 class="text-lg font-bold">Dify平台</h3>
                <el-tag :type="difyStatus === 'deployed' ? 'success' : difyStatus === 'deploying' ? 'warning' : 'info'" class="ml-auto">
                  {{ getPlatformStatusText(difyStatus) }}
                </el-tag>
              </div>

              <div class="mb-4">
                <label class="block text-on-surface-light mb-2">API Key</label>
                <el-input
                  v-model="difyConfig.apiKey"
                  placeholder="请输入Dify平台的API Key"
                  show-password
                />
              </div>

              <div class="mb-4">
                <label class="block text-on-surface-light mb-2">应用ID</label>
                <el-input
                  v-model="difyConfig.appId"
                  placeholder="请输入应用ID"
                />
              </div>

              <div class="flex justify-end">
                <el-button
                  type="primary"
                  @click="deployToDify"
                  :loading="difyStatus === 'deploying'"
                  :disabled="difyStatus === 'deploying'"
                >
                  {{ difyStatus === 'deployed' ? '重新部署' : '部署到Dify' }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 部署历史 -->
        <el-card>
          <template #header>
            <h3 class="text-lg font-bold">部署历史</h3>
          </template>

          <el-table :data="deploymentHistory" style="width: 100%">
            <el-table-column prop="platform" label="平台" width="120" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'success' ? 'success' : scope.row.status === 'failed' ? 'danger' : 'info'">
                  {{ scope.row.status === 'success' ? '成功' : scope.row.status === 'failed' ? '失败' : '进行中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="version" label="版本" width="100" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" @click="viewDeploymentDetails(scope.row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElCard, ElAvatar, ElTag, ElInput, ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'

// 定义部署历史记录的类型
interface DeploymentRecord {
  id: string
  platform: string
  status: string
  time: string
  version: string
}

const route = useRoute()
const router = useRouter()

// 智能体信息
const agent = ref({
  id: '',
  name: '智能体名称',
  description: '智能体描述',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1'
})

// Coze平台配置
const cozeConfig = ref({
  apiToken: '',
  botId: ''
})

// Dify平台配置
const difyConfig = ref({
  apiKey: '',
  appId: ''
})

// 平台部署状态
const cozeStatus = ref<'undeployed' | 'deploying' | 'deployed'>('undeployed')
const difyStatus = ref<'undeployed' | 'deploying' | 'deployed'>('undeployed')

// 部署历史
const deploymentHistory = ref<DeploymentRecord[]>([
  {
    id: '1',
    platform: 'Coze',
    status: 'success',
    time: '2025-09-12 14:30:22',
    version: 'v1.0.0'
  },
  {
    id: '2',
    platform: 'Dify',
    status: 'success',
    time: '2025-09-11 09:15:45',
    version: 'v1.0.0'
  }
])

// 获取平台状态文本
const getPlatformStatusText = (status: string) => {
  switch (status) {
    case 'undeployed': return '未部署'
    case 'deploying': return '部署中'
    case 'deployed': return '已部署'
    default: return '未知'
  }
}

// 部署到Coze平台
const deployToCoze = () => {
  if (!cozeConfig.value.apiToken || !cozeConfig.value.botId) {
    ElMessage.warning('请填写完整的Coze平台配置信息')
    return
  }

  cozeStatus.value = 'deploying'

  // 模拟部署过程
  setTimeout(() => {
    cozeStatus.value = 'deployed'
    ElMessage.success('成功部署到Coze平台')

    // 添加到部署历史
    const newDeployment: DeploymentRecord = {
      id: `coze_${Date.now()}`,
      platform: 'Coze',
      status: 'success',
      time: new Date().toLocaleString(),
      version: 'v1.0.1'
    }
    
    deploymentHistory.value.unshift(newDeployment)
  }, 2000)
}

// 部署到Dify平台
const deployToDify = () => {
  if (!difyConfig.value.apiKey || !difyConfig.value.appId) {
    ElMessage.warning('请填写完整的Dify平台配置信息')
    return
  }

  difyStatus.value = 'deploying'

  // 模拟部署过程
  setTimeout(() => {
    difyStatus.value = 'deployed'
    ElMessage.success('成功部署到Dify平台')

    // 添加到部署历史
    const newDeployment: DeploymentRecord = {
      id: `dify_${Date.now()}`,
      platform: 'Dify',
      status: 'success',
      time: new Date().toLocaleString(),
      version: 'v1.0.1'
    }
    
    deploymentHistory.value.unshift(newDeployment)
  }, 2000)
}

// 查看部署详情
const viewDeploymentDetails = (record: DeploymentRecord) => {
  // 跳转到部署详情页面
  router.push(`/deploy/detail/${record.id}?agentId=${agent.value.id}`)
}

// 初始化数据
onMounted(() => {
  // 从路由参数获取智能体ID
  const agentId = route.params.id as string
  if (agentId) {
    // 这里应该从后端获取智能体详细信息
    agent.value.id = agentId
    agent.value.name = `智能体${agentId}`
    agent.value.description = `这是智能体${agentId}的详细描述信息`
  }
})
</script>
