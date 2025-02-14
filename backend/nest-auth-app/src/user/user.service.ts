import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(user: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const userDTO = new CreateUserDto();
    userDTO.email = user.email;
    userDTO.password = bcrypt.hashSync(user.password, 10);

    const errors = await validate(userDTO);
    if (errors.length > 0) {
      throw new Error('Validation failed');
    }

    return await this.usersRepository.save(userDTO);
  }
}
