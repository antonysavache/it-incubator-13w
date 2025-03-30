import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog.use-case';
import { GetAllBlogUseCase } from './blogs/application/use-cases/get-all-blogs.use-case';
import { GetBlogByIdUseCase } from './blogs/application/use-cases/get-blog.use-case';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog.use-case';
import { BlogsCommandRepository } from './blogs/infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/repositories/blogs-query.repository';
import { BlogEntity, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsController } from './blogs/api/blogs.controller';

const useCases = [
  CreateBlogUseCase,
  GetAllBlogUseCase,
  GetBlogByIdUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase
];

const repositories = [
  BlogsCommandRepository,
  BlogsQueryRepository
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogEntity.name, schema: BlogSchema }
    ])
  ],
  controllers: [BlogsController],
  providers: [
    ...repositories,
    ...useCases
  ],
  exports: [
    ...repositories,
    ...useCases
  ]
})
export class BlogsModule {}