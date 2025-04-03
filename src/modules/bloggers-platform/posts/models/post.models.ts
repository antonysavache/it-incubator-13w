export interface CreatePostModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface UpdatePostModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: any[];
}

export interface ViewPostModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
}
