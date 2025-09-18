<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 text-on-surface-light">智能体导航</h1>
      <p class="text-center text-on-surface-light mb-12 max-w-2xl mx-auto">发现和探索各种类型的AI智能体</p>

      <div class="max-w-6xl mx-auto">
        <!-- 轮播图形式的轮播导航 (使用Swiper实现) -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <swiper
            :modules="swiperModules"
            :slides-per-view="1"
            :space-between="0"
            :loop="true"
            :autoplay="{ delay: 5000 }"
            :pagination="{ clickable: true }"
            :navigation="{
              nextEl: '.banner-swiper-next',
              prevEl: '.banner-swiper-prev'
            }"
            class="h-64 rounded-lg"
          >
            <swiper-slide v-for="banner in banners" :key="banner.id">
              <div class="h-full w-full flex items-center justify-center" :style="{ background: banner.bgColor }">
                <div class="text-center text-white">
                  <h3 class="text-2xl font-bold mb-2">{{ banner.title }}</h3>
                  <p class="mb-4">{{ banner.description }}</p>
                  <el-button type="primary" @click="goToCategory(banner.category)">{{ banner.buttonText }}</el-button>
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <!-- 自定义导航按钮 -->
          <div class="banner-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-10 cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
              <el-icon><ArrowLeft /></el-icon>
            </div>
          </div>
          <div class="banner-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-10 cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 标签导航 -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap gap-2">
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

        <!-- 热门区 (使用Swiper实现横向滚动) -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-on-surface-light">热门智能体</h2>
          </div>
          <div class="relative hot-swiper-container">
            <swiper
              :modules="swiperModules"
              :slides-per-view="1"
              :space-between="20"
              :navigation="{
                nextEl: '.hot-swiper-next',
                prevEl: '.hot-swiper-prev'
              }"
              :breakpoints="{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }"
              class="py-4"
            >
              <swiper-slide v-for="(agent, index) in hotAgents" :key="agent.id">
                <div
                  class="flex items-center p-4 rounded-lg cursor-pointer border border-surface-high-light hover:shadow-lg transition-all duration-300 hover:border-primary"
                  @click="viewAgentDetail(agent)"
                >
                  <div class="w-10 h-10 flex items-center justify-center mr-4">
                    <span class="font-bold text-lg" :class="index < 3 ? 'text-primary' : 'text-on-surface-light'">{{ index + 1 }}</span>
                  </div>
                  <el-avatar :size="40" :src="agent.avatar" class="mr-4" />
                  <div class="flex-1">
                    <h3 class="font-bold">{{ agent.name }}</h3>
                    <p class="text-sm text-on-surface-light">{{ agent.creator }}</p>
                  </div>
                  <div class="flex flex-col items-end">
                    <el-tag :type="agent.category === '热门' ? 'danger' : agent.category === '推荐' ? 'success' : 'info'" size="small">
                      {{ agent.category }}
                    </el-tag>
                    <div class="flex items-center text-sm text-on-surface-light mt-1">
                      <el-icon class="mr-1"><User /></el-icon>
                      <span>{{ agent.users }}</span>
                    </div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
            <!-- 自定义导航按钮 -->
            <div class="hot-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
                <el-icon><ArrowLeft /></el-icon>
              </div>
            </div>
            <div class="hot-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 排行榜 (使用Swiper实现横向滚动) -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-on-surface-light">排行榜</h2>
          </div>
          <div class="relative ranking-swiper-container">
            <swiper
              :modules="swiperModules"
              :slides-per-view="1"
              :space-between="20"
              :navigation="{
                nextEl: '.ranking-swiper-next',
                prevEl: '.ranking-swiper-prev'
              }"
              :breakpoints="{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }"
              class="py-4"
            >
              <swiper-slide v-for="(agent, index) in rankingAgents" :key="agent.id">
                <div
                  class="flex items-center p-4 rounded-lg cursor-pointer border border-surface-high-light hover:shadow-lg transition-all duration-300 hover:border-primary"
                  @click="viewAgentDetail(agent)"
                >
                  <div class="w-10 h-10 flex items-center justify-center mr-4">
                    <span class="font-bold text-lg" :class="index < 3 ? 'text-primary' : 'text-on-surface-light'">{{ index + 1 }}</span>
                  </div>
                  <el-avatar :size="40" :src="agent.avatar" class="mr-4" />
                  <div class="flex-1">
                    <h3 class="font-bold">{{ agent.name }}</h3>
                    <div class="flex items-center text-sm text-on-surface-light">
                      <el-icon class="mr-1"><Star /></el-icon>
                      <span>{{ agent.rating }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <div class="text-lg font-bold text-primary">{{ agent.rating }}</div>
                    <div class="text-sm text-on-surface-light mt-1">{{ agent.users }} 使用</div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
            <!-- 自定义导航按钮 -->
            <div class="ranking-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
                <el-icon><ArrowLeft /></el-icon>
              </div>
            </div>
            <div class="ranking-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 最新发布 (使用Swiper实现横向滚动) -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-on-surface-light">最新发布</h2>
          </div>
          <div class="relative new-swiper-container">
            <swiper
              :modules="swiperModules"
              :slides-per-view="1"
              :space-between="20"
              :navigation="{
                nextEl: '.new-swiper-next',
                prevEl: '.new-swiper-prev'
              }"
              :breakpoints="{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }"
              class="py-4"
            >
              <swiper-slide v-for="(agent, index) in newAgents" :key="agent.id">
                <div
                  class="flex items-center p-4 rounded-lg cursor-pointer border border-surface-high-light hover:shadow-lg transition-all duration-300 hover:border-primary"
                  @click="viewAgentDetail(agent)"
                >
                  <div class="w-10 h-10 flex items-center justify-center mr-4">
                    <span class="font-bold text-lg" :class="index < 3 ? 'text-primary' : 'text-on-surface-light'">{{ index + 1 }}</span>
                  </div>
                  <el-avatar :size="40" :src="agent.avatar" class="mr-4" />
                  <div class="flex-1">
                    <h3 class="font-bold">{{ agent.name }}</h3>
                    <p class="text-sm text-on-surface-light">{{ agent.creator }}</p>
                  </div>
                  <div class="flex flex-col items-end">
                    <div class="text-sm text-on-surface-light">{{ agent.time }}</div>
                    <el-tag type="info" size="small" class="mt-1">{{ agent.category }}</el-tag>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
            <!-- 自定义导航按钮 -->
            <div class="new-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
                <el-icon><ArrowLeft /></el-icon>
              </div>
            </div>
            <div class="new-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 各个子专栏 -->
        <div v-for="category in categories.slice(1)" :key="category.value" class="mb-12">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-on-surface-light">{{ category.label }}</h2>
              <el-button link @click="goToCategoryPage(category.value)">更多 <el-icon><ArrowRight /></el-icon></el-button>
            </div>

            <!-- 子专栏的头6个智能体 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div
                v-for="agent in categoryAgents[category.value]?.slice(0, 6) || []"
                :key="agent.id"
                class="border border-surface-high-light rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
                @click="viewAgentDetail(agent)"
              >
                <div class="p-6 bg-gradient-to-br from-pink-50 to-purple-50">
                  <div class="flex items-start mb-4">
                    <el-avatar :size="48" :src="agent.avatar" class="mr-4 ring-2 ring-white ring-opacity-50 shadow" />
                    <div class="flex-1">
                      <h3 class="text-lg font-bold text-gray-800">{{ agent.name }}</h3>
                      <p class="text-sm text-gray-600">{{ agent.creator }}</p>
                    </div>
                    <el-tag :type="agent.category === '热门' ? 'danger' : agent.category === '推荐' ? 'success' : 'info'" class="rounded-full">
                      {{ agent.category }}
                    </el-tag>
                  </div>

                  <p class="text-gray-700 mb-4">{{ agent.description }}</p>

                  <div class="flex flex-wrap gap-2 mb-4">
                    <el-tag v-for="tag in agent.tags.slice(0, 3)" :key="tag" type="info" size="small" class="rounded-full">
                      {{ tag }}
                    </el-tag>
                    <el-tag v-if="agent.tags.length > 3" type="info" size="small" class="rounded-full">
                      +{{ agent.tags.length - 3 }}
                    </el-tag>
                  </div>

                  <div class="flex justify-between items-center">
                    <div class="flex items-center text-sm text-gray-600">
                      <el-icon class="mr-1 text-yellow-500"><Star /></el-icon>
                      <span class="font-medium">{{ agent.rating }}</span>
                      <el-icon class="mx-2 text-blue-500"><User /></el-icon>
                      <span class="font-medium">{{ agent.users }}</span>
                    </div>
                    <el-button type="primary" size="small" @click.stop="viewAgentDetail(agent)" class="rounded-full">
                      查看详情
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
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
  ElTag
} from 'element-plus'
import {
  Star,
  User,
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  time?: string // 用于最新发布
}

const router = useRouter()
const route = useRoute()

// Swiper modules
const swiperModules = [Navigation, Pagination, Autoplay]

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '虚拟主播专区',
    description: '最受欢迎的虚拟主播智能体',
    buttonText: '立即查看',
    category: 'virtual',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: 'AI助手专区',
    description: '高效实用的AI助手集合',
    buttonText: '立即查看',
    category: 'assistant',
    bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    title: '游戏角色专区',
    description: '沉浸式游戏体验角色',
    buttonText: '立即查看',
    category: 'game',
    bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
])

// 标签
const tags = ['热门', '推荐', '新星', '创意', '实用', '娱乐', '教育', '商业']
const selectedTags = ref<string[]>([])

// 分类
const categories = [
  { value: 'all', label: '全部' },
  { value: 'virtual', label: '虚拟主播' },
  { value: 'assistant', label: 'AI助手' },
  { value: 'game', label: '游戏角色' },
  { value: 'education', label: '教育导师' },
  { value: 'customer', label: '客服代表' }
]

// 热门智能体
const hotAgents = ref<Agent[]>([])

// 排行榜智能体
const rankingAgents = ref<Agent[]>([])

// 最新发布智能体
const newAgents = ref<Agent[]>([])

// 各分类的智能体
const categoryAgents = ref<Record<string, Agent[]>>({})

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

// 跳转到分类
const goToCategory = (category: string) => {
  router.push(`/agents/category/${category}`)
}

// 跳转到分类页面
const goToCategoryPage = (category: string) => {
  router.push(`/agents/category/${category}`)
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

// 生成模拟数据
const generateMockData = () => {
  // 生成热门智能体
  hotAgents.value = Array.from({ length: 10 }, (_, i) => ({
    id: `hot-${i + 1}`,
    name: `热门智能体${i + 1}`,
    creator: `创作者${String.fromCharCode(65 + (i % 26))}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 1}`,
    category: i < 3 ? '热门' : ['推荐', '新星'][i % 2],
    description: `这是一个热门的AI智能体，具有独特的功能。`,
    tags: ['热门', '推荐', '创意'].slice(0, Math.floor(Math.random() * 3) + 1),
    rating: (Math.random() * 4 + 1).toFixed(1),
    users: Math.floor(Math.random() * 10000)
  }))

  // 生成排行榜智能体（按评分排序）
  rankingAgents.value = [...hotAgents.value]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 10)

  // 生成最新发布智能体
  newAgents.value = Array.from({ length: 10 }, (_, i) => ({
    id: `new-${i + 1}`,
    name: `最新智能体${i + 1}`,
    creator: `创作者${String.fromCharCode(65 + (i % 26))}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 100}`,
    category: ['推荐', '新星', '创意'][i % 3],
    description: `这是最新发布的AI智能体，具有创新功能。`,
    tags: ['最新', '推荐', '创意'].slice(0, Math.floor(Math.random() * 3) + 1),
    rating: (Math.random() * 4 + 1).toFixed(1),
    users: Math.floor(Math.random() * 1000),
    time: `${Math.floor(Math.random() * 30) + 1}天前`
  }))

  // 生成各分类的智能体
  categories.slice(1).forEach(category => {
    categoryAgents.value[category.value] = Array.from({ length: 12 }, (_, i) => ({
      id: `${category.value}-${i + 1}`,
      name: `${category.label}智能体${i + 1}`,
      creator: `创作者${String.fromCharCode(65 + (i % 26))}`,
      avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i + 200}`,
      category: category.value,
      description: `这是${category.label}分类下的AI智能体，具有专业功能。`,
      tags: [category.label, '推荐', '实用'].slice(0, Math.floor(Math.random() * 3) + 1),
      rating: (Math.random() * 4 + 1).toFixed(1),
      users: Math.floor(Math.random() * 5000)
    }))
  })
}

// 监听路由参数变化
watch(
  () => route.query.id,
  (newId) => {
    if (newId && typeof newId === 'string') {
      // 查找对应的智能体并显示详情
      const allAgents = [
        ...hotAgents.value,
        ...rankingAgents.value,
        ...newAgents.value,
        ...Object.values(categoryAgents.value).flat()
      ]
      const agent = allAgents.find(a => a.id === newId)
      if (agent) {
        viewAgentDetail(agent)
      }
    }
  }
)

// 初始化加载
onMounted(() => {
  generateMockData()

  // 检查是否有从首页传来的智能体ID
  if (route.query.id && typeof route.query.id === 'string') {
    // 延迟执行以确保数据已加载
    setTimeout(() => {
      const allAgents = [
        ...hotAgents.value,
        ...rankingAgents.value,
        ...newAgents.value,
        ...Object.values(categoryAgents.value).flat()
      ]
      const agent = allAgents.find(a => a.id === route.query.id)
      if (agent) {
        viewAgentDetail(agent)
      }
    }, 600)
  }
})
</script>

<style scoped>
/* 确保Swiper导航按钮正确显示 */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  display: none !important;
}

/* 自定义导航按钮样式 */
.banner-swiper-prev,
.banner-swiper-next,
.hot-swiper-prev,
.hot-swiper-next,
.ranking-swiper-prev,
.ranking-swiper-next,
.new-swiper-prev,
.new-swiper-next {
  transition: all 0.3s ease;
}

.banner-swiper-prev:hover,
.banner-swiper-next:hover,
.hot-swiper-prev:hover,
.hot-swiper-next:hover,
.ranking-swiper-prev:hover,
.ranking-swiper-next:hover,
.new-swiper-prev:hover,
.new-swiper-next:hover {
  transform: scale(1.1);
}

.hot-swiper-prev:hover .w-8,
.hot-swiper-next:hover .w-8,
.ranking-swiper-prev:hover .w-8,
.ranking-swiper-next:hover .w-8,
.new-swiper-prev:hover .w-8,
.new-swiper-next:hover .w-8 {
  background-color: rgba(64, 158, 255, 0.1);
}

/* Swiper分页器样式 */
:deep(.swiper-pagination-bullet) {
  background: rgba(0, 0, 0, 0.2) !important;
  opacity: 1 !important;
  width: 8px !important;
  height: 8px !important;
}

:deep(.swiper-pagination-bullet-active) {
  background: #409eff !important;
  width: 20px !important;
  border-radius: 4px !important;
}

/* 热门、排行榜、最新区域的Swiper容器增加内边距，避免内容与箭头重叠 */
.hot-swiper-container,
.ranking-swiper-container,
.new-swiper-container {
  padding: 0 20px;
}
</style>
