import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { GetAllPostsUseCase } from './application/use-cases/get-all-posts.use-case';
import { GetPostByIdUseCase } from './application/use-cases/get-post.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetBlogPostsUseCase } from './application/use-cases/get-blog-posts.use-case';
import { PostsCommandRepository } from './infrastructure/repositories/posts-command.repository';
import { PostsQueryRepository } from './infrastructure/repositories/posts-query.repository';
import { PostDocument, PostSchema } from './infrastructure/schemas/post.schema';
import { PostsController } from './api/posts.controller';
import { PostMapper } from './infrastructure/mappers/post.mapper';
import { BlogsRepositoryModule } from '../blogs-repository.module';
import { CoreModule } from '../../../core/core.module';

const useCases = [
  CreatePostUseCase,
  GetAllPostsUseCase,
  GetPostByIdUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  GetBlogPostsUseCase
];

const repositories = [
  PostsCommandRepository,
  PostsQueryRepository
];

const mappers = [
  PostMapper
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PostDocument', schema: PostSchema }
    ]),
    BlogsRepositoryModule,
    CoreModule
  ],
  controllers: [PostsController],
  providers: [
    ...mappers,
    ...repositories,
    ...useCases
  ],
  exports: [
    ...repositories,
    ...useCases
  ]
})
export class PostsModule {}