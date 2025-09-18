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
export class Agent {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column({ type: 'text', nullable: true })
  personality: string

  @Column({ type: 'text', nullable: true })
  knowledge: string

  @Column({ default: false })
  isPublic: boolean

  @Column({ default: 0 })
  likes: number

  @Column({ default: 0 })
  usageCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.agents)
  user: User

  @Column()
  userId: number

  @OneToMany(() => Comment, (comment) => comment.agent)
  comments: Comment[]
}
