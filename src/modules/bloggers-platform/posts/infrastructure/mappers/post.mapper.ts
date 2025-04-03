import { Injectable } from '@nestjs/common';
import { Post } from '../../domain/post.domain';
import { PostDocument } from '../schemas/post.schema';
import { PostView } from '../../domain/models/post-view.interface';

@Injectable()
export class PostMapper {
  // Map from domain to persistence
  toPersistence(post: Post): any {
    return {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    };
  }

  // Map from persistence to domain
  toDomain(postDocument: PostDocument): Post {
    return Post.create(
      {
        title: postDocument.title,
        shortDescription: postDocument.shortDescription,
        content: postDocument.content,
        blogId: postDocument.blogId,
        blogName: postDocument.blogName,
        createdAt: postDocument.createdAt
      },
      postDocument._id?.toString()
    );
  }

  // Map from domain to view model
  toView(post: Post): PostView {
    if (!post.id) {
      throw new Error('Post ID is required for view model');
    }

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString()
    };
  }

  // Map from persistence directly to view model
  documentToView(postDocument: PostDocument): PostView {
    return {
      id: postDocument._id?.toString() || '',
      title: postDocument.title,
      shortDescription: postDocument.shortDescription,
      content: postDocument.content,
      blogId: postDocument.blogId,
      blogName: postDocument.blogName,
      createdAt: postDocument.createdAt.toISOString()
    };
  }
}
