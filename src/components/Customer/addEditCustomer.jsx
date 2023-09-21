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

const NewSupplier = ({navigation, route}) => {
  const Api_url = 'https://ims.itnepalsoultions.com.pujanrajrai.com.np';
  const [name, setName] = useState('');
  const [contact_number, setContact_number] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(data);
    if (route && route.params) {
      fetchApiData(route.params.pk);
    }
    console.log('Fetching', data.name);
    setName(data.name);
    setContact_number(data.contact_number);
  }, []);

  const fetchApiData = async id => {
    try {
      const response = await axios.get(
        `${Api_url}/accounts/apis/customer/${id}`,
      );
      console.log('API response:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  const HandleformSubmit = async () => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    try {
      const response = await axios.post(
        `${Api_url}/accounts/apis/customer/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const handleUpdate = async id => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    try {
      const response = await axios.put(
        `${Api_url}/accounts/apis/customer/${id}`,
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
          <Icon style={styles.Icons} name="person-circle-outline"></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.text2}>Create Customer</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <Text style={styles.label}>CustomerId:</Text>
          <TextInput style={styles.Input} editable={false} value={customerId} />
          <Text style={styles.label}>Customer:</Text>
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
                onPress={() => handleUpdate(data.pk)}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
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

export default NewSupplier;
