import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { BlogsModule } from '../src/modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from '../src/modules/testing/testing.module';
import { CoreModule } from '../src/core/core.module';
import { PostsModule } from '../src/modules/bloggers-platform/posts/posts.module';
import { UsersModule } from '../src/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@lessons.x4ym2.mongodb.net/bloggers-test-db?retryWrites=true&w=majority&appName=lessons',
    ),
    TestingModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule {}
