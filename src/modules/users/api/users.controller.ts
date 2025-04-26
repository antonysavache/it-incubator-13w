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
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '../application/use-cases/get-all-users.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { UserView } from '../domain/models/user-view.interface';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { GetUserByIdUseCase } from '../application/use-cases/get-user.use-case';
import { PaginatedResult } from '../../../core/infrastructure/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryParamsDto } from '../../../core/dto/query-params.dto';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private usersService: UsersService,
  ) {}

  @Get()
  async getAll(@Query() query: QueryParamsDto): Promise<PaginatedResult<UserView>> {
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
  async createUser(
    @Headers('authorization') authHeader: string,
    @Body() createUserDto: CreateUserDto
  ): Promise<UserView> {
    // Проверка Basic Auth
    if (!authHeader || !this.validateBasicAuth(authHeader)) {
      throw new UnauthorizedException();
    }

    // Проверка валидации
    this.validateCreateUserDto(createUserDto);

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
  async deleteUser(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string
  ): Promise<void> {
    // Проверка Basic Auth
    if (!authHeader || !this.validateBasicAuth(authHeader)) {
      throw new UnauthorizedException();
    }

    const result = await this.deleteUserUseCase.execute(id);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }
  }

  private validateBasicAuth(authHeader: string): boolean {
    try {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      return username === 'admin' && password === 'qwerty';
    } catch (error) {
      return false;
    }
  }

  private validateCreateUserDto(createUserDto: CreateUserDto): void {
    const errors: Array<{ message: string; field: string }> = [];

    if (createUserDto.login && (createUserDto.login.length < 3 || createUserDto.login.length > 10)) {
      errors.push({ message: 'login must be between 3 and 10 characters', field: 'login' });
    }

    if (createUserDto.password && (createUserDto.password.length < 6 || createUserDto.password.length > 20)) {
      errors.push({ message: 'password must be between 6 and 20 characters', field: 'password' });
    }

    if (errors.length > 0) {
      throw new BadRequestException({ errorsMessages: errors });
    }
  }
}