export interface ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string; // 'Like' | 'Dislike' | 'None'
  newestLikes: any[];
}

export interface PostView {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
}
