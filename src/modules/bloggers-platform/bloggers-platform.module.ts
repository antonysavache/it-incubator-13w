import { Module } from '@nestjs/common';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog.use-case';
import { GetAllBlogUseCase } from './blogs/application/use-cases/get-all-blogs.use-case';
import { GetBlogByIdUseCase } from './blogs/application/use-cases/get-blog.use-case';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog.use-case';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogPostsController } from './blogs/api/blog-posts.controller';
import { PostsModule } from './posts/posts.module';
import { BlogsRepositoryModule } from './blogs-repository.module';

const useCases = [
  CreateBlogUseCase,
  GetAllBlogUseCase,
  GetBlogByIdUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase
];

@Module({
  imports: [
    BlogsRepositoryModule,
    PostsModule
  ],
  controllers: [BlogsController, BlogPostsController],
  providers: [
    ...useCases
  ],
  exports: [
    ...useCases
  ]
})
export class BlogsModule {}
