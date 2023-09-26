// authService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {Api_Url} from '../../utilities/api';
import axios from 'axios';

export const refreshToken = async () => {
  try {
    // Retrieve the refresh token from AsyncStorage
    const refresh_token = await AsyncStorage.getItem('refresh_token');

    if (!refresh_token) {
      throw new Error('Refresh token not found');
    }

    // Make a POST request to your server's token refresh endpoint
    const response = await axios.post(
      `${Api_Url}/accounts/apis/refresh-token/`,
      {
        refresh_token,
      },
    );

    const new_access_token = response.data.access_token;

    if (new_access_token) {
      // Update the access token in AsyncStorage
      await AsyncStorage.setItem('access_token', new_access_token);
      console.log('Access token refreshed and updated in AsyncStorage');
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${new_access_token}`;
      return true; // Token refresh successful
    }

    return false; // Token refresh failed
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
};

export const logout = async () => {
  console.log('Logout successful');
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    // Retrieve user data from AsyncStorage
    const userData = await AsyncStorage.getItem('access_token');
    return userData ? userData : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
};
