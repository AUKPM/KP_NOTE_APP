export interface CommentsType {
  id: number;
  userId: number;
  noteId: number;
  body: string;
}

export interface CreateCommentType {
  noteId: number;
  body: string;
}

export interface DeleteCommentType {
  message: string;
}
