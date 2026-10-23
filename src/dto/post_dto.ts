export interface CreatePostDto {
  title: string;
  content: string;
  categoryId: number;
  authorId: number; 
}

export interface GetPostsQueryDto {
  category?: string;
  take?: string;
}