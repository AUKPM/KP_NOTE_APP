import {getData, setData} from '../../../utils/storage';
import {NoteType} from '../../../types';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/config';
import {CreateNoteType, DeleteNoteType} from '../../../types/NoteType';

export const getNoteData = async (): Promise<NoteType[]> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.get<NoteType[]>(`${API_BASE_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get Note API Error:', error);
    throw error;
  }
};

export const createNote = async (
  noteData: CreateNoteType,
): Promise<NoteType[]> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.post<NoteType[]>(
      `${API_BASE_URL}/notes`,
      noteData,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Create Note API Error:', error);
    throw error;
  }
};

export const getNoteDataById = async (noteId: number): Promise<NoteType> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.get<NoteType>(
      `${API_BASE_URL}/notes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Get Note API Error:', error);
    throw error;
  }
};

export const deleteNoteById = async (
  noteId: number,
): Promise<DeleteNoteType> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.delete<DeleteNoteType>(
      `${API_BASE_URL}/notes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Get Note API Error:', error);
    throw error;
  }
};
