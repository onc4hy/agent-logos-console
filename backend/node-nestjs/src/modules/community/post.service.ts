import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../../database/entities/post.entity'
import { Comment } from '../../database/entities/comment.entity'
import { CreatePostDto, UpdatePostDto, CreateCommentDto } from './dto/post.dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId: userId,
    })
    return this.postRepository.save(post)
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<[Post[], number]> {
    return this.postRepository.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async findOne(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    })
  }

  async findByUser(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { authorId: userId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    })
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto)
    const post = await this.findOne(id)
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id)
  }

  async addComment(
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      authorId: userId,
    })
    const savedComment = await this.commentRepository.save(comment)

    // 更新帖子的评论计数
    if (createCommentDto.postId) {
      await this.postRepository.increment(
        { id: createCommentDto.postId },
        'commentsCount',
        1,
      )
    }

    return savedComment
  }

  async likePost(postId: number): Promise<void> {
    await this.postRepository.increment({ id: postId }, 'likes', 1)
  }

  async likeComment(commentId: number): Promise<void> {
    await this.commentRepository.increment({ id: commentId }, 'likes', 1)
  }
}
