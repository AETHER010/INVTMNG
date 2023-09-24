import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';
import SelectDropdown from 'react-native-select-dropdown';

const NewUser = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('');

  const dropdownData = ['Select Role...', 'user', 'admin'];

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

  const renderDropdownIcon = () => (
    <Icon2 name="arrow-drop-down" size={20} color="#000" />
  );

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
          {/* <TextInput style={styles.Input} value={role} onChangeText={setRole} /> */}
          <SelectDropdown
            data={dropdownData}
            onSelect={selectedItem => setRole(selectedItem)}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            defaultValueByIndex={0}
            defaultButtonText="Select Role..."
            buttonStyle={styles.Input}
            rowStyle={styles.dropdownText}
            dropdownStyle={styles.dropdown2}
            renderDropdownIcon={renderDropdownIcon}
          />
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
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  SupplierContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 80,
  },
  text: {
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: 10,
  },
  Icons: {
    color: '#fff',
    margin: 10,
    fontSize: 35,
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

    marginTop: 10,
    color: '#000',
  },
  Input: {
    height: 40,
    width: screenWidth > 500 ? 220 : 260,
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
  dropdownText: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 4,
  },
  dropdown2: {
    borderRadius: 10,
  },
});

export default NewUser;
