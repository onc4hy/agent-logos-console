// post.dto.ts
export class CreatePostDto {
  title: string
  content: string
  images?: string[]
}

export class UpdatePostDto {
  title?: string
  content?: string
  images?: string[]
}

export class CreateCommentDto {
  content: string
  postId?: number
  agentId?: number
}
