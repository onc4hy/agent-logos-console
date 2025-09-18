<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-8 text-on-surface-light">数据库备份管理</h1>

      <div class="max-w-4xl mx-auto">
        <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">备份操作</h2>
              <el-button @click="fetchBackups" type="primary" :loading="loading">刷新列表</el-button>
            </div>
          </template>

          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">创建新备份</h3>
            <el-button @click="createBackup" type="success" :loading="creatingBackup">
              创建备份
            </el-button>
            <p class="text-sm text-on-surface-light mt-2">
              点击按钮创建当前数据库的备份文件
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">现有备份</h3>
            <el-table :data="backups" style="width: 100%" v-loading="loading">
              <el-table-column prop="name" label="备份文件" />
              <el-table-column prop="date" label="创建时间" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="restoreBackup(scope.row.name)"
                    :loading="restoringBackup === scope.row.name"
                  >
                    恢复
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-if="backups.length === 0 && !loading" class="text-center py-8 text-on-surface-light">
              <p>暂无备份文件</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElCard, ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'

// 备份列表
const backups = ref<Array<{ name: string; date: string }>>([])

// 加载状态
const loading = ref(false)

// 创建备份状态
const creatingBackup = ref(false)

// 恢复备份状态
const restoringBackup = ref('')

// 获取备份列表
const fetchBackups = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/backup/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()

    if (data.backups) {
      // 格式化备份文件名显示
      backups.value = data.backups.map((filename: string) => {
        // 从文件名中提取日期信息
        const dateMatch = filename.match(/backup-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.sqlite/)
        const dateStr = dateMatch ? dateMatch[1].replace(/-/g, ':').replace(/(\d{4}):(\d{2}):(\d{2}):(\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3 $4:$5:$6') : '未知时间'
        return {
          name: filename,
          date: dateStr
        }
      })
    }
  } catch (error) {
    console.error('获取备份列表失败:', error)
    ElMessage.error('获取备份列表失败')
  } finally {
    loading.value = false
  }
}

// 创建备份
const createBackup = async () => {
  try {
    creatingBackup.value = true
    const response = await fetch('/api/backup/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()

    if (data.message) {
      ElMessage.success(data.message)
      // 刷新备份列表
      fetchBackups()
    } else {
      ElMessage.error(data.error || '创建备份失败')
    }
  } catch (error) {
    console.error('创建备份失败:', error)
    ElMessage.error('创建备份失败')
  } finally {
    creatingBackup.value = false
  }
}

// 恢复备份
const restoreBackup = async (filename: string) => {
  try {
    restoringBackup.value = filename
    const response = await fetch(`/api/backup/restore/${filename}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()

    if (data.message) {
      ElMessage.success(data.message)
    } else {
      ElMessage.error(data.error || '恢复备份失败')
    }
  } catch (error) {
    console.error('恢复备份失败:', error)
    ElMessage.error('恢复备份失败')
  } finally {
    restoringBackup.value = ''
  }
}

// 组件挂载时获取备份列表
onMounted(() => {
  fetchBackups()
})
</script>
