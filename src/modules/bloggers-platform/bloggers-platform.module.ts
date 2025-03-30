import { Module } from '@nestjs/common';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsCommandRepository } from './blogs/infrastructure/repositories/blogs-command.repository';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog.use-case';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog.use-case';
import { GetAllBlogUseCase } from './blogs/application/use-cases/get-all-blogs.use-case';
import { GetBlogByIdUseCase } from './blogs/application/use-cases/get-blog.use-case';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog.use-case';

const useCases = [CreateBlogUseCase, DeleteBlogUseCase, GetAllBlogUseCase, GetBlogByIdUseCase, UpdateBlogUseCase];
const repositories = [BlogsCommandRepository];

@Module({
  imports: [UserAccountsModule],
  providers: [...repositories, ...useCases],
})
export class BloggersPlatformModule {}
