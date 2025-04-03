import { Injectable } from '@nestjs/common';
import { Blog } from '../../domain/blog.domain';
import { BlogDocument } from '../schemas/blog.schema';
import { ViewBlogModel } from '../../models/blog.models';

@Injectable()
export class BlogMapper {
  toPersistence(blog: Blog): any {
    return {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership
    };
  }

  toDomain(blogDocument: BlogDocument): Blog {
    return Blog.create(
      {
        name: blogDocument.name,
        description: blogDocument.description,
        websiteUrl: blogDocument.websiteUrl,
        createdAt: blogDocument.createdAt,
        isMembership: blogDocument.isMembership
      },
      blogDocument._id?.toString()
    );
  }

  toView(blog: Blog): ViewBlogModel {
    if (!blog.id) {
      throw new Error('Blog ID is required for view model');
    }

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership
    };
  }

  documentToView(blogDocument: BlogDocument): ViewBlogModel {
    return {
      id: blogDocument._id?.toString() || '',
      name: blogDocument.name,
      description: blogDocument.description,
      websiteUrl: blogDocument.websiteUrl,
      createdAt: blogDocument.createdAt.toISOString(),
      isMembership: blogDocument.isMembership
    };
  }
}
