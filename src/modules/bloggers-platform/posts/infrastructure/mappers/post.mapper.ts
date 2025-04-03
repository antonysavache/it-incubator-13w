import { Injectable } from '@nestjs/common';
import { Post } from '../../domain/post.domain';
import { PostDocument } from '../schemas/post.schema';
import { ViewPostModel } from '../../models/post.models';

@Injectable()
export class PostMapper {
  toPersistence(post: Post): any {
    return {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    };
  }

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

  toView(post: Post): ViewPostModel {
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
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    };
  }

  documentToView(postDocument: PostDocument): ViewPostModel {
    return {
      id: postDocument._id?.toString() || '',
      title: postDocument.title,
      shortDescription: postDocument.shortDescription,
      content: postDocument.content,
      blogId: postDocument.blogId,
      blogName: postDocument.blogName,
      createdAt: postDocument.createdAt.toISOString(),
      extendedLikesInfo: postDocument.extendedLikesInfo || {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    };
  }
}