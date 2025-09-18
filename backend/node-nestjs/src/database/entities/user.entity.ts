import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Agent } from './agent.entity'
import { Post } from './post.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  phone: string

  @Column()
  name: string

  @Column({ default: 0 })
  points: number

  @Column({ default: false })
  isVerified: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Agent, (agent) => agent.user)
  agents: Agent[]

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]
}
