import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../domain/user.domain';
import { CreateUserDto } from '../domain/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { login, email, password, confirmationCode, emailConfirmed } = createUserDto;
    
    // Проверка на существование пользователя с таким логином или email
    const existingUserByLogin = await this.findByLoginOrEmail(login);
    const existingUserByEmail = await this.findByLoginOrEmail(email);
    
    if (existingUserByLogin) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'Login already exists', field: 'login' }]
      });
    }
    
    if (existingUserByEmail) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'Email already exists', field: 'email' }]
      });
    }
    
    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Создание пользователя
    const user = User.create({
      login,
      email,
      passwordHash,
      confirmationCode,
      emailConfirmed
    });
    
    return this.usersRepository.save(user);
  }
  
  async findById(id: string) {
    return this.usersRepository.findById(id);
  }
  
  async findByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepository.findByLoginOrEmail(loginOrEmail);
  }

  async findByConfirmationCode(code: string) {
    return this.usersRepository.findByConfirmationCode(code);
  }
  
  async confirmEmail(userId: string) {
    return this.usersRepository.confirmEmail(userId);
  }
  
  async updateConfirmationCode(userId: string, confirmationCode: string) {
    return this.usersRepository.updateConfirmationCode(userId, confirmationCode);
  }
  
  async findAll(pageNumber: number, pageSize: number) {
    return this.usersRepository.findAll(pageNumber, pageSize);
  }
  
  async remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
