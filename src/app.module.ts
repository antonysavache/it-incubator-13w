import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { CoreModule } from './core/core.module';
import { BlogsModule } from './modules/bloggers-platform/bloggers-platform.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/bloggers-platform/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@lessons.x4ym2.mongodb.net/?retryWrites=true&w=majority&appName=lessons',
    ),
    TestingModule,
    CoreModule,
    BlogsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
