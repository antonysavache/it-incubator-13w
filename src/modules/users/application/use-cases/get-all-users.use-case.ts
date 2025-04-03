import { Injectable } from '@nestjs/common';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../core/infrastructure/result';
import { UserView } from '../../domain/models/user-view.interface';
import { UsersQueryRepository } from '../../infrastructure/repositories/users-query.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(params: BaseQueryParams): Promise<ToResult<PaginatedResult<UserView>>> {
    return await this.usersQueryRepository.findAll(params);
  }
}
