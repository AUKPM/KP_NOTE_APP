import Auth0 from 'react-native-auth0';
import axios from 'axios';
import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_REDIRECT_URL,
  AUTH0_SCOPE,
} from '@env';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
});

export const login = async () => {
  try {
    const credentials = await auth0.webAuth.authorize({
      scope: AUTH0_SCOPE,
      audience: AUTH0_AUDIENCE,
      redirectUrl: AUTH0_REDIRECT_URL,
    });
    return credentials;
  } catch (error) {
    console.error('Login API Error:', error);
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
