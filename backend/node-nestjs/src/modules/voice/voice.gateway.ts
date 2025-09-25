import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, WebSocket } from 'ws'
import { AgentService } from '../agents/agent.service'

@WebSocketGateway({
  path: '/voice-chat',
  cors: {
    origin: '*',
  },
})
export class VoiceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private agentService: AgentService) {}

  handleConnection(client: WebSocket) {
    console.log('Client connected:', client)
    // 可以在这里进行身份验证
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client)
  }

  @SubscribeMessage('start-recording')
  handleStartRecording(client: WebSocket, payload: any): void {
    console.log('Start recording:', payload)
    // 这里应该处理开始录音的逻辑
    // 可以集成阿里实时语音识别服务

    // 模拟处理结果
    setTimeout(() => {
      // 使用类型检查确保client是有效的WebSocket实例且处于OPEN状态
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: 'transcription',
            data: {
              text: '这是语音识别的结果',
              timestamp: new Date(),
            },
          }),
        )
      }
    }, 2000)
  }

  @SubscribeMessage('stop-recording')
  handleStopRecording(client: WebSocket, payload: any): void {
    console.log('Stop recording:', payload)
    // 处理停止录音的逻辑
  }

  @SubscribeMessage('text-to-speech')
  handleTextToSpeech(client: WebSocket, payload: any): void {
    console.log('Text to speech:', payload)
    // 这里应该处理文本转语音的逻辑
    // 可以集成阿里语音合成服务

    // 模拟处理结果
    setTimeout(() => {
      // 使用类型检查确保client是有效的WebSocket实例且处于OPEN状态
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: 'speech-ready',
            data: {
              audioUrl: 'https://example.com/audio.mp3',
              timestamp: new Date(),
            },
          }),
        )
      }
    }, 1500)
  }
}
