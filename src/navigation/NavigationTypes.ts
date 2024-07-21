// navigation/types.ts
import {NoteType} from '../types/NoteType';
import {CommentsType} from '../types/CommentsType';

export type RootStackParamList = {
  NewNote: {note?: NoteType};
  EditComment: {comment?: CommentsType};
};
