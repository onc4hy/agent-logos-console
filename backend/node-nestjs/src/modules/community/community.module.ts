import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from '../../database/entities/post.entity'
import { Comment } from '../../database/entities/comment.entity'
import { PostService } from './post.service'
import { CommunityController } from './community.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
  providers: [PostService],
  controllers: [CommunityController],
})
export class CommunityModule {}
