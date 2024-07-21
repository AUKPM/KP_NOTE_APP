// src/services/api/auth.ts
import Auth0 from 'react-native-auth0';
import axios from 'axios';
import { auth0Config } from './authConfig';

const auth0 = new Auth0({
  domain: 'dev-yg.us.auth0.com',
  clientId: 'H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA',
});

export const login = async () => {
  try {
    const credentials = await auth0.webAuth.authorize({
      scope: auth0Config.scopes.join(' '),
      audience: auth0Config.audience,
      redirectUrl: 'http://localhost:3000/callback',
    });
    return credentials.idToken;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

export const getUserInfo = async (idToken: string) => {
  try {
    const response = await axios.get('https://dev-yg.us.auth0.com/userinfo', {
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

export const logout = async () => {
  try {
    await auth0.webAuth.clearSession();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout API Error:', error);
    throw error;
  }
};
