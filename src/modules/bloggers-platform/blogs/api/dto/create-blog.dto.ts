import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
