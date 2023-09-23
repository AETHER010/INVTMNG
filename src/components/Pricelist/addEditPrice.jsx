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

const AddPriceList = ({navigation, route}) => {
  const subCId = route.params.ScId;

  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [productId, setProductId] = useState('');
  const [cRate, setCrate] = useState('');
  const [data, setData] = useState([]);
  const [standardPrice, setStandardPrice] = useState('');
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState(0);

  useEffect(() => {
    console.log('Add Price List', route.params);
    GetProductList(route.params.ScId);
  }, []);

  const GetProductList = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/subcustomer/myproduct/list/${id}`,
      );
      setData(response.data);
      console.log('getting products', response.data);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const HandleformSubmit = async () => {
    const formData = {
      products: productId,
      price: cRate,
    };
    console.log(formData);
    try {
      const response = await axios.post(
        `${Api_Url}/accounts/apis/subcustomer/product/create/${subCId}`,
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
    setProduct(data[index].name);
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
        <Text style={styles.text2}>Create Price List</Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <Text style={styles.label}>Product Name:</Text>
          <ModalDropdown
            style={styles.Input}
            defaultValue={route.params ? product : 'Select Product...'}
            options={data.map(item => item.name)}
            onSelect={index => handleProductSelection(index)}
            defaultIndex={selectedSupplierIndex}
            animated={true}
            isFullWidth={true}
            textStyle={styles.dropdownText}
            showsVerticalScrollIndicator={true}
            dropdownTextStyle={styles.dropdownText}
          />
          <Text style={styles.label}>Standard Price:</Text>
          <Text style={styles.Input2}>{standardPrice}</Text>

          <Text style={styles.label}>Customer Rate:</Text>
          <TextInput
            style={styles.Input}
            value={cRate}
            onChangeText={setCrate}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            buttonStyle={styles.Button}
            onPress={HandleformSubmit}
            title="Create"
          />
          <Button buttonStyle={styles.Button} title="Update" />
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
    width: 220,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
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

export default AddPriceList;
