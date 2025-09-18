import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { WsAdapter } from '@nestjs/platform-ws'
import { startAutoSave, stopAutoSave } from './database/data-source'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 配置WebSocket适配器
  app.useWebSocketAdapter(new WsAdapter(app))

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('智能体调音台 API')
    .setDescription('智能体调音台后台API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // 启用CORS
  app.enableCors()

  // 启动自动保存功能
  startAutoSave()

  // 监听进程退出事件，确保正确关闭自动保存
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...')
    stopAutoSave()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...')
    stopAutoSave()
    process.exit(0)
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
