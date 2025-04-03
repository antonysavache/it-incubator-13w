export interface CreateBlogModel {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface UpdateBlogModel {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface ViewBlogModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
