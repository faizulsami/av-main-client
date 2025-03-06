export interface BlogPost {
  blogId?: string;
  blogTitle: string;
  featuredImage?: File | string;
  content: string;
  blogStatus?: string;
  blogSlug: string;
  blogCategory: string;
  excerpt: string;
  blogType: string;
  createdAt?: string;
  updatedAt?: string;
  author: string;
}

export interface BlogApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: BlogPost[];
}

export interface Blog {
  _id: string;
  blogId: string;
  blogTitle: string;
  featuredImage: string;
  blogSlug: string;
  excerpt: string;
  blogCategory: string;
  author: string;
  blogType: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface BlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Blog[];
}

export interface SingleBlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Blog;
}
