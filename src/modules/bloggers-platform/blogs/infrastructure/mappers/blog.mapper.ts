import { Injectable } from '@nestjs/common';
import { Blog } from '../../domain/blog.domain';
import { BlogDocument } from '../schemas/blog.schema';
import { BlogView } from '../../domain/models/blog-view.interface';

@Injectable()
export class BlogMapper {
  // Map from domain to persistence
  toPersistence(blog: Blog): any {
    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt
    };
  }

  // Map from persistence to domain
  toDomain(blogDocument: BlogDocument): Blog {
    return Blog.create(
      {
        name: blogDocument.name,
        description: blogDocument.description,
        websiteUrl: blogDocument.websiteUrl,
        createdAt: blogDocument.createdAt
      },
      blogDocument._id?.toString()
    );
  }

  // Map from domain to view model
  toView(blog: Blog): BlogView {
    if (!blog.id) {
      throw new Error('Blog ID is required for view model');
    }

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl
    };
  }

  // Map from persistence directly to view model
  documentToView(blogDocument: BlogDocument): BlogView {
    return {
      id: blogDocument._id?.toString() || '',
      name: blogDocument.name,
      description: blogDocument.description,
      websiteUrl: blogDocument.websiteUrl
    };
  }
}
