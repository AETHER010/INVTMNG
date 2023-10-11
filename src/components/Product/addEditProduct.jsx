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
import ModalDropdown from 'react-native-modal-dropdown';
import {Api_Url} from '../../utilities/api';

const NewProduct = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [supplier, setSupplier] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const [data, setData] = useState([]);
  const [supplierName, setSupplierName] = useState('');

  useEffect(() => {
    console.log(route);
    if (route && route.params) {
      getProductData();
    }
    GetSupplierList();
    // getProductData();
  }, [route.params, supplierName]);

  const GetSupplierList = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/suppliers?search=`,
      );
      // console.log('API error:', response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while getting data.');
    }
  };

  const getProductData = async () => {
    console.log('Get Product Data', route.params.pk);
    try {
      const response = await axios.get(
        `${Api_Url}/products/apis/products/${route.params.pk}`,
      );

      console.log('getting products', response.data);
      // setSelectedSupplierName(response.data.name);
      setName(response.data.name);
      setSellingPrice(response.data.standard_price.toString());

      setSupplierName(response.data.suppliers);
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while getting data.');
    }
  };

  const HandleformSubmit = async () => {
    const formData = {
      name: name,
      suppliers: supplier,
      standard_price: sellingPrice,
    };
    console.log(formData);
    try {
      const response = await axios.post(
        `${Api_Url}/products/apis/products/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
      navigation.navigate('Product');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const handleProductSelection = async index => {
    const selected = data[index];
    const selectedSupplier = selected.pk;
    setSupplier(selectedSupplier);
  };

  const HandleUpdate = async () => {
    const formData = {
      name: name,
      standard_price: sellingPrice,
    };
    console.log(formData, 'formdata');

    try {
      const response = await axios.put(
        `${Api_Url}/products/apis/products/${route.params.pk}/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data updated successfully!');
      navigation.navigate('Product');
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
            onPress={() => navigation.navigate('Product')}
          />
          <Text style={styles.text}>Product</Text>
          <Icon
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon>
        </View>
      </View>
      <View style={styles.formContainer}>
        {route && route.params ? (
          <Text style={styles.text2}>Update Product</Text>
        ) : (
          <Text style={styles.text2}>Create Product</Text>
        )}

        <View
          style={{
            padding: 5,
            marginTop: 18,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Supplier:</Text>
            {route && route.params ? (
              <Text style={styles.Input4}>{supplierName}</Text>
            ) : (
              <ModalDropdown
                style={styles.Input}
                defaultValue="Select Supplier"
                options={data.map(item => item.name)}
                onSelect={index => handleProductSelection(index)}
                defaultIndex={0}
                animated={true}
                isFullWidth={true}
                textStyle={styles.dropdownText}
                showsVerticalScrollIndicator={true}
                dropdownTextStyle={styles.dropdownText}
                defaultTextStyle={{color: '#000'}}
              />
            )}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.Input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Selling Price:</Text>
            <TextInput
              style={styles.Input}
              value={sellingPrice}
              onChangeText={setSellingPrice}
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
    width: 250,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000000',
  },
  Input4: {
    height: 40,
    width: 250,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000000',
    paddingVertical: 9,
  },
  Input9: {
    height: 40,
    width: '68%',
    paddingHorizontal: 8,
    paddingVertical: 9,
    color: '#000000',
  },
  Button: {
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    marginLeft: 8,
  },
  dropdownText: {
    color: '#000',
    fontSize: 18,
    paddingVertical: 4,
  },
});

export default NewProduct;
