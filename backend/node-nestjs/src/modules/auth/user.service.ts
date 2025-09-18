import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../database/entities/user.entity'
import { CreateUserDto } from './dto/user.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, phone } = createUserDto
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
    })

    return this.userRepository.save(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } })
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  async updatePoints(userId: number, points: number): Promise<User> {
    const user = await this.findById(userId)
    if (user) {
      user.points += points
      return this.userRepository.save(user)
    }
    throw new Error('User not found')
  }
}
