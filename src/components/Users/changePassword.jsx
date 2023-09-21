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

const ChangePassword = ({navigation, route}) => {
  const user = route.params.userId;
  const [oPassword, setOPassword] = useState('');
  const [npassword, setNPassword] = useState('');
  const [cPassword, setCPassword] = useState('');

  const HandleformSubmit = async () => {
    const formData = {
      new_password: npassword,
      confirm_password: cPassword,
    };

    console.log(route.params.userId);
    console.log(formData);
    console.log('user', user);

    try {
      const response = await axios.post(
        `${Api_Url}/accounts/apis/changeuserpassword/${user}`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
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
            onPress={() => navigation.navigate('UserProfile')}
          />
          <Text style={styles.text}>Customer</Text>
          <Icon style={styles.Icons} name="person-circle-outline"></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.text2}>Change Password</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          {/* <Text style={styles.label}>Old Password:</Text>
          <TextInput
            style={styles.Input}
            value={name || ''}
            onChangeText={setName}
          /> */}

          <Text style={styles.label}>New Password:</Text>
          <TextInput
            style={styles.Input}
            value={npassword || ''}
            onChangeText={setNPassword}
          />
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.Input}
            value={cPassword || ''}
            onChangeText={setCPassword}
          />
        </View>
        <Button
          buttonStyle={styles.Button}
          onPress={HandleformSubmit}
          title="Create"
        />
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
    padding: 5,
  },
  text2: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000000',
  },
  label: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000000',
    paddingVertical: 5,
  },
  Input: {
    height: 40,
    width: 220,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000000',
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
  Button2: {
    margin: 4,
    height: 40,
    width: 120,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    fontSize: 18,
    marginLeft: 8,
  },
});

export default ChangePassword;
