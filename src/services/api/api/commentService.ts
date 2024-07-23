import {getData, setData} from '../../../utils/storage';
import {CommentsType, NoteType} from '../../../types';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/config';
import {
  CreateCommentType,
  DeleteCommentType,
} from '../../../types/CommentsType';

export const getCommentByNoteId = async (
  noteId: number,
): Promise<CommentsType[]> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.get<CommentsType[]>(
      `${API_BASE_URL}/comments?noteId=${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Get Comments API Error:', error);
    throw error;
  }
};

export const createComment = async (
  commentData: CreateCommentType,
): Promise<CreateCommentType> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.post<CreateCommentType>(
      `${API_BASE_URL}/comments`,
      commentData,
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

export const deleteCommentById = async (
  commentId: number,
): Promise<DeleteCommentType> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.delete<DeleteCommentType>(
      `${API_BASE_URL}/comments/${commentId}`,
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

export const getCommentDataById = async (
  commentId: number,
): Promise<CommentsType> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.get<CommentsType>(
      `${API_BASE_URL}/comments/${commentId}`,
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
