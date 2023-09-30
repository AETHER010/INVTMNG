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
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewCustomer = ({navigation, route}) => {
  // const Api_url = 'https://ims.itnepalsoultions.com.pujanrajrai.com.np';
  const [name, setName] = useState('');
  const [contact_number, setContact_number] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('iadsfads', route.params);
    if (route && route.params) {
      fetchApiData(route.params.pk);
    }
    console.log('Fetching', data.name);
    // setName(data.name || '');
    // setContact_number(data.contact_number || '');
  }, [route]);

  const fetchApiData = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/customer/${id}`,
      );
      console.log('API response:', response.data);
      setData(response.data);
      setName(response.data.name || '');
      setContact_number(response.data.contact_number || '');
    } catch (error) {
      console.error('API error sdfsdf:', error);
      // Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  useEffect(() => {
    console.log('Fetching', data.name);
    console.log('Fetching', data.name);
  }, [data]);

  const HandleformSubmit = async () => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    try {
      const response = await axios.post(
        `${Api_Url}/accounts/apis/customer/`,
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

  const handleUpdate = async () => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    console.log('API response:', formData);

    try {
      const response = await axios.put(
        `${Api_Url}/accounts/apis/customer/${route.params.pk}/`,
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

  const handlesubcustomer = async id => {
    navigation.navigate('SubCustomer', {id});
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
            onPress={() => navigation.navigate('Customer')}
          />
          <Text style={styles.text}>Customer</Text>
          <Icon
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        {route && route.params ? (
          <Text style={styles.text2}>Update Customer</Text>
        ) : (
          <Text style={styles.text2}>Create Customer</Text>
        )}
        <View
          style={{
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Customer:</Text>
            <TextInput
              style={styles.Input}
              value={name}
              onChangeText={text => setName(text)}
              editable={true}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Contact Number:</Text>
            <TextInput
              style={styles.Input}
              value={contact_number}
              onChangeText={text => setContact_number(text)}
              editable={true}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          {route && route.params ? (
            <View style={{flexDirection: 'row'}}>
              <Button
                buttonStyle={styles.Button}
                title="Update"
                onPress={() => handleUpdate()}
              />
              <Button
                buttonStyle={styles.Button2}
                title="Sub Customer"
                onPress={() => handlesubcustomer(data.pk)}
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
    color: '#000000',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
  },
  Input: {
    height: 40,
    width: '68%',
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

export default NewCustomer;
