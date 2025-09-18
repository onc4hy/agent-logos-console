<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 text-on-surface-light">创作者社区</h1>
      <p class="text-center text-on-surface-light mb-12 max-w-2xl mx-auto">与全球AI创作者交流经验，分享作品</p>

      <div class="max-w-6xl mx-auto">
        <!-- 发布帖子按钮 -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex items-center">
            <el-avatar :size="40" class="mr-4 bg-secondary text-on-secondary">
              {{ userInitials }}
            </el-avatar>
            <div class="flex-1">
              <el-input
                placeholder="分享你的想法..."
                @focus="showPostDialog = true"
              />
            </div>
          </div>
        </div>

        <!-- 帖子列表 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="border-b border-surface-high-light p-4">
            <h2 class="text-xl font-bold text-on-surface-light">热门帖子</h2>
          </div>

          <!-- 帖子列表 -->
          <div v-if="!loading">
            <div
              v-for="post in posts"
              :key="post.id"
              class="border-b border-surface-high-light last:border-b-0 hover:bg-surface"
            >
              <div class="p-6">
                <div class="flex">
                  <!-- 用户信息 -->
                  <div class="mr-4">
                    <el-avatar :size="40" :src="post.author.avatar" />
                  </div>

                  <!-- 帖子内容 -->
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <h3 class="font-bold">{{ post.author.name }}</h3>
                      <span class="mx-2 text-on-surface-light">•</span>
                      <span class="text-sm text-on-surface-light">{{ post.timeAgo }}</span>
                    </div>

                    <h2 class="text-xl font-bold mb-3">{{ post.title }}</h2>
                    <p class="text-on-surface-light mb-4">{{ post.content }}</p>

                    <!-- 帖子图片 -->
                    <div v-if="post.images && post.images.length > 0" class="grid grid-cols-3 gap-2 mb-4">
                      <div
                        v-for="(image, index) in post.images"
                        :key="index"
                        class="aspect-square rounded-lg overflow-hidden"
                      >
                        <img :src="image" :alt="`图片${index + 1}`" class="w-full h-full object-cover">
                      </div>
                    </div>

                    <!-- 帖子操作 -->
                    <div class="flex items-center justify-between">
                      <div class="flex gap-4">
                        <el-button
                          :type="post.liked ? 'primary' : 'default'"
                          link
                          @click="toggleLike(post)"
                        >
                          <el-icon class="mr-1"><Star /></el-icon>
                          {{ post.likes }} 赞
                        </el-button>

                        <el-button link @click="toggleComment(post)">
                          <el-icon class="mr-1"><ChatLineRound /></el-icon>
                          {{ post.comments }} 评论
                        </el-button>

                        <el-button link @click="sharePost(post)">
                          <el-icon class="mr-1"><Share /></el-icon>
                          分享
                        </el-button>
                      </div>

                      <div>
                        <el-button
                          :type="post.bookmarked ? 'primary' : 'default'"
                          link
                          @click="toggleBookmark(post)"
                        >
                          <el-icon><Collection /></el-icon>
                        </el-button>
                      </div>
                    </div>

                    <!-- 评论区域 -->
                    <div v-if="post.showComments" class="mt-6 pt-6 border-t border-surface-high-light">
                      <!-- 评论输入 -->
                      <div class="flex mb-4">
                        <el-avatar :size="32" class="mr-3 bg-secondary text-on-secondary">
                          {{ userInitials }}
                        </el-avatar>
                        <div class="flex-1">
                          <el-input
                            v-model="post.newComment"
                            placeholder="添加评论..."
                            @keyup.enter="addComment(post)"
                          />
                        </div>
                      </div>

                      <!-- 评论列表 -->
                      <div
                        v-for="comment in post.commentList"
                        :key="comment.id"
                        class="flex mb-4"
                      >
                        <el-avatar :size="32" :src="comment.author.avatar" class="mr-3" />
                        <div class="flex-1">
                          <div class="bg-surface rounded-lg p-3">
                            <div class="flex items-center mb-1">
                              <h4 class="font-bold text-sm">{{ comment.author.name }}</h4>
                              <span class="mx-2 text-xs text-on-surface-light">•</span>
                              <span class="text-xs text-on-surface-light">{{ comment.timeAgo }}</span>
                            </div>
                            <p class="text-on-surface-light">{{ comment.content }}</p>
                          </div>

                          <div class="flex gap-3 mt-2">
                            <el-button
                              :type="comment.liked ? 'primary' : 'default'"
                              link
                              size="small"
                              @click="toggleCommentLike(comment)"
                            >
                              <el-icon class="mr-1"><Star /></el-icon>
                              {{ comment.likes }}
                            </el-button>
                            <el-button link size="small">回复</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <el-icon :size="32" class="animate-spin"><Loading /></el-icon>
            <p class="mt-2 text-on-surface-light">加载中...</p>
          </div>

          <!-- 分页 -->
          <div class="flex justify-center p-6">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="totalPosts"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 发布帖子对话框 -->
  <el-dialog v-model="showPostDialog" title="发布新帖子" width="600">
    <el-form :model="newPost" label-width="0">
      <el-form-item>
        <el-input
          v-model="newPost.title"
          placeholder="标题"
          size="large"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="newPost.content"
          type="textarea"
          :rows="4"
          placeholder="分享你的想法..."
        />
      </el-form-item>

      <el-form-item>
        <div class="flex gap-2">
          <el-button @click="addImage">
            <el-icon><Picture /></el-icon>
            添加图片
          </el-button>
          <el-button @click="addEmoji">
            <el-icon><Star /></el-icon>
            添加表情
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPostDialog = false">取消</el-button>
        <el-button type="primary" @click="publishPost" :loading="publishing">
          发布
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElButton, ElInput, ElAvatar, ElDialog, ElForm, ElFormItem, ElPagination, ElIcon } from 'element-plus'
import {
  Star,
  ChatLineRound,
  Share,
  Collection,
  Loading,
  Picture
} from '@element-plus/icons-vue'

// 定义帖子类型
interface Comment {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  timeAgo: string
  likes: number
  liked: boolean
}

interface Post {
  id: string
  author: {
    name: string
    avatar: string
  }
  title: string
  content: string
  timeAgo: string
  likes: number
  liked: boolean
  comments: number
  bookmarked: boolean
  images?: string[]
  showComments: boolean
  newComment: string
  commentList: Comment[]
}

// 用户信息
const userInitials = ref('U')
// const isLoggedIn = ref(true) // 模拟登录状态

// 帖子状态
const posts = ref<Post[]>([])
const loading = ref(false)
const showPostDialog = ref(false)
const publishing = ref(false)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(100)

// 新帖子表单
const newPost = ref({
  title: '',
  content: ''
})

// 切换点赞
const toggleLike = (post: Post) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
}

// 切换评论显示
const toggleComment = (post: Post) => {
  post.showComments = !post.showComments
}

// 切换收藏
const toggleBookmark = (post: Post) => {
  post.bookmarked = !post.bookmarked
}

// 添加评论
const addComment = (post: Post) => {
  if (!post.newComment.trim()) return

  post.commentList.push({
    id: `comment-${Date.now()}`,
    author: {
      name: '我',
      avatar: ''
    },
    content: post.newComment,
    timeAgo: '刚刚',
    likes: 0,
    liked: false
  })

  post.comments++
  post.newComment = ''
}

// 切换评论点赞
const toggleCommentLike = (comment: Comment) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}

// 分享帖子
const sharePost = (post: Post) => {
  console.log('分享帖子:', post.title)
}

// 添加图片
const addImage = () => {
  console.log('添加图片')
}

// 添加表情
const addEmoji = () => {
  console.log('添加表情')
}

// 发布帖子
const publishPost = () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim()) {
    return
  }

  publishing.value = true

  // 模拟发布
  setTimeout(() => {
    publishing.value = false
    showPostDialog.value = false

    // 重置表单
    newPost.value = {
      title: '',
      content: ''
    }

    // 重新加载帖子
    loadPosts()
  }, 1000)
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadPosts()
}

// 模拟数据加载
const loadPosts = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    posts.value = [
      {
        id: 'post-1',
        author: {
          name: 'AI创作者A',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'
        },
        title: '如何创建一个独特的虚拟主播',
        content: '今天我想分享一下我在创建虚拟主播过程中的一些经验和技巧。首先，最重要的是要确定你的虚拟主播的个性和特点...',
        timeAgo: '2小时前',
        likes: 24,
        liked: false,
        comments: 8,
        bookmarked: false,
        images: [
          'https://api.dicebear.com/7.x/bottts/svg?seed=1',
          'https://api.dicebear.com/7.x/bottts/svg?seed=2',
          'https://api.dicebear.com/7.x/bottts/svg?seed=3'
        ],
        showComments: false,
        newComment: '',
        commentList: [
          {
            id: 'comment-1',
            author: {
              name: '创作者B',
              avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'
            },
            content: '非常有用的经验分享，感谢！',
            timeAgo: '1小时前',
            likes: 3,
            liked: false
          }
        ]
      },
      {
        id: 'post-2',
        author: {
          name: '智能体开发者',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3'
        },
        title: '智能体调音台新功能预告',
        content: '我们即将推出全新的智能体部署功能，支持一键发布到多个平台。敬请期待！',
        timeAgo: '5小时前',
        likes: 42,
        liked: true,
        comments: 12,
        bookmarked: true,
        showComments: false,
        newComment: '',
        commentList: []
      }
    ]

    loading.value = false
  }, 500)
}

// 初始化
onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>