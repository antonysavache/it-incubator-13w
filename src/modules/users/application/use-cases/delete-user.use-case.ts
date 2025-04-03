import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../core/infrastructure/result';
import { UsersCommandRepository } from '../../infrastructure/repositories/users-command.repository';
import { UsersQueryRepository } from '../../infrastructure/repositories/users-query.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private usersCommandRepository: UsersCommandRepository,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  async execute(id: string): Promise<ToResult<void>> {
    try {
      // First, check if user exists
      const userResult = await this.usersQueryRepository.getUserById(id);
      
      if (userResult.isFailure()) {
        return ToResult.fail(userResult.error || `User with id ${id} not found`);
      }
      
      // Delete from repository
      const isDeleted = await this.usersCommandRepository.delete(id);
      
      if (!isDeleted) {
        return ToResult.fail(`Failed to delete user with id ${id}`);
      }
      
      return ToResult.ok(undefined);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
