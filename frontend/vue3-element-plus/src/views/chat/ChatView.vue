<template>
  <div class="flex flex-col h-screen bg-surface">
    <!-- 聊天界面头部 -->
    <header class="bg-white shadow-sm py-4 px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <el-avatar :size="40" :src="currentAgent.avatar" class="mr-3" />
          <div>
            <h1 class="text-lg font-bold">{{ currentAgent.name }}</h1>
            <p class="text-sm text-on-surface-light">{{ currentAgent.status }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <el-button @click="toggleVoiceMode">
            <el-icon><Microphone /></el-icon>
            {{ voiceMode ? '关闭语音' : '开启语音' }}
          </el-button>
          <el-button @click="clearChat">
            <el-icon><Delete /></el-icon>
            清空对话
          </el-button>
          <el-button @click="showAgentInfo = true">
            <el-icon><InfoFilled /></el-icon>
            智能体信息
          </el-button>
        </div>
      </div>
    </header>

    <!-- 聊天消息区域 -->
    <div class="flex-1 overflow-y-auto p-6" ref="chatContainer">
      <div class="max-w-4xl mx-auto">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="text-center py-12">
          <el-avatar :size="80" :src="currentAgent.avatar" class="mx-auto mb-4" />
          <h2 class="text-2xl font-bold mb-2">{{ currentAgent.name }}</h2>
          <p class="text-on-surface-light max-w-2xl mx-auto">{{ currentAgent.description }}</p>
        </div>

        <!-- 消息列表 -->
        <div class="space-y-6">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-3xl rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white border border-surface-high-light rounded-tl-none'
              ]"
            >
              <!-- 用户消息 -->
              <div v-if="message.role === 'user'" class="flex items-start">
                <div class="mr-3">
                  <el-avatar :size="32" class="bg-secondary text-on-secondary">
                    {{ userInitials }}
                  </el-avatar>
                </div>
                <div class="flex-1">
                  <div class="font-bold mb-1">我</div>
                  <div class="whitespace-pre-wrap">{{ message.content }}</div>
                </div>
              </div>

              <!-- AI消息 -->
              <div v-else class="flex items-start">
                <div class="mr-3">
                  <el-avatar :size="32" :src="currentAgent.avatar" />
                </div>
                <div class="flex-1">
                  <div class="font-bold mb-1">{{ currentAgent.name }}</div>
                  <div class="whitespace-pre-wrap">{{ message.content }}</div>
                </div>
              </div>

              <!-- 语音播放按钮 -->
              <div v-if="message.role === 'assistant' && voiceMode" class="flex justify-end mt-2">
                <el-button
                  :icon="message.playing ? 'Pause' : 'Play'"
                  size="small"
                  @click="togglePlay(message)"
                  :loading="message.loading"
                >
                  {{ message.playing ? '暂停' : '播放' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 正在输入指示器 -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="max-w-3xl rounded-2xl px-4 py-3 bg-white border border-surface-high-light rounded-tl-none">
              <div class="flex items-start">
                <div class="mr-3">
                  <el-avatar :size="32" :src="currentAgent.avatar" />
                </div>
                <div class="flex-1">
                  <div class="font-bold mb-1">{{ currentAgent.name }}</div>
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-on-surface-light rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-on-surface-light rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-on-surface-light rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="bg-white border-t border-surface-high-light p-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex gap-2">
          <el-input
            v-model="inputMessage"
            placeholder="输入消息..."
            size="large"
            @keyup.enter="sendMessage"
            :disabled="isTyping"
          >
            <template #prefix>
              <el-icon><ChatLineRound /></el-icon>
            </template>
          </el-input>
          <el-button
            type="primary"
            size="large"
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isTyping"
            :loading="isSending"
          >
            发送
          </el-button>

          <!-- 语音输入按钮 -->
          <el-button
            v-if="voiceMode"
            :type="isListening ? 'danger' : 'default'"
            size="large"
            @click="toggleListening"
            :disabled="isTyping"
          >
            <el-icon><Microphone /></el-icon>
            {{ isListening ? '停止' : '语音' }}
          </el-button>
        </div>

        <div class="flex justify-between items-center mt-2 text-sm text-on-surface-light">
          <div>
            <el-tag v-if="voiceMode" type="success" size="small">语音模式已开启</el-tag>
          </div>
          <div>
            <span>按 Enter 发送，Shift + Enter 换行</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能体信息对话框 -->
    <el-dialog v-model="showAgentInfo" title="智能体信息" width="500">
      <div class="text-center">
        <el-avatar :size="80" :src="currentAgent.avatar" class="mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">{{ currentAgent.name }}</h2>
        <p class="text-on-surface-light mb-4">{{ currentAgent.description }}</p>

        <div class="grid grid-cols-2 gap-4 text-left">
          <div>
            <h3 class="font-bold mb-1">创建者</h3>
            <p>{{ currentAgent.creator }}</p>
          </div>
          <div>
            <h3 class="font-bold mb-1">能力</h3>
            <p>{{ currentAgent.capabilities }}</p>
          </div>
          <div>
            <h3 class="font-bold mb-1">个性</h3>
            <p>{{ currentAgent.personality }}</p>
          </div>
          <div>
            <h3 class="font-bold mb-1">知识领域</h3>
            <p>{{ currentAgent.knowledge }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAgentInfo = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElButton, ElInput, ElAvatar, ElDialog, ElTag, ElIcon } from 'element-plus'
import {
  ChatLineRound,
  Microphone,
  Delete,
  InfoFilled
} from '@element-plus/icons-vue'

// 定义消息类型
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  playing?: boolean
  loading?: boolean
}

// 模拟当前智能体信息
const currentAgent = ref({
  id: 'agent-1',
  name: 'AI助手小智',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1',
  status: '在线',
  description: '一个全能型AI助手，可以帮助你回答问题、创作文字、编程等',
  creator: '智能体调音台团队',
  capabilities: '问答、创作、编程、翻译',
  personality: '友好、专业、耐心',
  knowledge: '通用知识、技术文档、创意写作'
})

// 聊天状态
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isTyping = ref(false)
const isSending = ref(false)
const voiceMode = ref(false)
const isListening = ref(false)
const showAgentInfo = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// 用户信息
const userInitials = ref('U')

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  })

  const userMessage = inputMessage.value
  inputMessage.value = ''

  // 滚动到底部
  scrollToBottom()

  // 模拟AI回复
  isTyping.value = true
  scrollToBottom()

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 添加AI回复
  messages.value.push({
    role: 'assistant',
    content: `这是对"${userMessage}"的回复。我是一个AI助手，可以帮你解答各种问题。`,
    timestamp: new Date(),
    playing: false,
    loading: false
  })

  isTyping.value = false
  scrollToBottom()
}

// 切换语音模式
const toggleVoiceMode = () => {
  voiceMode.value = !voiceMode.value
  if (!voiceMode.value) {
    isListening.value = false
  }
}

// 切换语音输入
const toggleListening = () => {
  isListening.value = !isListening.value
  if (isListening.value) {
    // 开始语音识别
    console.log('开始语音识别')
  } else {
    // 停止语音识别
    console.log('停止语音识别')
  }
}

// 切换播放
const togglePlay = (message: Message) => {
  message.playing = !message.playing
  message.loading = true

  // 模拟语音播放
  setTimeout(() => {
    message.loading = false
    if (message.playing) {
      console.log('开始播放语音')
    } else {
      console.log('暂停播放语音')
    }
  }, 500)
}

// 清空对话
const clearChat = () => {
  messages.value = []
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 初始化
onMounted(() => {
  // 添加欢迎消息
  messages.value.push({
    role: 'assistant',
    content: '你好！我是AI助手小智，有什么我可以帮助你的吗？',
    timestamp: new Date()
  })
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>