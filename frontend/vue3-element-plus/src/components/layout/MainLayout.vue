<template>
  <div id="main-layout" class="min-h-screen flex flex-col bg-surface">
    <!-- Header -->
    <header class="bg-white shadow-sm z-50 fixed w-full top-0">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-primary">智能体调音台</h1>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <el-button @click="mobileMenuVisible = true" link>
              <el-icon size="24"><Menu /></el-icon>
            </el-button>
          </div>

          <nav class="hidden md:flex space-x-8">
            <router-link
              to="/"
              class="text-on-surface-light hover:text-primary"
              active-class="text-primary font-semibold border-b-2 border-primary"
              exact
            >
              首页
            </router-link>
            <router-link
              to="/agents"
              class="text-on-surface-light hover:text-primary"
              active-class="text-primary font-semibold border-b-2 border-primary"
            >
              智能体
            </router-link>
            <router-link
              to="/pricing"
              class="text-on-surface-light hover:text-primary"
              active-class="text-primary font-semibold border-b-2 border-primary"
            >
              价格
            </router-link>
            <router-link
              to="/faq"
              class="text-on-surface-light hover:text-primary"
              active-class="text-primary font-semibold border-b-2 border-primary"
            >
              常见问题
            </router-link>
            <router-link
              to="/community"
              class="text-on-surface-light hover:text-primary"
              active-class="text-primary font-semibold border-b-2 border-primary"
            >
              社区
            </router-link>
          </nav>

          <div class="flex items-center space-x-4">
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="text-primary hover:text-primary-light-3 font-medium">登录</router-link>
              <router-link to="/register" class="bg-secondary text-on-secondary px-4 py-2 rounded-md hover:bg-secondary-light-3 font-medium transition-colors">注册</router-link>
            </template>
            <template v-else>
              <router-link
                to="/dashboard"
                class="text-on-surface-light hover:text-primary font-medium hidden md:block"
              >
                控制台
              </router-link>
              <div class="w-px h-6 bg-gray-300 hidden md:block"></div>
              <el-dropdown @visible-change="handleDropdownVisibleChange">
                <div class="flex items-center cursor-pointer">
                  <el-avatar :size="32" class="mr-1">
                    {{ userInitials }}
                  </el-avatar>
                  <el-icon class="transition-transform duration-300" :class="{ 'rotate-180': isDropdownVisible }">
                    <ArrowDown />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="$router.push('/dashboard')">控制台</el-dropdown-item>
                    <el-dropdown-item @click="$router.push('/agents')">我的智能体</el-dropdown-item>
                    <el-dropdown-item @click="$router.push('/checkin')">签到积分</el-dropdown-item>
                    <el-dropdown-item @click="$router.push('/backup')">备份管理</el-dropdown-item>
                    <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile menu dialog -->
    <el-dialog
      v-model="mobileMenuVisible"
      :show-close="false"
      width="80%"
      class="mobile-menu-dialog"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-primary">菜单</h2>
          <el-button @click="mobileMenuVisible = false" link>
            <el-icon size="24"><Close /></el-icon>
          </el-button>
        </div>
      </template>

      <nav class="flex flex-col space-y-4">
        <router-link
          to="/"
          class="text-on-surface-light hover:text-primary py-2"
          active-class="text-primary font-semibold"
          exact
          @click="mobileMenuVisible = false"
        >
          首页
        </router-link>
        <router-link
          to="/agents"
          class="text-on-surface-light hover:text-primary py-2"
          active-class="text-primary font-semibold"
          @click="mobileMenuVisible = false"
        >
          智能体
        </router-link>
        <router-link
          to="/pricing"
          class="text-on-surface-light hover:text-primary py-2"
          active-class="text-primary font-semibold"
          @click="mobileMenuVisible = false"
        >
          价格
        </router-link>
        <router-link
          to="/faq"
          class="text-on-surface-light hover:text-primary py-2"
          active-class="text-primary font-semibold"
          @click="mobileMenuVisible = false"
        >
          常见问题
        </router-link>
        <router-link
          to="/community"
          class="text-on-surface-light hover:text-primary py-2"
          active-class="text-primary font-semibold"
          @click="mobileMenuVisible = false"
        >
          社区
        </router-link>

        <template v-if="isLoggedIn">
          <div class="border-t border-gray-200 my-4"></div>
          <router-link
            to="/dashboard"
            class="text-on-surface-light hover:text-primary py-2"
            active-class="text-primary font-semibold"
            @click="mobileMenuVisible = false"
          >
            控制台
          </router-link>
          <router-link
            to="/agents"
            class="text-on-surface-light hover:text-primary py-2"
            active-class="text-primary font-semibold"
            @click="mobileMenuVisible = false"
          >
            我的智能体
          </router-link>
          <router-link
            to="/checkin"
            class="text-on-surface-light hover:text-primary py-2"
            active-class="text-primary font-semibold"
            @click="mobileMenuVisible = false"
          >
            签到积分
          </router-link>
          <router-link
            to="/backup"
            class="text-on-surface-light hover:text-primary py-2"
            active-class="text-primary font-semibold"
            @click="mobileMenuVisible = false"
          >
            备份管理
          </router-link>
          <el-button @click="logout" type="danger" class="mt-4">退出登录</el-button>
        </template>
        <template v-else>
          <div class="border-t border-gray-200 my-4"></div>
          <router-link
            to="/login"
            class="text-primary hover:text-primary-light-3 py-2 font-medium"
            @click="mobileMenuVisible = false"
          >
            登录
          </router-link>
          <router-link
            to="/register"
            class="bg-secondary text-on-secondary py-2 rounded-md hover:bg-secondary-light-3 font-medium text-center"
            @click="mobileMenuVisible = false"
          >
            注册
          </router-link>
        </template>
      </nav>
    </el-dialog>

    <!-- Main Content -->
    <main class="flex-grow mt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-surface-dark text-on-surface-dark py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">智能体调音台</h3>
            <p class="text-on-surface-dark">赋予你的AI灵魂独一无二的声线</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">联系方式</h3>
            <ul class="space-y-2">
              <li>公司地址：待定</li>
              <li>联系电话：待定</li>
              <li>企业邮箱：待定</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">快速链接</h3>
            <ul class="space-y-2">
              <li><router-link to="/pricing" class="hover:text-secondary">价格</router-link></li>
              <li><router-link to="/faq" class="hover:text-secondary">常见问题</router-link></li>
              <li><router-link to="/community" class="hover:text-secondary">社区</router-link></li>
              <li><a href="#" class="hover:text-secondary">隐私政策</a></li>
              <li><a href="#" class="hover:text-secondary">服务条款</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-surface-high-dark mt-8 pt-8 text-center">
          <p>&copy; 2025 智能体调音台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElIcon, ElButton, ElDialog } from 'element-plus'
import { ArrowDown, Menu, Close } from '@element-plus/icons-vue'

// 用户状态
const isLoggedIn = ref(false)
const userName = ref('')
const userInitials = computed(() => {
  return userName.value ? userName.value.charAt(0).toUpperCase() : 'U'
})

// 下拉菜单状态
const isDropdownVisible = ref(false)

// 移动端菜单状态
const mobileMenuVisible = ref(false)

const router = useRouter()

// 检查本地存储中的登录状态
const checkLoginStatus = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      isLoggedIn.value = true
      userName.value = userData.name || '用户'
    } catch {
      // 解析失败，清除无效数据
      localStorage.removeItem('user')
    }
  }
}

// 登出功能
const logout = () => {
  isLoggedIn.value = false
  userName.value = ''
  localStorage.removeItem('user')
  router.push('/')
  mobileMenuVisible.value = false
}

// 处理用户登录事件
const handleUserLogin = (event: Event) => {
  const customEvent = event as CustomEvent
  if (customEvent.detail) {
    const { isLoggedIn: loginStatus, name } = customEvent.detail
    isLoggedIn.value = loginStatus
    userName.value = name || '用户'
    if (loginStatus && name) {
      localStorage.setItem('user', JSON.stringify({ name }))
    }
  }
}

// 处理下拉菜单可见性变化
const handleDropdownVisibleChange = (visible: boolean) => {
  isDropdownVisible.value = visible
}

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus()

  // 监听其他标签页的登录/登出事件
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      checkLoginStatus()
    }
  })

  // 监听用户登录事件
  window.addEventListener('user-login', handleUserLogin)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('user-login', handleUserLogin)
})

// 暴露给父组件的方法，用于更新登录状态
defineExpose({
  setLoginStatus: (status: boolean, name: string = '') => {
    isLoggedIn.value = status
    userName.value = name
    if (status && name) {
      localStorage.setItem('user', JSON.stringify({ name }))
    } else {
      localStorage.removeItem('user')
    }
  },
  isLoggedIn
})
</script>
