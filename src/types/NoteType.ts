export interface NoteType {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface CreateNoteType {
  title: string;
  body: string;
}

export interface DeleteNoteType {
  noteId: number;
  body: string;
}
