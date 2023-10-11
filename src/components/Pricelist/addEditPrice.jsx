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
import ModalDropdown from 'react-native-modal-dropdown';
import {Api_Url} from '../../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPriceList = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [productId, setProductId] = useState('');
  const [cRate, setCrate] = useState('');
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [standardPrice, setStandardPrice] = useState('');
  const [selectedSupplierName, setSelectedSupplierName] = useState('');

  const [edPrice, setEdPrice] = useState('');

  const [cRateError, setCrateError] = useState('');

  useEffect(() => {
    retrieveScidFromStorage();
    GetProductList(edPrice);
    console.log('Add Price List', route);
    if (route && route.params) {
      GetPriceList(route.params.id);
    }
  }, [edPrice]);

  const retrieveScidFromStorage = async () => {
    try {
      const storedScid = await AsyncStorage.getItem('plID');
      const parsed = JSON.parse(storedScid);

      if (parsed !== null) {
        setEdPrice(parsed);
      }
    } catch (error) {
      console.error('Error retrieving scid:', error);
    }
  };

  const GetProductList = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/subcustomer/myproduct/list/${id}/`,
      );
      setData(response.data);
      // console.log('getting products', response.data);
    } catch (error) {
      console.error('API error2342:', error);
      // Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const GetPriceList = async id => {
    console.log('getting price list', id);
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/subcustomer/product/update/${id}`,
      );
      setUpdateData(response.data);
      setProduct(response.data.product_name);
      setCrate(response.data.price.toString());
      setStandardPrice(response.data.standard_price);
      console.log('getting products', response.data);
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Reset error messages

    setCrateError('');

    // Validate Customer Rate
    if (!cRate) {
      setCrateError('Customer Rate is required');
      isValid = false;
    } else if (isNaN(parseFloat(cRate))) {
      setCrateError('Customer Rate must be a number');
      isValid = false;
    }

    // Validate Customer Rate
    if (!cRate) {
      errors.cRate = 'Customer Rate is required';
      isValid = false;
    } else if (isNaN(parseFloat(cRate))) {
      errors.cRate = 'Customer Rate must be a number';
      isValid = false;
    }

    // Display an alert if there are errors
    if (!isValid) {
      let errorMessage = 'Validation error(s):\n\n';
      for (const key in errors) {
        errorMessage += `${errors[key]}\n`;
      }
      Alert.alert('Validation Error', errorMessage);
    }

    return isValid;
  };

  const HandleformSubmit = async () => {
    if (validateForm()) {
      // Proceed with form submission
      const formData = {
        products: productId,
        price: cRate,
      };

      // const formData = {
      //   products: productId,
      //   price: cRate,
      // };
      console.log(formData);
      try {
        const response = await axios.post(
          `${Api_Url}/accounts/apis/subcustomer/product/create/${edPrice}/`,
          formData,
        );
        console.log('API response:', response.data);
        Alert.alert('Success', 'Data submitted successfully!');
        navigation.navigate('PriceList');
      } catch (error) {
        console.error('API error:', error);
        Alert.alert('Error', 'An error occurred while submitting data.');
      }
    }
  };

  const HandleUpdate = async () => {
    const formData = {
      price: cRate,
    };
    console.log(formData);
    try {
      const response = await axios.put(
        `${Api_Url}/accounts/apis/subcustomer/product/update/${route.params.id}/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
      navigation.navigate('PriceList');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  useEffect(() => {
    console.log('jsadbfj');
  }, [product, standardPrice]);

  const handleProductSelection = async index => {
    // setProduct(data[index].name);
    setStandardPrice(data[index].standard_price);
    setProductId(data[index].pk);
    console.log('getting price', data[index].standard_price);
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
            onPress={() => navigation.navigate('PriceList')}
          />
          <Text style={styles.text}>Price List</Text>
          <Icon
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        {route && route.params ? (
          <Text style={styles.text2}>Update Price List</Text>
        ) : (
          <Text style={styles.text2}>Create Price List</Text>
        )}

        <View
          style={{
            marginTop: 18,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Product Name:</Text>
            {route && route.params ? (
              <Text style={styles.textProduct}>{product} </Text>
            ) : (
              <ModalDropdown
                style={styles.Input}
                defaultValue="Select Product"
                options={data.map(item => item.name)}
                onSelect={index => handleProductSelection(index)}
                defaultIndex={0}
                animated={true}
                isFullWidth={true}
                textStyle={styles.dropdownText}
                showsVerticalScrollIndicator={true}
                dropdownTextStyle={styles.dropdownText}
              />
            )}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Standard Price:</Text>
            <Text style={styles.Input2}>{standardPrice}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Customer Rate:</Text>
            <TextInput
              style={styles.Input}
              value={cRate}
              onChangeText={text => {
                setCrate(text);
                // Clear error message when user edits the input
                setCrateError('');
              }}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          {route && route.params ? (
            <Button
              buttonStyle={styles.Button}
              title="Update"
              onPress={HandleUpdate}
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
    padding: 9,
  },
  text2: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000000',
  },
  label: {
    fontSize: 18,
    color: '#000000',
  },
  Input: {
    height: 40,
    width: '69%',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000',
  },
  textProduct: {
    height: 40,
    width: '69%',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 9,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  Input2: {
    height: 40,
    width: 220,
    paddingHorizontal: 8,
    fontSize: 20,
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
  dropdownText: {
    color: '#000',
    fontSize: 18,
    paddingVertical: 4,
  },
});

export default AddPriceList;
