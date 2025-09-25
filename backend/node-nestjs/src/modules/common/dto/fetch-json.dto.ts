import { IsNotEmpty, IsUrl } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FetchJsonDto {
  @ApiProperty({
    description: '远程JSON数据的URL地址',
    example: 'https://jsonplaceholder.typicode.com/posts/1',
  })
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  url: string
}
