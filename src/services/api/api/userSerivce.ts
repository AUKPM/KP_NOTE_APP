import {getData, setData} from '../../../utils/storage';
import {apiRequest} from './axiosInstance';
import {UserInfoType} from '../../../types';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/config';

export const getUserInfo = async (): Promise<UserInfoType> => {
  const idToken = await getData('idToken');
  try {
    const response = await axios.get<UserInfoType>(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get User Info API Error:', error);
    throw error;
  }
};
