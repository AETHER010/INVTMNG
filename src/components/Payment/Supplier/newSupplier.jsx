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
import {Api_Url} from './../../../utilities/api';
import ModalDropdown from 'react-native-modal-dropdown';
import DocumentPicker from 'react-native-document-picker';

const NewPaymentSupplier = ({navigation}) => {
  const [cname, setCname] = useState('');
  const [customer, setCustomer] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDoc, setSelectedDoc] = useState([]);
  const [sellingPrice, setLaunchedPrice] = useState('');
  const [evidence, setEvidence] = useState('');

  const paymentData = ['Cash', 'E-Pay'];

  useEffect(() => {
    fetchdataCustomer();
  }, []);

  const fetchdataCustomer = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/purchase/suppliers/list/`,
      );

      setCustomer(response.data);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  useEffect(() => {
    console.log('Selected DOC', selectedDoc);
  }, [selectedDoc]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedDoc(result);
      console.log('selected file', selectedDoc);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User Exit', err);
      } else {
        throw err;
      }
    }
  };

  const HandleformSubmit = async () => {
    // const formData = new FormData();
    // formData.append('customer', cname);
    // formData.append('amount', amount);
    // formData.append('remarks', remarks);
    // formData.append('file', {
    //   uri: selectedDoc.uri,
    //   type: selectedDoc.type,
    //   name: selectedDoc.name,
    // });

    const formData = {
      customer: cname,
      amount: amount,
      remarks: remarks,
    };

    console.log('formdata', formData);

    // {
    //   customer: cname,
    //   amount: amount,
    //   remarks: remarks,
    // };
    try {
      const response = await axios.post(
        `${Api_Url}/payment/apis/seller-payments/`,
        formData,
      );
      console.log('API response:', response.data);
      Alert.alert('Success', 'Data submitted successfully!');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const handleProductSelection = async index => {
    const dataselected = customer[index];

    setCname(customer[index].pk);
    console.log('data values', customer[index].pk);
    console.log('customerId', cname);
  };

  return (
    <View style={styles.NewClientContainer}>
      <Icon
        style={styles.Icons}
        name="arrow-back"
        onPress={() => navigation.navigate('Payment')}
      />
      <View style={styles.formContainer}>
        <Text style={styles.text2}>Create Supplier Payment</Text>

        <View
          style={{
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // justifyContent: 'space-between',
            // padding: 5,
            marginTop: 18,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={styles.label}>Supplier:</Text>
            <ModalDropdown
              style={styles.Input}
              defaultValue="Select Client..."
              options={customer.map(item => item.name)}
              onSelect={index => handleProductSelection(index)}
              defaultIndex={0}
              animated={true}
              isFullWidth={true}
              textStyle={styles.dropdownText}
              showsVerticalScrollIndicator={true}
              dropdownTextStyle={styles.dropdownText}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.Input}
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={styles.label}>Payment Method:</Text>
            {/* <TextInput
              style={styles.Input}
              value={sellingPrice}
              // onChangeText={setSellingPrice}
            /> */}
            <ModalDropdown
              style={styles.Input}
              defaultValue="Select Payment..."
              options={paymentData}
              // onSelect={index => handleProductSelection(index)}
              defaultIndex={0}
              animated={true}
              isFullWidth={true}
              textStyle={styles.dropdownText}
              showsVerticalScrollIndicator={true}
              dropdownTextStyle={styles.dropdownText}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={styles.label}>Evidence:</Text>
            {/* <TextInput
              style={styles.Input}
              value={evidence}
              type="file"
              // onChangeText={setSellingPrice}
            /> */}
            <View style={styles.fileInput}>
              <Text
                style={{
                  color: 'black',
                  backgroundColor: '#CED4DA',
                  marginRight: 8,
                  padding: 4,
                }}
                onPress={pickDocument}>
                Pick Document
              </Text>
              <View style={{overflow: 'hidden'}}>
                {selectedDoc.length > 0 ? (
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      paddingVertical: 4,
                      width: 90,
                    }}>
                    {selectedDoc[0].name}
                  </Text>
                ) : (
                  <Text
                    style={{color: 'black', fontSize: 15, paddingVertical: 4}}>
                    No Doc Chosen
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={styles.label}>Remarks:</Text>
            <TextInput
              style={styles.Input}
              value={remarks}
              onChangeText={setRemarks}
            />
          </View>
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
  NewClientContainer: {
    flex: 1,
  },
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
    color: '#000',
    fontSize: 30,
    alignItems: 'flex-start',
    margin: 10,
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
    color: '#000',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  Input: {
    height: 40,
    width: 200,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    padding: 5,
    color: '#000',
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
  },
  fileInput: {
    height: 40,
    width: 200,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 16,
  },
});

export default NewPaymentSupplier;
