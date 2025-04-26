import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import { LoginDto } from '../domain/dto/login.dto';
import { RegistrationDto } from '../domain/dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../core/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { loginOrEmail, password } = loginDto;
    const user = await this.usersService.findByLoginOrEmail(loginOrEmail);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailConfirmed) {
      throw new BadRequestException('Email is not confirmed');
    }

    const token = this.jwtService.sign({ userId: user.id, login: user.login });
    
    return {
      accessToken: token
    };
  }

  async register(registrationDto: RegistrationDto) {
    const { login, email, password } = registrationDto;
    
    // Проверка на существование пользователя с таким логином или email
    const existingUser = await this.usersService.findByLoginOrEmail(login) || 
                         await this.usersService.findByLoginOrEmail(email);
    
    if (existingUser) {
      if (existingUser.login === login) {
        throw new BadRequestException({ 
          errorsMessages: [{ message: 'Login already exists', field: 'login' }] 
        });
      }
      if (existingUser.email === email) {
        throw new BadRequestException({ 
          errorsMessages: [{ message: 'Email already exists', field: 'email' }] 
        });
      }
    }
    
    // Создание кода подтверждения
    const confirmationCode = randomUUID();
    
    // Создание пользователя
    await this.usersService.create({
      login,
      email,
      password,
      confirmationCode,
      emailConfirmed: false
    });
    
    // Отправка письма с кодом подтверждения
    await this.emailService.sendRegistrationEmail(email, confirmationCode);
    
    return;
  }

  async confirmRegistration(code: string) {
    const user = await this.usersService.findByConfirmationCode(code);
    
    if (!user) {
      throw new BadRequestException({ 
        errorsMessages: [{ message: 'Invalid confirmation code', field: 'code' }] 
      });
    }

    if (user.emailConfirmed) {
      throw new BadRequestException({ 
        errorsMessages: [{ message: 'Email already confirmed', field: 'code' }] 
      });
    }

    if (user.id) {
      await this.usersService.confirmEmail(user.id);
    }
    
    return;
  }

  async resendRegistrationEmail(email: string) {
    const user = await this.usersService.findByLoginOrEmail(email);
    
    if (!user) {
      throw new BadRequestException({ 
        errorsMessages: [{ message: 'User with this email does not exist', field: 'email' }] 
      });
    }

    if (user.emailConfirmed) {
      throw new BadRequestException({ 
        errorsMessages: [{ message: 'Email already confirmed', field: 'email' }] 
      });
    }

    // Создание нового кода подтверждения
    const confirmationCode = randomUUID();
    
    // Обновление кода подтверждения
    if (user.id) {
      await this.usersService.updateConfirmationCode(user.id, confirmationCode);
    }
    
    // Отправка письма с новым кодом подтверждения
    await this.emailService.sendRegistrationEmail(email, confirmationCode);
    
    return;
  }
}