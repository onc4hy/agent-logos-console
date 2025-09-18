import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Comment } from './comment.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'simple-array', nullable: true })
  images: string[]

  @Column({ default: 0 })
  likes: number

  @Column({ default: 0 })
  commentsCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.posts)
  author: User

  @Column()
  authorId: number

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]
}
