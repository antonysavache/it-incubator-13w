import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { CoreModule } from './core/core.module';
import { BlogsModule } from './modules/bloggers-platform/bloggers-platform.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/bloggers-platform/posts/posts.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@lessons.x4ym2.mongodb.net/?retryWrites=true&w=majority&appName=lessons',
    ),
    TestingModule,
    CoreModule,
    BlogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        // Возвращает ValidationError объекты вместо сообщений
        exceptionFactory: (errors) => new BadRequestException(
          errors.map(error => Object.values(error.constraints || {}).join(', ')),
        ),
      }),
    },
  ],
})
export class AppModule {}