// authService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {Api_Url} from '../../utilities/api';
import axios from 'axios';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${Api_Url}/accounts/apis/login/`, {
      username,
      password,
    });

    const token = response.data.access_token;

    if (token) {
      console.log('token is: ' + token);
      await AsyncStorage.setItem('access_token', token);
      console.log('Token saved in async storage perfectly');
    }
  } catch (error) {
    Alert.alert(
      'Invalid email or password',
      'Please enter correct credentials',
    );
  }
};

export const logout = async () => {
  console.log('Logout successful');
  try {
    await AsyncStorage.removeItem('access_token');
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
