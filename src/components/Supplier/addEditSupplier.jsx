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

const NewSupplier = ({navigation, route}) => {
  // const Api_ULR = 'https://ims.itnepalsoultions.com.pujanrajrai.com.np';

  const [name, setName] = useState('');
  const [contact_number, setContact_number] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (route && route.params) {
      fetchApiData(route.params.pk);
    }
  }, [route]);

  const fetchApiData = async id => {
    console.log('params value', id);
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/suppliers/${id}`,
      );
      console.log('API response:', response.data);
      setData(response.data);
      setName(response.data.name || '');
      setContact_number(response.data.contact_number || '');
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const HandleformSubmit = async () => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    console.log('Form data', formData);

    try {
      const response = await axios.post(
        `${Api_Url}/accounts/apis/suppliers/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Supplier Created successfully!');
      navigation.navigate('Supplier');
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const handleUpdate = async id => {
    const formData = {
      name: name,
      contact_number: contact_number,
    };

    console.log('API response:', formData);

    try {
      const response = await axios.put(
        `${Api_Url}/accounts/apis/suppliers/${id}/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Supplier Updated successfully!');
      navigation.navigate('Supplier');
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while submitting data.');
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
            onPress={() => navigation.navigate('Supplier')}
          />
          <Text style={styles.text}>Supplier</Text>
          <Icon
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        {route && route.params ? (
          <Text style={styles.text2}>Update Supplier</Text>
        ) : (
          <Text style={styles.text2}>Create Supplier</Text>
        )}
        <View
          style={{
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.Input}
              value={name || ''}
              onChangeText={setName}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.Input}
              value={contact_number || ''}
              onChangeText={setContact_number}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          {route && route.params ? (
            <Button
              buttonStyle={styles.Button}
              onPress={() => handleUpdate(data.pk)}
              title="Update"
            />
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
    width: '70%',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000000',
  },
  Button: {
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    fontSize: 18,
    marginLeft: 8,
  },
});

export default NewSupplier;
