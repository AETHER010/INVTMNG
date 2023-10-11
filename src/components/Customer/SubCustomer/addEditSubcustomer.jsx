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
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewSubCustomer = ({navigation, route}) => {
  const Api_url = 'https://ims.itnepalsoultions.com.pujanrajrai.com.np';
  const [name, setName] = useState('');
  const [contact_number, setContact_number] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [data, setData] = useState([]);

  const [scid, setScid] = useState('');

  useEffect(() => {
    retrieveScidFromStorage();
    console.log('New Sub Customer', route);
    if (route && route.params) {
      fetchApiData(route.params.upid);
    }
  }, [scid]);

  const retrieveScidFromStorage = async () => {
    try {
      const storedScid = await AsyncStorage.getItem('subCid');
      const parsedScid = JSON.parse(storedScid);
      setScid(parsedScid);

      console.log('New Sub CustomedFdADSr', scid);
    } catch (error) {
      console.error('Error retrieving scid:', error);
    }
  };

  const fetchApiData = async id => {
    console.log('Fetching Sub Customer', id);
    try {
      const response = await axios.get(
        `${Api_url}/accounts/apis/subcustomer/update-detail/${id}/`,
      );
      console.log('API response:', response.data);
      setData(response.data);

      setName(response.data.name);
      setContact_number(response.data.contact_number);
    } catch (error) {
      console.error('API error:', error.message);
      // Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  const HandleformSubmit = async () => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    console.log('Form submit', formData);
    console.log('Form submit', scid);
    try {
      const response = await axios.post(
        `${Api_url}/accounts/apis/subcustomer/${scid}/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
      navigation.navigate('SubCustomer');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const handleUpdate = async () => {
    const id = route.params.upid;

    const formData = {
      name: name,
      contact_number: contact_number,
    };

    console.log('Form submit', formData);

    try {
      const response = await axios.put(
        `${Api_url}/accounts/apis/subcustomer/update-detail/${route.params.upid}/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
      navigation.navigate('Customer');
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
            onPress={() => navigation.navigate('SubCustomer')}
          />

          <Text style={styles.text}>New Sub Customer</Text>
          <Icon
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        {route && route.params ? (
          <Text style={styles.text2}>Update Sub Customer</Text>
        ) : (
          <Text style={styles.text2}>Create Sub Customer</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.Input}
            value={name || ''}
            onChangeText={setName}
          />

          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={styles.Input}
            value={contact_number || ''}
            onChangeText={setContact_number}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          {route && route.params ? (
            <View>
              <Button
                buttonStyle={styles.Button}
                title="Update"
                onPress={() => handleUpdate()}
              />
            </View>
          ) : (
            <Button
              buttonStyle={styles.Button}
              onPress={HandleformSubmit}
              title="Create"
            />
          )}
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
    padding: 5,
  },
  text2: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000',
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
  Input: {
    height: 40,
    width: 220,
    color: '#000',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  Button: {
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 18,
    marginLeft: 8,
  },
});

export default NewSubCustomer;
