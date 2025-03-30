import { Injectable } from '@nestjs/common';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { ToResult } from '../../../../../core/infrastructure/result';

@Injectable()
export class DeleteBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute(id: string): Promise<ToResult<boolean>> {
    try {
      const blog = await this.blogsQueryRepository.findById(id);

      if (!blog) {
        return ToResult.fail(`Блог с ID ${id} не найден`);
      }

      const isDeleted = await this.blogsCommandRepository.delete(id);

      if (!isDeleted) {
        return ToResult.fail('Произошла ошибка при удалении блога');
      }

      return ToResult.ok(true);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}