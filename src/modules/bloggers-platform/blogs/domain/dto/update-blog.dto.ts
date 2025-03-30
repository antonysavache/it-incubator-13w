import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty({ description: 'Blog name', maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name: string;

  @ApiProperty({ description: 'Blog description', maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Blog website URL (HTTPS only)',
    maxLength: 100,
    example: 'https://example.com'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
    message: 'websiteUrl must be a valid HTTPS URL',
  })
  websiteUrl: string;
}