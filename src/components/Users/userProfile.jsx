import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Api_Url} from '../../utilities/api';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {logout} from './userAuth';

const UserProfile = ({navigation}) => {
  const [user, setUser] = useState([]);
  const [userToken, setUserToken] = useState([]);
  const [loading, setLoading] = useState('false');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    retrieveTokenData();
    console.log('User Profile');
  }, []);

  const retrieveTokenData = async () => {
    const token = await getTokenFromAsyncStorage();

    if (token) {
      const decodedToken = decodeToken(token);

      if (decodedToken) {
        console.log('Decoded Token Data:', decodedToken.user_id);
        setUserToken(decodedToken);
        getUserDetails(decodedToken.user_id);
      } else {
        console.error('Failed to decode token.');
      }
    } else {
      console.error('Token not found in AsyncStorage.');
    }
  };

  const getTokenFromAsyncStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const decodeToken = token => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // useEffect(() => {
  //   console.log('sasdasda');
  // }, [userToken]);

  const getUserDetails = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/user-details/${id}`,
      );
      console.log('user data response', response.data);
      setUser(response.data);
      console.log('user details', user);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
    setUserId(user.username);
    console.log('user details');
  };

  const handleNavigation = () => {
    console.log(user, 'jfyfkvk');
    navigation.navigate('ChangePassword', {user});
  };

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    navigation.navigate('Login2');
  };

  return (
    <View style={styles.ProfileContainer}>
      <Icon
        style={styles.Icon}
        name="arrow-back"
        onPress={() => navigation.navigate('Home2')}></Icon>
      <View style={styles.ProfileIcon}>
        <Icon style={styles.Icon2} name="person-circle-outline" />
        <Text style={{color: '#000', fontSize: 22}}>{user.username}</Text>
        <Text style={{color: '#000', fontSize: 18}}>{user.role}</Text>
      </View>
      <View>
        <View style={styles.MenuContainer}>
          <Icon style={styles.Icon} name="settings-sharp" />
          <Text
            style={styles.MenuText}
            onPress={() => navigation.navigate('Report')}>
            Report
          </Text>
        </View>
        <View style={styles.MenuContainer}>
          <Icon style={styles.Icon} name="lock-closed" />
          <Text style={styles.MenuText} onPress={handleNavigation}>
            Change Password
          </Text>
        </View>
        <View style={styles.MenuContainer}>
          <Icon style={styles.Icon} name="log-out-outline" />
          <Text style={styles.MenuText} onPress={handleLogOut}>
            Log Out
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ProfileContainer: {
    flex: 1,
  },
  Icon: {
    color: '#000',
    margin: 8,
    fontSize: 35,
  },
  ProfileIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 280,
    marginTop: 12,
    padding: 12,
  },
  Icon2: {
    color: '#000',
    fontSize: 180,
  },
  MenuContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,

    borderColor: '#707070',
    paddingLeft: 25,
  },
  MenuText: {
    color: '#000',
    paddingVertical: 13,
    fontSize: 18,
  },
});

export default UserProfile;
