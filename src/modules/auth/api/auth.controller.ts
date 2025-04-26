import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../domain/dto/login.dto';
import { RegistrationDto } from '../domain/dto/registration.dto';
import { RegistrationConfirmationDto } from '../domain/dto/registration-confirmation.dto';
import { RegistrationEmailResendingDto } from '../domain/dto/registration-email-resending.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    await this.authService.register(registrationDto);
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() confirmationDto: RegistrationConfirmationDto) {
    await this.authService.confirmRegistration(confirmationDto.code);
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() resendingDto: RegistrationEmailResendingDto) {
    await this.authService.resendRegistrationEmail(resendingDto.email);
    return;
  }
}
