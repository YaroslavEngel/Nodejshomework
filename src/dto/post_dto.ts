export interface CreatePostDto {
  title: string;
  content: string;
  author?: string | undefined;
  category?: string | undefined;
}

export interface GetPostsQueryDto {
  category?: string;
  take?: string;
}