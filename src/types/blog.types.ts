// export interface BlogPost {
//   slug: string;
//   content: string;
//   title: string;
//   excerpt: string;
//   image: string;
//   date: string;
//   author: string;
//   category: string;
//   readTime: string;
//   tags: string[];
// }

export interface BlogPost {
  title: string;
  author: string;
  date: string;
  category: string;
  info: string;
  description: string;
  image?: File;
}

export interface BlogResponse {
  _id: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  category: string;
  info: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
