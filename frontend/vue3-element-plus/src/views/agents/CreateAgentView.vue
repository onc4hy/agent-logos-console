<template>
  <div class="py-12 bg-surface">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold mb-8 text-on-surface-light">创建新智能体</h1>

      <div class="max-w-4xl mx-auto">
        <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">智能体信息</h2>
              <div>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveAgent" :loading="saving">保存</el-button>
              </div>
            </div>
          </template>

          <el-form
            :model="agentForm"
            :rules="rules"
            ref="formRef"
            label-width="120px"
            label-position="top"
          >
            <!-- 标题 -->
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="agentForm.title"
                placeholder="请输入智能体标题"
              />
            </el-form-item>

            <!-- 描述 -->
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="agentForm.description"
                type="textarea"
                :rows="3"
                placeholder="请输入智能体描述"
              />
            </el-form-item>

            <!-- 功能标签 -->
            <el-form-item label="功能标签" prop="tags">
              <div class="flex flex-wrap gap-2 mb-2">
                <el-tag
                  v-for="tag in agentForm.tags"
                  :key="tag"
                  closable
                  @close="removeTag(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="flex">
                <el-input
                  v-model="newTag"
                  placeholder="添加标签"
                  @keyup.enter="addTag"
                  class="flex-1"
                />
                <el-button class="ml-2" @click="addTag">添加</el-button>
              </div>
            </el-form-item>

            <!-- 提示词编辑 -->
            <el-form-item label="提示词" prop="prompt">
              <el-input
                v-model="agentForm.prompt"
                type="textarea"
                :rows="6"
                placeholder="请输入提示词"
              />
              <div class="mt-2 text-sm text-on-surface-light">
                <p>提示词指导智能体的行为和回应方式</p>
              </div>
            </el-form-item>

            <!-- MCP Server 设置 -->
            <el-form-item label="MCP Server 设置">
              <el-card class="w-full">
                <template #header>
                  <div class="flex items-center">
                    <el-checkbox v-model="agentForm.mcpSettings.enabled" class="mr-2"></el-checkbox>
                    <span>启用 MCP Server</span>
                  </div>
                </template>

                <div v-if="agentForm.mcpSettings.enabled">
                  <el-form-item label="服务器地址" prop="mcpSettings.serverUrl">
                    <el-input
                      v-model="agentForm.mcpSettings.serverUrl"
                      placeholder="请输入 MCP Server 地址，例如: http://localhost:3000"
                    />
                  </el-form-item>

                  <el-form-item label="API 密钥" prop="mcpSettings.apiKey">
                    <el-input
                      v-model="agentForm.mcpSettings.apiKey"
                      type="password"
                      placeholder="请输入 MCP Server API 密钥"
                    />
                  </el-form-item>

                  <el-form-item label="模型名称" prop="mcpSettings.modelName">
                    <el-input
                      v-model="agentForm.mcpSettings.modelName"
                      placeholder="请输入要使用的模型名称"
                    />
                  </el-form-item>

                  <el-form-item label="超时设置(秒)" prop="mcpSettings.timeout">
                    <el-input-number
                      v-model="agentForm.mcpSettings.timeout"
                      :min="1"
                      :max="300"
                      controls-position="right"
                    />
                  </el-form-item>

                  <el-form-item label="最大重试次数" prop="mcpSettings.maxRetries">
                    <el-slider
                      v-model="agentForm.mcpSettings.maxRetries"
                      :min="0"
                      :max="10"
                      show-input
                    />
                  </el-form-item>
                </div>
              </el-card>
            </el-form-item>

            <!-- 工作流编辑 -->
            <el-form-item label="工作流" prop="workflow">
              <div class="flex-1 border border-surface-high-light rounded-lg p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-bold">工作流编辑器</h3>
                  <div>
                    <el-button @click="addWorkflowStep" v-if="!isGraphView">添加步骤</el-button>
                    <el-button @click="switchToFormView" v-if="isGraphView">切换到表单视图</el-button>
                    <el-button @click="switchToGraphView" v-else>切换到图形视图</el-button>
                  </div>
                </div>

                <!-- 图形化视图 -->
                <div v-if="isGraphView" class="workflow-graph-container">
                  <!-- 图形视图操作按钮 -->
                  <div class="flex justify-between items-center mb-4">
                    <div>
                      <el-button @click="addGraphStep" type="primary" size="small">添加节点</el-button>
                      <el-button @click="deleteSelectedNode" type="danger" size="small" :disabled="!selectedNode">删除节点</el-button>
                    </div>
                    <div>
                      <el-button @click="resetGraphView" type="warning" size="small">重置视图</el-button>
                    </div>
                  </div>

                  <VueFlow
                    v-model:nodes="graphNodes"
                    v-model:edges="graphEdges"
                    :fit-view-on-init="true"
                    class="w-full h-96"
                    @node-click="handleNodeClick"
                  >
                    <template #node-custom="nodeProps">
                      <div class="workflow-node" :class="{ selected: nodeProps.selected }">
                        <div class="node-header">
                          <span class="node-title">{{ nodeProps.data.label }}</span>
                        </div>
                        <div class="node-content">
                          <div class="node-description">{{ nodeProps.data.description }}</div>
                        </div>
                      </div>
                    </template>
                  </VueFlow>
                </div>

                <!-- 表单视图 -->
                <div v-else>
                  <!-- 表单视图操作按钮 -->
                  <div class="flex justify-between items-center mb-4">
                    <el-button @click="addWorkflowStep" type="primary" size="small">添加步骤</el-button>
                    <el-button @click="clearWorkflow" type="warning" size="small">清空所有步骤</el-button>
                  </div>

                  <div
                    v-for="(step, index) in agentForm.workflow"
                    :key="step.id"
                    class="mb-4 p-4 border border-surface-high-light rounded-lg"
                  >
                    <div class="flex justify-between items-center mb-2">
                      <h4 class="font-medium">步骤 {{ index + 1 }}</h4>
                      <el-button
                        link
                        type="danger"
                        @click="removeWorkflowStep(index)"
                      >
                        删除
                      </el-button>
                    </div>

                    <el-form-item
                      :label="`步骤名称`"
                      :prop="`workflow.${index}.name`"
                      :rules="[{ required: true, message: '请输入步骤名称', trigger: 'blur' }]"
                    >
                      <el-input
                        v-model="step.name"
                        placeholder="请输入步骤名称"
                      />
                    </el-form-item>

                    <el-form-item
                      :label="`步骤描述`"
                      :prop="`workflow.${index}.description`"
                      :rules="[{ required: true, message: '请输入步骤描述', trigger: 'blur' }]"
                    >
                      <el-input
                        v-model="step.description"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入步骤描述"
                      />
                    </el-form-item>

                    <el-form-item
                      :label="`执行逻辑`"
                      :prop="`workflow.${index}.logic`"
                      :rules="[{ required: true, message: '请输入执行逻辑', trigger: 'blur' }]"
                    >
                      <el-input
                        v-model="step.logic"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入执行逻辑"
                      />
                    </el-form-item>
                  </div>

                  <div v-if="agentForm.workflow.length === 0" class="text-center py-8 text-on-surface-light">
                    <p>暂无工作流步骤，请点击"添加步骤"按钮添加</p>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTag,
  ElMessage,
  ElCheckbox,
  ElInputNumber,
  ElSlider
} from 'element-plus'
import { VueFlow, useVueFlow } from '@vue-flow/core'

// 定义节点和边的类型
interface NodeData {
  label: string
  description: string
  logic: string
}

interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: NodeData
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
  animated: boolean
  type: string
}

// MCP 设置接口
interface MCPSettings {
  enabled: boolean
  serverUrl: string
  apiKey: string
  modelName: string
  timeout: number
  maxRetries: number
}

const router = useRouter()
const formRef = ref()

// 使用VueFlow的composable
const { onNodeClick } = useVueFlow()

// 当前选中的节点
const selectedNode = ref<WorkflowNode | null>(null)

// 表单数据
const agentForm = reactive({
  title: '',
  description: '',
  tags: [] as string[],
  prompt: '',
  mcpSettings: {
    enabled: false,
    serverUrl: '',
    apiKey: '',
    modelName: '',
    timeout: 30,
    maxRetries: 3
  } as MCPSettings,
  workflow: [] as Array<{
    id: number
    name: string
    description: string
    logic: string
  }>
})

// 新标签输入
const newTag = ref('')

// 保存状态
const saving = ref(false)

// 视图切换
const isGraphView = ref(false)

// 图形化工作流数据
const graphNodes = ref<WorkflowNode[]>([])
const graphEdges = ref<WorkflowEdge[]>([])

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  prompt: [
    { required: true, message: '请输入提示词', trigger: 'blur' }
  ],
  'mcpSettings.serverUrl': [
    { required: true, message: '请输入服务器地址', trigger: 'blur' }
  ],
  'mcpSettings.apiKey': [
    { required: true, message: '请输入 API 密钥', trigger: 'blur' }
  ],
  'mcpSettings.modelName': [
    { required: true, message: '请输入模型名称', trigger: 'blur' }
  ]
}

// 处理节点点击事件
const handleNodeClick = ({ node }: { node: WorkflowNode }) => {
  selectedNode.value = node
}

// 注册节点点击事件
onNodeClick((e) => {
  handleNodeClick(e)
})

// 添加标签
const addTag = () => {
  if (newTag.value && !agentForm.tags.includes(newTag.value)) {
    agentForm.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 删除标签
const removeTag = (tag: string) => {
  const index = agentForm.tags.indexOf(tag)
  if (index > -1) {
    agentForm.tags.splice(index, 1)
  }
}

// 添加工作流步骤
const addWorkflowStep = () => {
  agentForm.workflow.push({
    id: Date.now(),
    name: `步骤 ${agentForm.workflow.length + 1}`,
    description: '',
    logic: ''
  })
}

// 删除工作流步骤
const removeWorkflowStep = (index: number) => {
  agentForm.workflow.splice(index, 1)
  // 如果在图形视图，需要同步更新图形
  if (isGraphView.value) {
    updateGraphFromWorkflow()
  }
}

// 清空所有工作流步骤
const clearWorkflow = () => {
  agentForm.workflow = []
  // 如果在图形视图，需要同步更新图形
  if (isGraphView.value) {
    graphNodes.value = []
    graphEdges.value = []
  }
}

// 添加图形节点
const addGraphStep = () => {
  const newNodeId = `${Date.now()}`
  const newNode: WorkflowNode = {
    id: newNodeId,
    type: 'custom',
    position: { x: Math.random() * 300, y: Math.random() * 300 },
    data: {
      label: `步骤 ${graphNodes.value.length + 1}`,
      description: '请添加描述',
      logic: '请添加执行逻辑'
    }
  }

  graphNodes.value.push(newNode)

  // 同步到表单数据
  agentForm.workflow.push({
    id: parseInt(newNodeId),
    name: `步骤 ${graphNodes.value.length}`,
    description: '请添加描述',
    logic: '请添加执行逻辑'
  })
}

// 删除选中的节点
const deleteSelectedNode = () => {
  if (!selectedNode.value) {
    ElMessage.warning('请先选择要删除的节点')
    return
  }

  const nodeId = selectedNode.value.id
  const nodeIndex = graphNodes.value.findIndex(node => node.id === nodeId)

  if (nodeIndex !== -1) {
    // 删除节点
    graphNodes.value.splice(nodeIndex, 1)

    // 删除相关的边
    graphEdges.value = graphEdges.value.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    )

    // 同步到表单数据
    const workflowIndex = agentForm.workflow.findIndex(step => step.id === parseInt(nodeId))
    if (workflowIndex !== -1) {
      agentForm.workflow.splice(workflowIndex, 1)
    }

    selectedNode.value = null
    ElMessage.success('节点删除成功')
  }
}

// 重置图形视图
const resetGraphView = () => {
  graphNodes.value = []
  graphEdges.value = []
  selectedNode.value = null
  updateGraphFromWorkflow()
}

// 切换到图形视图
const switchToGraphView = () => {
  isGraphView.value = true
  // 将表单数据转换为图形节点
  updateGraphFromWorkflow()
}

// 切换到表单视图
const switchToFormView = () => {
  isGraphView.value = false
  // 将图形数据转换为表单数据
  updateWorkflowFromGraph()
}

// 从工作流数据更新图形
const updateGraphFromWorkflow = () => {
  const nodes = agentForm.workflow.map((step, index) => ({
    id: `${step.id}`,
    type: 'custom',
    position: { x: index * 200, y: 100 },
    data: {
      label: step.name || `步骤 ${index + 1}`,
      description: step.description,
      logic: step.logic
    }
  }))

  graphNodes.value = nodes as WorkflowNode[]

  // 添加连接线
  const edges = []
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true,
      type: 'default'
    })
  }

  graphEdges.value = edges as WorkflowEdge[]
}

// 从图形数据更新工作流
const updateWorkflowFromGraph = () => {
  const workflow = graphNodes.value.map((node) => ({
    id: parseInt(node.id),
    name: node.data.label,
    description: node.data.description,
    logic: node.data.logic
  }))

  agentForm.workflow = workflow
}

// 保存智能体
const saveAgent = async () => {
  try {
    // 如果在图形视图，先更新工作流数据
    if (isGraphView.value) {
      updateWorkflowFromGraph()
    }

    await formRef.value.validate()

    saving.value = true

    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('智能体创建成功')
    router.push('/agents')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请检查表单内容')
  } finally {
    saving.value = false
  }
}

// 取消创建
const cancel = () => {
  router.push('/agents')
}

// 初始化图形数据
onMounted(() => {
  // 初始化一些示例节点
  const initialNodes: WorkflowNode[] = [
    {
      id: '1',
      type: 'custom',
      position: { x: 0, y: 100 },
      data: {
        label: '开始',
        description: '流程开始节点',
        logic: '初始化流程'
      }
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 200, y: 100 },
      data: {
        label: '处理',
        description: '数据处理节点',
        logic: '处理输入数据'
      }
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 400, y: 100 },
      data: {
        label: '结束',
        description: '流程结束节点',
        logic: '返回结果'
      }
    }
  ]

  const initialEdges: WorkflowEdge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      type: 'default'
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animated: true,
      type: 'default'
    }
  ]

  graphNodes.value = initialNodes
  graphEdges.value = initialEdges
})
</script>

<style scoped>
.workflow-graph-container {
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.workflow-node {
  width: 180px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px;
}

.workflow-node.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.node-header {
  margin-bottom: 8px;
}

.node-title {
  font-weight: bold;
  font-size: 14px;
}

.node-content {
  font-size: 12px;
  color: #666;
}

.node-description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
