import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UsersCommandRepository } from './infrastructure/repositories/users-command.repository';
import { UsersQueryRepository } from './infrastructure/repositories/users-query.repository';
import { UserDocument, UserSchema } from './infrastructure/schemas/user.schema';
import { UsersController } from './api/users.controller';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { CoreModule } from '../../core/core.module';

const useCases = [
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  DeleteUserUseCase
];

const repositories = [
  UsersCommandRepository,
  UsersQueryRepository,
  UsersRepository
];

const mappers = [
  UserMapper
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema }
    ]),
    CoreModule
  ],
  controllers: [UsersController],
  providers: [
    ...mappers,
    ...repositories,
    ...useCases,
    UsersService
  ],
  exports: [
    ...repositories,
    ...useCases,
    UsersService
  ]
})
export class UsersModule {}