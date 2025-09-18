<template>
  <div class="min-h-screen flex items-start justify-center bg-surface pt-16">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-primary">智能体调音台</h1>
        <p class="mt-2 text-on-surface-light">赋予你的AI灵魂独一无二的声线</p>
      </div>

      <slot />

      <div class="text-center text-sm text-on-surface-light">
        <router-link to="/" class="text-primary hover:underline">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 登录/注册页面专用布局
</script>
