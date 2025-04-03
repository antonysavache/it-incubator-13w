import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../core/infrastructure/result';
import { UserView } from '../../domain/models/user-view.interface';
import { UsersQueryRepository } from '../../infrastructure/repositories/users-query.repository';
import { QueryParamsDto } from '../../../../core/dto/query-params.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(params: QueryParamsDto): Promise<ToResult<PaginatedResult<UserView>>> {
    return await this.usersQueryRepository.findAll(params);
  }
}
