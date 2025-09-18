<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-8 text-on-surface-light">控制台</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 用户信息卡片 -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-6">
            <el-avatar :size="64" class="mr-4 bg-secondary text-on-secondary">
              {{ userInitials }}
            </el-avatar>
            <div>
              <h2 class="text-2xl font-bold">{{ userName }}</h2>
              <p class="text-on-surface-light">积分: {{ userPoints }}</p>
            </div>
            <div class="ml-auto">
              <el-button @click="checkIn" :disabled="checkedInToday" type="primary">
                {{ checkedInToday ? '已签到' : '每日签到' }}
              </el-button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-surface rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ agentCount }}</div>
              <div class="text-on-surface-light">智能体数量</div>
            </div>
            <div class="bg-surface rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ postCount }}</div>
              <div class="text-on-surface-light">发布帖子</div>
            </div>
            <div class="bg-surface rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ followerCount }}</div>
              <div class="text-on-surface-light">粉丝数</div>
            </div>
            <div class="bg-surface rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ likeCount }}</div>
              <div class="text-on-surface-light">获赞数</div>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4 text-on-surface-light">快捷操作</h3>
          <div class="space-y-3">
            <el-button type="primary" class="w-full" @click="$router.push('/agents')">
              <el-icon class="mr-2"><MagicStick /></el-icon>
              管理智能体
            </el-button>
            <el-button class="w-full" @click="$router.push('/agents/create')">
              <el-icon class="mr-2"><Plus /></el-icon>
              创建新智能体
            </el-button>
            <el-button class="w-full" @click="$router.push('/community')">
              <el-icon class="mr-2"><EditPen /></el-icon>
              发布帖子
            </el-button>
            <el-button class="w-full" @click="$router.push('/checkin')">
              <el-icon class="mr-2"><Star /></el-icon>
              积分商城
            </el-button>
          </div>
        </div>

        <!-- 我的智能体 -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-on-surface-light">我的智能体</h3>
            <el-button link @click="$router.push('/agents')">
              查看全部
            </el-button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="agent in myAgents"
              :key="agent.id"
              class="border border-surface-high-light rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start">
                <el-avatar :size="40" :src="agent.avatar" class="mr-3" />
                <div class="flex-1">
                  <h4 class="font-bold">{{ agent.name }}</h4>
                  <p class="text-sm text-on-surface-light truncate">{{ agent.description }}</p>
                </div>
                <el-tag :type="agent.status === '已部署' ? 'success' : 'info'">
                  {{ agent.status }}
                </el-tag>
              </div>
              <div class="flex justify-between mt-3 text-sm text-on-surface-light">
                <span>{{ agent.likes }} 赞</span>
                <span>{{ agent.uses }} 使用</span>
              </div>
              <div class="flex justify-end mt-3">
                <el-button
                  size="small"
                  type="primary"
                  @click="deployAgent(agent.id)"
                >
                  部署
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold mb-4 text-on-surface-light">最近活动</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start"
            >
              <el-avatar :size="32" :src="activity.user.avatar" class="mr-3" />
              <div class="flex-1">
                <p class="text-on-surface-light">
                  <span class="font-bold">{{ activity.user.name }}</span>
                  {{ activity.action }}
                </p>
                <p class="text-xs text-on-surface-light">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElAvatar, ElTag, ElIcon } from 'element-plus'
import { MagicStick, Plus, EditPen, Star } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户信息
const userInitials = ref('U')
const userName = ref('用户名')
const userPoints = ref(1250)
const checkedInToday = ref(false)

// 统计数据
const agentCount = ref(5)
const postCount = ref(12)
const followerCount = ref(128)
const likeCount = ref(342)

// 我的智能体
const myAgents = ref([
  {
    id: '1',
    name: '虚拟助手小智',
    description: '一个全能型AI助手',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1',
    status: '已部署',
    likes: 42,
    uses: 128
  },
  {
    id: '2',
    name: '游戏角色艾灵',
    description: '一位诗意的虚拟诗人',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
    status: '草稿',
    likes: 28,
    uses: 64
  }
])

// 最近活动
const recentActivities = ref([
  {
    id: '1',
    user: {
      name: '用户名',
      avatar: ''
    },
    action: '创建了新的智能体"游戏角色艾灵"',
    time: '2小时前'
  },
  {
    id: '2',
    user: {
      name: '用户名',
      avatar: ''
    },
    action: '在社区发布了帖子"如何创建独特的虚拟主播"',
    time: '1天前'
  },
  {
    id: '3',
    user: {
      name: '用户名',
      avatar: ''
    },
    action: '签到获得10积分',
    time: '1天前'
  }
])

// 签到
const checkIn = () => {
  if (!checkedInToday.value) {
    checkedInToday.value = true
    userPoints.value += 10
    // 这里应该调用后端API
    console.log('签到成功')
  }
}

// 部署智能体
const deployAgent = (agentId: string) => {
  // 跳转到部署页面，传递智能体ID
  router.push(`/deploy/${agentId}`)
}
</script>
