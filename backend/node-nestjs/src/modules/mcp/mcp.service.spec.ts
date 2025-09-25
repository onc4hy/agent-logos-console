import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from './mcp.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('McpService', () => {
  let service: McpService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        McpService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<McpService>(McpService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chatWithModel', () => {
    it('should call ChatGLM API with correct parameters', async () => {
      // Mock the API response
      const mockResponse = {
        data: 'mock stream data',
      };
      
      (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

      // Set up environment variables
      process.env.CHATGLM_API_KEY = 'test-api-key';

      // Call the method
      const chatRequest = {
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'glm-4',
        temperature: 0.8,
        top_p: 0.8,
      };
      
      const result = await service.chatWithModel(chatRequest);

      // Assertions
      expect(result).toEqual('mock stream data');
      expect(httpService.post).toHaveBeenCalledWith(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        {
          model: 'glm-4',
          messages: [{ role: 'user', content: 'Hello' }],
          temperature: 0.8,
          top_p: 0.8,
          stream: true,
        },
        {
          headers: {
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
        },
      );
    });
  });
});