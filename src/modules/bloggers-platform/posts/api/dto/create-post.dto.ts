import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsString()
  @IsOptional()
  blogId?: string; // Optional in DTO because it may come from URL param
}
