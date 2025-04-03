import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDomainDto } from '../../domain/dto/create-user.domain.dto';
import { UserView } from '../../domain/models/user-view.interface';
import { UsersCommandRepository } from '../../infrastructure/repositories/users-command.repository';
import { ToResult } from '../../../../core/infrastructure/result';
import { User } from '../../domain/user.domain';
import { UserMapper } from '../../infrastructure/mappers/user.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersCommandRepository: UsersCommandRepository,
    private userMapper: UserMapper
  ) {}

  async execute(dto: CreateUserDomainDto): Promise<ToResult<UserView>> {
    try {
      // Check if user with this login already exists
      const existingLoginUser = await this.usersCommandRepository.findByLogin(dto.login);
      if (existingLoginUser) {
        return ToResult.fail(`User with login ${dto.login} already exists`);
      }
      
      // Check if user with this email already exists
      const existingEmailUser = await this.usersCommandRepository.findByEmail(dto.email);
      if (existingEmailUser) {
        return ToResult.fail(`User with email ${dto.email} already exists`);
      }
      
      // Hash the password
      const passwordHash = await bcrypt.hash(dto.password, 10);
      
      // Create a domain entity
      const user = User.create({
        login: dto.login,
        email: dto.email,
        passwordHash: passwordHash
      });
      
      // Save to repository
      const savedUserDocument = await this.usersCommandRepository.save(user);
      
      // Map to domain then to view
      const savedUser = this.userMapper.toDomain(savedUserDocument);
      const userView = this.userMapper.toView(savedUser);

      return ToResult.ok(userView);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
