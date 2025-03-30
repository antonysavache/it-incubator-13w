import { Injectable } from '@nestjs/common';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { ToResult } from '../../../../../core/infrastructure/result';
import { CreateBlogDomainDto } from '../../domain/dto/create-blog.domain.dto';

@Injectable()
export class UpdateBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute(id: string, dto: CreateBlogDomainDto): Promise<ToResult<boolean>> {
    try {
      const blog = await this.blogsQueryRepository.findById(id);

      if (!blog) {
        return ToResult.fail(`Блог с ID ${id} не найден`);
      }

      const isUpdated = await this.blogsCommandRepository.update(id, {
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl
      });

      if (!isUpdated) {
        return ToResult.fail('Произошла ошибка при обновлении блога');
      }

      return ToResult.ok(true);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}