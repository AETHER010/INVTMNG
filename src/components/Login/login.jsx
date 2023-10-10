import {View, StyleSheet, Image, TextInput, Text, Alert} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {Icon} from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Api_Url} from '../../utilities/api';

const LoginForm = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post(`${Api_Url}/accounts/apis/login/`, {
        username,
        password,
      });

      const token = response.data.access_token;
      const role = response.data.role;
      if (token) {
        console.log('token is: ' + token);
        await AsyncStorage.setItem('access_token', token);
        await AsyncStorage.setItem('userRole', role);
        console.log('Token saved in async storage perfectly');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigation.navigate('Home2');
      }
    } catch (error) {
      console.log('error', error.message);
      setError('Username and password doesnot match');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../Images/logo.png')}
        resizeMode="contain"
      />
      <Text style={styles.Text}>Login with your Account to Continue.</Text>

      <TextInput
        style={styles.Input}
        placeholder="Username..."
        value={username}
        color="#000"
        placeholderTextColor="#00000080"
        onChangeText={text => setUsername(text)}
      />
      {/* </View> */}
      <TextInput
        style={styles.Input}
        placeholder="Password..."
        color="#000"
        secureTextEntry
        value={password}
        placeholderTextColor="#00000080"
        onChangeText={text => setPassword(text)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        buttonStyle={styles.Button}
        onPress={() => handleLogin()}
        title="Login"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  Input: {
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    height: 50,
    borderColor: '#9a9ea0',
    borderRadius: 8,
    height: 60,
    padding: 5,
    width: '95%',
    margin: 8,
    // flex: 0.7,
  },
  Button: {
    backgroundColor: '#3A39A0',
    height: 44,
    width: 111,
    padding: 5,
    borderRadius: 8,
  },
  Text: {
    margin: 5,
    paddingBottom: 8,
    fontSize: 16,
    color: '#000',
  },
  image: {
    margin: -5,
    width: 350,
    height: 300,
  },
  Icon: {
    flex: 0.3,
    width: 35,
    height: 30,
    color: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginForm;
