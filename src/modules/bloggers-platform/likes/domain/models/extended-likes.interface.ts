import { NewestLikes } from './newest-likes.interface';

export interface ExtendedLikes {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
}
