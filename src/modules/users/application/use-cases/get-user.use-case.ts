import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../core/infrastructure/result';
import { UserView } from '../../domain/models/user-view.interface';
import { UsersQueryRepository } from '../../infrastructure/repositories/users-query.repository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(id: string): Promise<ToResult<UserView>> {
    return await this.usersQueryRepository.getUserById(id);
  }
}
