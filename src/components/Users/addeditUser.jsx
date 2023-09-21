import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';

const NewUser = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('');

  const HandleformSubmit = async () => {
    const formData = {
      username: username,
      password: password,
      password2: password2,
      role: role,
    };

    console.log(formData);

    try {
      console.log('fdshgj');
      const response = await axios.post(
        `${Api_Url}/accounts/apis/create/user/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
      navigation.navigate('User');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  return (
    <View>
      <View style={styles.SupplierContainer}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Icon
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('User')}
          />
          <Text style={styles.text}>Users</Text>
          <Icon style={styles.Icons} name="person-circle-outline"></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.text2}>Create User</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.Input}
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.Input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.Input}
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry
          />
          <Text style={styles.label}>Role:</Text>
          <TextInput style={styles.Input} value={role} onChangeText={setRole} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            buttonStyle={styles.Button}
            onPress={HandleformSubmit}
            title="Create"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  SupplierContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 109,
  },
  text: {
    fontSize: 34,
    color: '#FFFFFF',
    marginTop: 10,
  },
  Icons: {
    color: '#fff',
    margin: 10,
    fontSize: 45,
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    padding: 10,
  },
  text2: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  Input: {
    height: 40,
    width: 250,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    padding: 5,
    color: '#000',
  },
  Input2: {
    height: 40,
    width: 270,
    padding: 5,
  },
  Button: {
    height: 40,
    width: 80,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    fontSize: 18,
    marginLeft: 8,
  },
});

export default NewUser;
