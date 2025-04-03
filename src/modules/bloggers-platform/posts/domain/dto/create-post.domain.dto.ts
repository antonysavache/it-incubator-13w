export interface CreatePostDomainDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string; // Optional because it can be derived
}
