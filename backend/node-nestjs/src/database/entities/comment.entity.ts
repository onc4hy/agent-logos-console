import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'
import { Agent } from './agent.entity'
import { Post } from './post.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @Column({ default: 0 })
  likes: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.posts)
  author: User

  @Column()
  authorId: number

  @ManyToOne(() => Agent, (agent) => agent.comments, { nullable: true })
  agent: Agent

  @Column({ nullable: true })
  agentId: number

  @ManyToOne(() => Post, (post) => post.comments, { nullable: true })
  post: Post

  @Column({ nullable: true })
  postId: number
}
