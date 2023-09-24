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
  const [stock, setStock] = useState('');
  const [data, setData] = useState([]);
  const [supplierName, setSupplierName] = useState('');
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState(0);
  const [selectedSupplierName, setSelectedSupplierName] =
    useState('Select Product...');

  useEffect(() => {
    console.log(route);
    if (route && route.params) {
      GetSupplierList();
      getProductData();
    }
    GetSupplierList();
    // getProductData();
  }, [route.params]);

  const GetSupplierList = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/suppliers?search=`,
      );
      console.log('API error:', response.data.data);
      setData(response.data.data);

      if (route.params && route.params.index) {
        setSelectedSupplierIndex(route.params.index);
        setSelectedSupplierName(response.data.data[route.params.index].name);
      }
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

      console.log('getting products', response.data.stock);
      // setSelectedSupplierName(response.data.name);
      setName(response.data.name);
      setSellingPrice(response.data.standard_price.toString());
      setStock(response.data.stock.toString());
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
      stock: stock,
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
        `${Api_Url}/products/apis/products/${route.params.pk}`,
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
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <Text style={styles.label}>Supplier:</Text>
          <ModalDropdown
            style={styles.Input}
            defaultValue={selectedSupplierName}
            options={data.map(item => item.name)}
            onSelect={index => handleProductSelection(index)}
            defaultIndex={selectedSupplierIndex}
            animated={true}
            isFullWidth={true}
            textStyle={styles.dropdownText}
            showsVerticalScrollIndicator={true}
            dropdownTextStyle={styles.dropdownText}
          />
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.Input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Selling Price:</Text>
          <TextInput
            style={styles.Input}
            value={sellingPrice}
            onChangeText={setSellingPrice}
          />
          <Text style={styles.label}>Stock:</Text>
          <TextInput
            style={styles.Input}
            value={stock}
            onChangeText={setStock}
          />
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
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 18,
    paddingVertical: 4,
  },
});

export default NewProduct;
