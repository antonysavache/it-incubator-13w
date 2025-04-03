import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '../application/use-cases/get-all-users.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { UserView } from '../domain/models/user-view.interface';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { GetUserByIdUseCase } from '../application/use-cases/get-user.use-case';
import { BaseQueryParams } from '../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../core/infrastructure/pagination';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  async getAll(@Query() query: BaseQueryParams): Promise<PaginatedResult<UserView>> {
    const result = await this.getAllUsersUseCase.execute(query);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserView> {
    const domainDto: CreateUserDomainDto = {
      login: createUserDto.login,
      email: createUserDto.email,
      password: createUserDto.password,
    };

    const result = await this.createUserUseCase.execute(domainDto);

    if (result.isFailure()) {
      throw new BadRequestException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserView> {
    const result = await this.getUserByIdUseCase.execute(id);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const result = await this.deleteUserUseCase.execute(id);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }
  }
}
