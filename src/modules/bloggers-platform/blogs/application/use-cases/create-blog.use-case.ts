import { CreateBlogDomainDto } from '../../domain/dto/create-blog.domain.dto';
import { BlogEntity, BlogModelType } from '../../domain/blog.entity';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';

@Injectable()
export class CreateBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    @InjectModel(BlogEntity.name) private blogModel: BlogModelType,
  ) {}

  async execute(dto: CreateBlogDomainDto): Promise<ToResult<BlogView>> {
    try {
      const blogData = BlogEntity.createBlog(dto);
      const blog = new this.blogModel(blogData);
      const savedBlog = await this.blogsCommandRepository.save(blog);

      const blogView: BlogView = {
        id: savedBlog._id.toString(),
        name: savedBlog.name,
        description: savedBlog.description,
        websiteUrl: savedBlog.websiteUrl,
        createdAt: new Date(savedBlog.createdAt),
        isMembership: savedBlog.isMembership,
      };

      return ToResult.ok(blogView);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}