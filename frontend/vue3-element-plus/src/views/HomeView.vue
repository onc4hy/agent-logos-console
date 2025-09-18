<template>
  <div class="overflow-hidden relative">
    <!-- Right Navigation Dots -->
    <div class="fixed flex flex-col justify-center items-center right-8 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
      <div
        v-for="(section, index) in sections"
        :key="index"
        @click="scrollToSection(index)"
        class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center"
        :class="[
          activeSection === index ? 'bg-white w-5 h-5 border-2 border-primary' : 'bg-white bg-opacity-50',
          section.dotClass || ''
        ]"
        :title="section.title"
      >
        <div
          v-if="activeSection === index"
          class="w-2 h-2 rounded-full bg-primary"
        ></div>
      </div>
    </div>

    <!-- Hero Section (First Screen) -->
    <section ref="section0" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-blue-900 text-white relative">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">赋予你的AI灵魂独一无二的声线</h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">智能体调音台——是创作者打造非凡AI伙伴的终极工作室。不再受限，释放你100%的创意想象。</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <el-button type="primary" size="large" @click="$router.push('/dashboard')" class="bg-secondary border-secondary hover:bg-blue-400">进入我的工作室</el-button>
          <el-button type="default" size="large" @click="$router.push('/community')" class="bg-white text-primary hover:bg-gray-100">探索创作者画廊</el-button>
        </div>
      </div>
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" @click="scrollToSection(1)">
        <el-icon :size="32"><ArrowDown /></el-icon>
      </div>
    </section>

    <!-- Agent Gallery Section (Second Screen) -->
    <section ref="section1" class="min-h-screen flex items-center bg-gradient-to-br from-surface to-gray-200 text-on-surface-light">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">创作者智能体画廊</h2>
        <div class="relative">
          <swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            :breakpoints="{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              }
            }"
            :pagination="{
              clickable: true,
            }"
            :navigation="{
              nextEl: '.gallery-swiper-next',
              prevEl: '.gallery-swiper-prev'
            }"
            class="mySwiper"
          >
            <swiper-slide v-for="(agent, index) in agents" :key="index">
              <div class="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-xl transition-shadow" @click="viewAgent(agent.id)">
                <div class="p-6 flex-grow">
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold">{{ agent.name }}</h3>
                    <el-tag :type="agent.status === 'published' ? 'success' : 'info'">{{ agent.status }}</el-tag>
                  </div>
                  <p class="text-gray-600 mb-4">{{ agent.description }}</p>

                  <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                      <el-tag v-for="tag in agent.tags" :key="tag" type="primary" effect="plain">{{ tag }}</el-tag>
                    </div>
                  </div>

                  <div class="mb-4">
                    <h4 class="font-semibold mb-2">部署平台:</h4>
                    <div class="flex flex-wrap gap-2">
                      <el-tag v-for="platform in agent.platforms" :key="platform" type="success">{{ platform }}</el-tag>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 border-t">
                  <div class="flex justify-between text-sm">
                    <span>访问次数: {{ agent.visits }}</span>
                    <span>订阅数: {{ agent.subscribers }}</span>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <!-- 自定义导航按钮 -->
          <div class="gallery-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
              <el-icon><ArrowLeft /></el-icon>
            </div>
          </div>
          <div class="gallery-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Painpoints Section (Third Screen) -->
    <section ref="section2" class="min-h-screen flex items-center bg-gradient-to-br from-white to-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-on-surface-light">你的AI创意是否被平台模板所禁锢？</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-surface p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-3">千篇一律</h3>
            <p class="text-on-surface-light">做出的智能体总带着平台模板的"味道"，无法体现独特风格。</p>
          </div>
          <div class="bg-surface p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-3">能力割裂</h3>
            <p class="text-on-surface-light">一个平台一种能力，你的"全能助手"被拆得七零八落。</p>
          </div>
          <div class="bg-surface p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-3">分发繁琐</h3>
            <p class="text-on-surface-light">精心制作的智能体，却要手动复制到各个平台，维护到头疼。</p>
          </div>
          <div class="bg-surface p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-3">缺乏品牌</h3>
            <p class="text-on-surface-light">无法为自己的智能体打上鲜明的个人或品牌烙印。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solutions Section (Fourth Screen) -->
    <section ref="section3" class="min-h-screen flex items-center bg-gradient-to-br from-surface to-gray-300">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-on-surface-light">你的AI，理应由你完全主宰</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-2">深度人格定制</h3>
            <h4 class="text-lg font-semibold mb-2 text-primary">从语调到价值观，精细雕琢</h4>
            <p class="text-on-surface-light">远超基础指令，用丰富的参数和知识库注入灵魂，打造有记忆、有性格的AI。</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-2">多平台一键分发</h3>
            <h4 class="text-lg font-semibold mb-2 text-primary">让你的人物活跃在每一个舞台</h4>
            <p class="text-on-surface-light">写一次人设，即可同时发布到视频站、社交媒体、社群，保持统一的完美人设。</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-2">专属品牌空间</h3>
            <h4 class="text-lg font-semibold mb-2 text-primary">为你的智能体打造一个家</h4>
            <p class="text-on-surface-light">提供专属落地页，可绑定独立域名，自定义UI，收集粉丝互动。</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-2">创作者数据分析</h3>
            <h4 class="text-lg font-semibold mb-2 text-primary">洞察你的观众最爱哪一面</h4>
            <p class="text-on-surface-light">分析不同平台用户的交互偏好，帮你优化人设，持续吸粉。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section (Fifth Screen) -->
    <section ref="section4" class="min-h-screen flex items-center bg-gradient-to-br from-primary-container to-blue-200 text-on-primary">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">从AI使用者，进阶为AI创造家</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div class="flex items-start">
            <div class="mr-4 text-secondary">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">树立个人品牌</h3>
              <p>打造具有超高辨识度的AIIP，成为领域内的标志性人物。</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="mr-4 text-secondary">
              <el-icon :size="24"><TrendCharts /></el-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">最大化创作价值</h3>
              <p>一个核心创意，无限渠道分发，极大扩展影响力和变现潜力。</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="mr-4 text-secondary">
              <el-icon :size="24"><MagicStick /></el-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">极致创作体验</h3>
              <p>享受从零到一创造数字生命的全过程，所有工具触手可及。</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="mr-4 text-secondary">
              <el-icon :size="24"><Connection /></el-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">连接深度粉丝</h3>
              <p>通过独一无二的AI体验，与你的受众建立更深厚的情感连接。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section (Sixth Screen) -->
    <section ref="section5" class="min-h-screen flex items-center bg-gradient-to-br from-white to-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-on-surface-light">客户见证</h2>
        <div class="max-w-4xl mx-auto space-y-8">
          <div class="bg-surface p-8 rounded-lg shadow-lg">
            <p class="text-lg italic mb-4">"我用调音台打造的虚拟诗人'艾灵'，她的语言风格全网独一份。现在她不仅在公众号，还在Discord上和她的诗迷们聊天，这太酷了！"</p>
            <p class="font-semibold">—— 独立创作者 林小姐</p>
          </div>
          <div class="bg-surface p-8 rounded-lg shadow-lg">
            <p class="text-lg italic mb-4">"它把我们设计的游戏角色AI从'概念'变成了'真实存在'。玩家可以在任何地方和他们喜欢的角色聊天，这对IP来说是革命性的。"</p>
            <p class="font-semibold">—— 某独立游戏工作室</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section (Seventh Screen) -->
    <section ref="section6" class="min-h-screen flex items-center bg-gradient-to-br from-secondary to-blue-400 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">启动你的创造者之旅</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">加入创作者计划，获得专属推广位与收益分成。</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <el-button type="primary" size="large" @click="$router.push('/register')" class="bg-primary border-primary hover:bg-blue-800">立即创作</el-button>
          <el-button type="default" size="large" @click="$router.push('/pricing')" class="bg-white text-secondary hover:bg-gray-100">了解创作者计划</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElButton, ElIcon, ElTag } from 'element-plus'
import { ArrowDown, Star, TrendCharts, MagicStick, Connection } from '@element-plus/icons-vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useRouter } from 'vue-router'

const router = useRouter()

// Swiper modules
const modules = [Navigation, Pagination]

// Sections references
const sections = ref([
  { title: '首页', dotClass: '' },
  { title: '智能体画廊', dotClass: '' },
  { title: '痛点问题', dotClass: '' },
  { title: '解决方案', dotClass: '' },
  { title: '产品优势', dotClass: '' },
  { title: '客户见证', dotClass: '' },
  { title: '立即创作', dotClass: '' }
])

const sectionRefs = ref<HTMLElement[]>([])
const activeSection = ref(0)

// Mock data for agents gallery
const agents = ref([
  {
    id: 'agent-1',
    name: '虚拟诗人艾灵',
    description: '一位会写诗的AI，拥有独特的文学风格和情感表达',
    status: 'published',
    tags: ['文学创作', '情感陪伴', '诗歌'],
    platforms: ['微信公众号', 'Discord', 'Telegram'],
    visits: 12400,
    subscribers: 856
  },
  {
    id: 'agent-2',
    name: '编程助手CodeMaster',
    description: '专业的编程导师，支持多种编程语言的教学和答疑',
    status: 'published',
    tags: ['编程教育', '技术答疑', '代码审查'],
    platforms: ['GitHub', 'Stack Overflow', 'Slack'],
    visits: 9800,
    subscribers: 1200
  },
  {
    id: 'agent-3',
    name: '健康顾问Dr.Health',
    description: '个性化的健康管理助手，提供饮食和运动建议',
    status: 'published',
    tags: ['健康管理', '营养建议', '运动指导'],
    platforms: ['微信小程序', 'iOS App', 'Android App'],
    visits: 15600,
    subscribers: 2100
  },
  {
    id: 'agent-4',
    name: '英语外教Emma',
    description: '沉浸式英语学习伙伴，提供口语练习和语法指导',
    status: 'published',
    tags: ['语言学习', '口语练习', '文化介绍'],
    platforms: ['WhatsApp', 'Facebook Messenger', 'Web'],
    visits: 21300,
    subscribers: 3400
  },
  {
    id: 'agent-5',
    name: '旅游规划师TravelPro',
    description: '个性化的旅游路线规划师，根据喜好定制行程',
    status: 'published',
    tags: ['旅游规划', '景点推荐', '预算管理'],
    platforms: ['TripAdvisor', '小红书', '微博'],
    visits: 7800,
    subscribers: 650
  }
])

// 查看智能体详情
const viewAgent = (id: string) => {
  // 跳转到智能体列表页面，并传递智能体ID
  router.push(`/agents?id=${id}`)
}

// Scroll handling
const handleScroll = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 2

  for (let i = sectionRefs.value.length - 1; i >= 0; i--) {
    const section = sectionRefs.value[i]
    if (section && section.offsetTop <= scrollPosition) {
      activeSection.value = i
      break
    }
  }
}

const scrollToSection = (index: number) => {
  const section = sectionRefs.value[index]
  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth'
    })
  }
}

// Set section references
onMounted(() => {
  sectionRefs.value = [
    document.querySelector('section:nth-child(2)') as HTMLElement,
    document.querySelector('section:nth-child(3)') as HTMLElement,
    document.querySelector('section:nth-child(4)') as HTMLElement,
    document.querySelector('section:nth-child(5)') as HTMLElement,
    document.querySelector('section:nth-child(6)') as HTMLElement,
    document.querySelector('section:nth-child(7)') as HTMLElement,
    document.querySelector('section:nth-child(8)') as HTMLElement
  ]

  window.addEventListener('scroll', handleScroll)
  handleScroll() // Set initial active section
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
section {
  scroll-snap-align: start;
}

body {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Swiper custom styles */
.mySwiper {
  padding: 20px 0;
}

/* 隐藏默认导航按钮 */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  display: none !important;
}

/* 自定义导航按钮样式 */
.gallery-swiper-prev,
.gallery-swiper-next {
  transition: all 0.3s ease;
}

.gallery-swiper-prev:hover,
.gallery-swiper-next:hover {
  transform: scale(1.1) translate(-50%, -50%);
}

.gallery-swiper-prev:hover .w-8,
.gallery-swiper-next:hover .w-8 {
  background-color: rgba(64, 158, 255, 0.1);
}

.swiper-pagination-bullet-active {
  background-color: #0D47A1;
}
</style>
