<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <div class="flex items-center mb-6">
        <el-button link @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="text-3xl md:text-4xl font-bold text-center flex-1 text-on-surface-light">{{ currentCategory?.label }}智能体</h1>
      </div>

      <div class="max-w-6xl mx-auto">
        <!-- 搜索和筛选区域 -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <el-input
                v-model="searchQuery"
                placeholder="搜索智能体..."
                size="large"
                clearable
                @keyup.enter="searchAgents"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
            <el-button type="primary" size="large" @click="searchAgents">搜索</el-button>
          </div>

          <!-- 标签导航 -->
          <div class="flex flex-wrap gap-2 mt-4">
            <el-tag
              v-for="tag in tags"
              :key="tag"
              :type="selectedTags.includes(tag) ? 'primary' : 'info'"
              size="large"
              class="cursor-pointer"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <!-- 智能体列表 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <!-- 智能体卡片网格 -->
          <div
            v-if="!loading"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <div
              v-for="agent in agents"
              :key="agent.id"
              class="border border-surface-high-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="viewAgentDetail(agent)"
            >
              <div class="p-6">
                <div class="flex items-start mb-4">
                  <el-avatar :size="48" :src="agent.avatar" class="mr-4" />
                  <div class="flex-1">
                    <h3 class="text-lg font-bold">{{ agent.name }}</h3>
                    <p class="text-sm text-on-surface-light">{{ agent.creator }}</p>
                  </div>
                  <el-tag :type="agent.category === '热门' ? 'danger' : agent.category === '推荐' ? 'success' : 'info'">
                    {{ agent.category }}
                  </el-tag>
                </div>

                <p class="text-on-surface-light mb-4">{{ agent.description }}</p>

                <div class="flex flex-wrap gap-2 mb-4">
                  <el-tag v-for="tag in agent.tags.slice(0, 3)" :key="tag" type="info" size="small">
                    {{ tag }}
                  </el-tag>
                  <el-tag v-if="agent.tags.length > 3" type="info" size="small">
                    +{{ agent.tags.length - 3 }}
                  </el-tag>
                </div>

                <div class="flex justify-between items-center">
                  <div class="flex items-center text-sm text-on-surface-light">
                    <el-icon class="mr-1"><Star /></el-icon>
                    <span>{{ agent.rating }}</span>
                    <el-icon class="mx-2"><User /></el-icon>
                    <span>{{ agent.users }}</span>
                  </div>
                  <el-button type="primary" size="small" @click.stop="viewAgentDetail(agent)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <el-icon :size="32" class="animate-spin"><Loading /></el-icon>
            <p class="mt-2 text-on-surface-light">加载中...</p>
          </div>

          <!-- 无数据状态 -->
          <div v-else-if="agents.length === 0" class="text-center py-12">
            <el-icon :size="48" class="text-on-surface-light"><Document /></el-icon>
            <p class="mt-2 text-on-surface-light">暂无智能体数据</p>
          </div>

          <!-- 分页 -->
          <div class="flex justify-center mt-8" v-if="totalPages > 1">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="totalAgents"
              layout="prev, pager, next, jumper"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 智能体详情模态框 -->
    <el-dialog
      v-model="showAgentDetail"
      :title="selectedAgent?.name"
      width="600"
      @close="closeAgentDetail"
    >
      <div v-if="selectedAgent" class="p-4">
        <div class="flex items-start mb-6">
          <el-avatar :size="64" :src="selectedAgent.avatar" class="mr-4" />
          <div>
            <h3 class="text-2xl font-bold">{{ selectedAgent.name }}</h3>
            <p class="text-on-surface-light">创建者: {{ selectedAgent.creator }}</p>
            <el-tag :type="selectedAgent.category === '热门' ? 'danger' : selectedAgent.category === '推荐' ? 'success' : 'info'" class="mt-2">
              {{ selectedAgent.category }}
            </el-tag>
          </div>
        </div>

        <p class="text-on-surface-light mb-6">{{ selectedAgent.description }}</p>

        <div class="mb-6">
          <h4 class="font-semibold mb-2">标签:</h4>
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="tag in selectedAgent.tags" :key="tag" type="info">
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-surface p-4 rounded-lg">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ selectedAgent.rating }}</div>
              <div class="text-on-surface-light">评分</div>
            </div>
          </div>
          <div class="bg-surface p-4 rounded-lg">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ selectedAgent.users }}</div>
              <div class="text-on-surface-light">用户数</div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <el-button @click="closeAgentDetail">关闭</el-button>
          <el-button type="primary" @click="useAgent">使用此智能体</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  ElButton,
  ElIcon,
  ElAvatar,
  ElDialog,
  ElTag,
  ElInput,
  ElPagination
} from 'element-plus'
import {
  Star,
  User,
  ArrowLeft,
  Search,
  Loading,
  Document
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

// 定义智能体类型
interface Agent {
  id: string
  name: string
  creator: string
  avatar: string
  category: string
  description: string
  tags: string[]
  rating: string
  users: number
}

const router = useRouter()
const route = useRoute()

// 分类信息
const categories = [
  { value: 'all', label: '全部' },
  { value: 'virtual', label: '虚拟主播' },
  { value: 'assistant', label: 'AI助手' },
  { value: 'game', label: '游戏角色' },
  { value: 'education', label: '教育导师' },
  { value: 'customer', label: '客服代表' }
]

const currentCategory = ref<{ value: string; label: string } | null>(null)

// 搜索和筛选状态
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const tags = ['热门', '推荐', '新星', '创意', '实用', '娱乐', '教育', '商业']

// 分页状态
const currentPage = ref(1)
const pageSize = ref(9)
const totalAgents = ref(100)
const totalPages = ref(0)

// 数据状态
const loading = ref(false)
const agents = ref<Agent[]>([])

// 智能体详情状态
const showAgentDetail = ref(false)
const selectedAgent = ref<Agent | null>(null)

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 搜索智能体
const searchAgents = () => {
  currentPage.value = 1
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loadAgents()
    loading.value = false
  }, 500)
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loadAgents()
    loading.value = false
  }, 500)
}

// 查看智能体详情
const viewAgentDetail = (agent: Agent) => {
  selectedAgent.value = agent
  showAgentDetail.value = true
}

// 关闭智能体详情
const closeAgentDetail = () => {
  showAgentDetail.value = false
  selectedAgent.value = null
}

// 使用智能体
const useAgent = () => {
  if (selectedAgent.value) {
    // 这里可以跳转到聊天页面或工作台
    router.push('/chat')
    closeAgentDetail()
  }
}

// 模拟数据
const loadAgents = () => {
  // 生成模拟数据
  const newAgents: Agent[] = []
  const startIndex = (currentPage.value - 1) * pageSize.value

  for (let i = 0; i < pageSize.value; i++) {
    const id = startIndex + i + 1
    newAgents.push({
      id: `agent-${currentCategory.value?.value || 'all'}-${id}`,
      name: `${currentCategory.value?.label || '智能体'}${id}`,
      creator: `创作者${String.fromCharCode(65 + (id % 26))}`,
      avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${id}`,
      category: currentCategory.value?.value || '推荐',
      description: `这是${currentCategory.value?.label || '智能体'}分类下的AI智能体，具有专业功能。智能体${id}具有独特的个性和能力。`,
      tags: [currentCategory.value?.label || '推荐', '热门', '创意'].slice(0, Math.floor(Math.random() * 3) + 1),
      rating: (Math.random() * 4 + 1).toFixed(1),
      users: Math.floor(Math.random() * 5000)
    })
  }

  agents.value = newAgents
  totalPages.value = Math.ceil(totalAgents.value / pageSize.value)
}

// 监听路由参数变化
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory && typeof newCategory === 'string') {
      currentCategory.value = categories.find(c => c.value === newCategory) || null
      currentPage.value = 1
      searchAgents()
    }
  },
  { immediate: true }
)

// 监听路由参数变化（详情）
watch(
  () => route.query.id,
  (newId) => {
    if (newId && typeof newId === 'string') {
      // 查找对应的智能体并显示详情
      const agent = agents.value.find(a => a.id === newId)
      if (agent) {
        viewAgentDetail(agent)
      }
    }
  }
)

// 初始化加载
onMounted(() => {
  // 检查是否有从首页传来的智能体ID
  if (route.query.id && typeof route.query.id === 'string') {
    // 延迟执行以确保数据已加载
    setTimeout(() => {
      const agent = agents.value.find(a => a.id === route.query.id)
      if (agent) {
        viewAgentDetail(agent)
      }
    }, 600)
  }
})
</script>
