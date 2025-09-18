<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 text-on-surface-light">每日签到</h1>
      <p class="text-center text-on-surface-light mb-12 max-w-2xl mx-auto">坚持签到，获取丰厚积分奖励</p>

      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div class="text-center mb-8">
            <div class="text-5xl font-bold text-primary mb-2">{{ userPoints }}</div>
            <div class="text-on-surface-light">当前积分</div>
          </div>

          <div class="flex justify-center mb-8">
            <div class="relative">
              <div class="w-48 h-48 rounded-full border-4 border-surface-high-light flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold mb-2" :class="checkedInToday ? 'text-success' : 'text-on-surface-light'">
                    {{ checkedInToday ? '已签到' : '未签到' }}
                  </div>
                  <div class="text-4xl font-bold text-primary">+{{ todayPoints }}</div>
                  <div class="text-on-surface-light">积分</div>
                </div>
              </div>

              <el-button
                type="primary"
                size="large"
                round
                :disabled="checkedInToday"
                @click="checkIn"
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
              >
                {{ checkedInToday ? '已签到' : '立即签到' }}
              </el-button>
            </div>
          </div>

          <div class="text-center">
            <p class="text-on-surface-light mb-2">连续签到 {{ consecutiveDays }} 天</p>
            <p class="text-sm text-on-surface-light">连续签到7天可获得额外奖励</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-on-surface-light">签到日历</h2>
          <div class="grid grid-cols-7 gap-2 mb-4">
            <div v-for="day in weekDays" :key="day" class="text-center font-bold text-on-surface-light">
              {{ day }}
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="date in calendarDays"
              :key="date.date"
              :class="[
                'h-12 rounded-lg flex items-center justify-center',
                date.isToday ? 'bg-primary text-white' : '',
                date.isChecked ? 'bg-success text-white' : '',
                !date.isCurrentMonth ? 'text-on-surface-light' : ''
              ]"
            >
              {{ date.day }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 class="text-2xl font-bold mb-6 text-on-surface-light">积分记录</h2>
          <el-table :data="pointRecords" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180" />
            <el-table-column prop="description" label="说明" />
            <el-table-column prop="points" label="积分" width="100">
              <template #default="scope">
                <span class="text-success font-bold">+{{ scope.row.points }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'

// 用户积分数据
const userPoints = ref(1250)
const checkedInToday = ref(false)
const consecutiveDays = ref(3)
const todayPoints = ref(10)

// 签到处理
const checkIn = () => {
  if (!checkedInToday.value) {
    checkedInToday.value = true
    userPoints.value += todayPoints.value
    consecutiveDays.value++

    // 这里应该调用后端API记录签到
    console.log('签到成功')
  }
}

// 日历数据
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 生成日历数据
const calendarDays = computed(() => {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  const days = eachDayOfInterval({ start, end })

  // 获取当月第一天是星期几
  const firstDayOfWeek = start.getDay()

  // 补充前面的日期
  const prevMonthDays = []
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(start)
    date.setDate(date.getDate() - (i + 1))
    prevMonthDays.push({
      date: format(date, 'yyyy-MM-dd'),
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
      isChecked: false
    })
  }

  // 当前月的日期
  const currentMonthDays = days.map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    day: date.getDate(),
    isCurrentMonth: true,
    isToday: isToday(date),
    isChecked: isSameDay(date, now) && checkedInToday.value
  }))

  // 补充后面的日期
  const nextMonthDays = []
  const totalCells = 42 // 6行7列
  const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length)
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(end)
    date.setDate(date.getDate() + i)
    nextMonthDays.push({
      date: format(date, 'yyyy-MM-dd'),
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
      isChecked: false
    })
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
})

// 积分记录数据
const pointRecords = ref([
  {
    date: '2025-09-12',
    description: '每日签到',
    points: 10
  },
  {
    date: '2025-09-11',
    description: '每日签到',
    points: 10
  },
  {
    date: '2025-09-10',
    description: '每日签到',
    points: 10
  },
  {
    date: '2025-09-09',
    description: '连续签到奖励',
    points: 50
  },
  {
    date: '2025-09-09',
    description: '每日签到',
    points: 10
  }
])
</script>