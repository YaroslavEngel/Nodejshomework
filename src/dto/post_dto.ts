export interface CreatePostDto {
  title: string;
  content: string;
  author?: string | undefined;
  categoryId: number;
}

export interface GetPostsQueryDto {
  category?: string;
  take?: string;
}