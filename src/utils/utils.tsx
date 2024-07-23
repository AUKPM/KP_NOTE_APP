import {getData} from './storage';

export const checkIfAuth = async () => {
  try {
    const token = await getData('idToken');
    return !!token;
  } catch (error) {
    console.error('Error checking if user is guest:', error);
  }
};

export const formatDate = (date: Date) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} ${formattedTime}`;
};
