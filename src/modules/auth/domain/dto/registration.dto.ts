import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  login: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
