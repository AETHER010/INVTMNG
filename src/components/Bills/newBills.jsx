import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';

import {useEffect, useState} from 'react';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';
import {Api_Url} from '../../utilities/api';

const NewBills = ({navigation, route}) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const [product, setProduct] = useState([]);
  const [price, setPrice] = useState(0);
  const [supplier, setSupplier] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [loading, setLoading] = useState('');
  const [billId, setBillId] = useState('');

  const [action, setAction] = useState('false');
  const [action2, setAction2] = useState('false');

  const [unConfirmProducts, setUnConfirmProducts] = useState([]);

  const [grandTotal, setGrandTotal] = useState('');

  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState([]);

  const [viewProduct, setViewProduct] = useState('false');
  const [newPrice, setNewPrice] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const [commission, setCommission] = useState('');

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/subcustomer/list/`,
      );
      setSupplier(response.data);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  const HandleformSubmit = async () => {
    setUpdatedPrice(price);
    setUpdatedQuantity(quantity);

    const formData = {
      product: productId,
      quantity: quantity,
      per_unit_price: price,
    };

    try {
      const response = await axios.post(
        `${Api_Url}/bill/apis/sales/unconfirm-bill/${supplierId}/`,
        formData,
      );
      console.log('API responsed after form submission:', response.data);
      gettingSupplierProducts(supplierId);
      setPrice('');
      setProduct([]);
      setQuantity('');
      Alert.alert('Success', 'Product added successfully!');
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while submitting data.');
    }
  };

  const handleProductSelection = async index => {
    const selectedData = supplier[index];
    const selectedProductId = selectedData.pk;
    setSupplierId(selectedProductId);

    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/subcustomer/products/${selectedData.pk}`,
      );
      console.log('API response for Product:', response.data);
      setProduct(response.data);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while retreving data.');
    }
    gettingSupplierProducts(selectedData.pk);
  };

  const handlePriceSelection = async index => {
    const selectedProduct = product[index];
    const selectedId = selectedProduct.pk;
    setProductId(selectedId);
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/suppliers/products/price/${supplierId}/${selectedProduct.pk}`,
      );
      console.log('API response454:', response.data);
      setPrice(response.data.lastpurchaseprice);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while retreving data.');
    }
  };

  const gettingSupplierProducts = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/unconfirm-bill/${id}/`,
      );
      console.log('API response for unconfirm products:', response.data.data);
      setGrandTotal(response.data.data.total_price);
      setCommission(response.data.data.charge_percentage);
      console.log('asdadsasd', response.data.data.charge_percentage);
      const apiData = response.data.data;
      const items = apiData.unconfirmsalesbill_item || [];
      setBillId(apiData.id);

      setUnConfirmProducts(items);
      console.log('Product issues bills', unConfirmProducts);
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while getting Product data.');
    }
  };

  const handleIssueBill = async () => {
    try {
      await axios.post(`${Api_Url}/bill/apis/sales/issue-bill/${billId}/`);
      Alert.alert('Success', 'Bill Issued Successfully');
      navigation.navigate('Purchase');
    } catch (error) {
      console.error('API error:', error);
      // console.error('Error response:', error.response);
      Alert.alert('Error', 'An error occurred while Issuing Bill.');
    }
  };

  useEffect(() => {
    console.log('selectedUpdate:', selectedUpdate);
    console.log('selected', selectedUpdate.quantity);
    console.log('selected', viewProduct);
  }, [selectedUpdate, newPrice, newQuantity]);

  const handleDelete = () => {
    console.log('delete');
    setAction('false');
    setViewProduct('false');
    gettingSupplierProducts(supplierId);
  };

  const handleUpdateAction = async (id, index) => {
    setAction('true');
    setViewProduct('true');

    setSelectedUpdate(unConfirmProducts[index]);
    setNewPrice(selectedUpdate.price);
    setNewQuantity(selectedUpdate.quantity);
    console.log('qunatity', selectedUpdate.quantity);
    console.log('price', selectedUpdate.price);
  };

  const handleDeleteProduct = async id => {
    const formData = {
      quantity: newQuantity,
      per_unit_price: newPrice,
    };
    try {
      await axios.delete(
        `${Api_Url}/bill/apis/sales/update-delete-unconfirm-bill/${id}/`,
      );
      Alert.alert('Success', 'Bill Deleted Successfully');
      gettingSupplierProducts(supplierId);
    } catch (error) {
      console.error('API error:', error);
      // console.error('Error response:', error.response);
      Alert.alert('Error', 'An error occurred while Deleting Bill.');
    }
  };

  const handleUpdateProduct = async id => {
    try {
      await axios.put(
        `${Api_Url}/bill/apis/sales/update-delete-unconfirm-bill/${id}/`,
        formData,
      );
      Alert.alert('Success', 'Product Updated Successfully');
      gettingSupplierProducts(supplierId);
      setAction('false');
    } catch (error) {
      console.error('API error:', error);
      // console.error('Error response:', error.response);
      Alert.alert('Error', 'An error occurred while Updaing product.');
    }
  };

  const handleIssuCharge = async () => {
    const formData = {
      charge: commission,
    };
    try {
      await axios.put(`${Api_Url}/apis/sales/charge/${supplierId}/`, formData);
      Alert.alert('Success', 'Product Updated Successfully');
      gettingSupplierProducts(supplierId);
      setAction('false');
    } catch (error) {
      console.error('API error:', error);
      // console.error('Error response:', error.response);
      Alert.alert('Error', 'An error occurred while Updaing product.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.SupplierContainer}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Icon2
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('Bills')}
          />
          <Text style={styles.text}>Bills</Text>
          <Icon2
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon2>
        </View>
      </View>
      <View style={styles.formContainer}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 5,
            marginTop: 18,
          }}>
          <Text style={styles.label}>Customer:</Text>
          <ModalDropdown
            style={styles.Input}
            defaultValue="Select Supplier..."
            options={supplier.map(item => item.name)}
            onSelect={index => handleProductSelection(index)}
            defaultIndex={0}
            animated={true}
            isFullWidth={true}
            textStyle={styles.dropdownText}
            showsVerticalScrollIndicator={true}
            dropdownTextStyle={styles.dropdownText}
          />
          <Text style={styles.label}>Product:</Text>
          <ModalDropdown
            style={styles.Input}
            options={product.map(item => item.name)}
            onSelect={index => handlePriceSelection(index)}
            defaultValue="Select product..."
            defaultIndex={0}
            animated={true}
            isFullWidth={true}
            textStyle={styles.dropdownText}
            dropdownTextStyle={styles.dropdownText}
          />

          <Text style={styles.label}>Quantity:</Text>
          <TextInput
            style={styles.Input}
            value={quantity}
            onChangeText={setQuantity}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.label}>Cost Price:</Text>
              <TextInput
                style={styles.priceInput}
                value={price !== null ? price.toString() : ''}
                onChangeText={setPrice}
                editable={true}
              />
            </View>
            <Button
              buttonStyle={styles.Button2}
              title="Add"
              onPress={HandleformSubmit}
            />
          </View>
        </View>
      </View>
      <ScrollView>
        <View>
          {viewProduct === 'false' ? (
            <View>
              {loading ? (
                <Text>Loading...</Text>
              ) : unConfirmProducts.length === 0 ? (
                <Text
                  style={{
                    color: '#000',
                    justifyContent: 'center',
                    fontSize: 20,
                    margin: 5,
                  }}>
                  No unconfirmed products available!!!
                </Text>
              ) : (
                unConfirmProducts.map((item, index) => (
                  <View
                    key={index}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={[styles.Card, styles.ShadowProps]}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#000',
                          fontWeight: 'bold',
                        }}>
                        {item.product_name}
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={{fontSize: 18, color: '#000', padding: 5}}>
                          cost Price:
                        </Text>

                        {action === 'false' ? (
                          <View>
                            <Text
                              style={{fontSize: 18, color: '#000', padding: 5}}>
                              {item.per_unit_price}
                            </Text>
                          </View>
                        ) : (
                          <TextInput
                            style={[styles.updateInput, {color: '#000'}]}
                            value={updatedPrice.toString()}
                            onChangeText={setUpdatedPrice}
                            editable={true}
                          />
                        )}
                      </View>
                      <View style={{flexDirection: 'row', marginTop: 4}}>
                        <Text style={{fontSize: 18, color: '#000', padding: 3}}>
                          quantity:
                        </Text>
                        {action === 'false' ? (
                          <Text
                            style={{fontSize: 18, color: '#000', padding: 5}}>
                            {item.quantity}
                          </Text>
                        ) : (
                          <TextInput
                            style={[styles.updateInput, {color: '#000'}]}
                            value={updatedQuantity.toString()}
                            onChangeText={setUpdatedQuantity}
                            editable={true}
                          />
                        )}
                      </View>
                      <View style={styles.card2}>
                        <Text
                          style={{fontSize: 16, paddingTop: 3, color: '#000'}}>
                          Total Amount: {item.total_price}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Icon
                            style={[
                              styles.Icons2,
                              {backgroundColor: '#3A39A0', marginLeft: 4},
                              action === 'true' && {
                                color: 'green',
                                backgroundColor: 'transparent',
                                size: '16px',
                              },
                            ]}
                            name="square-edit-outline"
                            // name={
                            //   action === 'true'
                            //     ? 'check-circle'
                            //     : 'square-edit-outline'
                            // }
                            onPress={() => handleUpdateAction(item.pk, index)}
                          />
                          <Icon
                            style={[
                              styles.Icons2,
                              {backgroundColor: '#FF0000'},
                            ]}
                            // name={action === 'true' ? 'close-circle' : 'delete'}
                            name="delete"
                            onPress={() => handleDeleteProduct(item.pk)}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View>
              {/* {loading ? (
                <Text>Loading...</Text>
              ) : (
                //   <Text
                //     style={{
                //       color: '#000',
                //       justifyContent: 'center',
                //       fontSize: 20,
                //       margin: 5,
                //     }}>
                //     No unconfirmed products available!!!
                //   </Text>
                // ) : (
                selectedUpdate.map((item, index) => ( */}
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={[styles.Card, styles.ShadowProps]}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#000',
                      fontWeight: 'bold',
                    }}>
                    {selectedUpdate.product_name}
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 4}}>
                    <Text style={{fontSize: 18, color: '#000', padding: 5}}>
                      cost Price:
                    </Text>
                    <TextInput
                      style={[styles.updateInput, {color: '#000'}]}
                      value={selectedUpdate.per_unit_price.toString()}
                      onChangeText={setNewPrice}
                      editable={true}
                    />
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 4}}>
                    <Text style={{fontSize: 18, color: '#000', padding: 3}}>
                      quantity:
                    </Text>

                    <TextInput
                      style={[styles.updateInput, {color: '#000'}]}
                      value={selectedUpdate.quantity.toString()}
                      onChangeText={setNewQuantity}
                      editable={true}
                    />
                  </View>
                  <View style={styles.card2}>
                    <Text style={{fontSize: 16, paddingTop: 3, color: '#000'}}>
                      Total Amount: {selectedUpdate.total_price}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Icon
                        style={[
                          styles.Icons2,
                          {backgroundColor: '#3A39A0', marginLeft: 4},
                        ]}
                        name="check-circle"
                        onPress={() => handleUpdateProduct(selectedUpdate.pk)}
                      />
                      <Icon
                        style={[styles.Icons2, {backgroundColor: '#FF0000'}]}
                        name="close-circle"
                        onPress={handleDelete}
                      />
                    </View>
                  </View>
                </View>
              </View>
              {/* ))
              )} */}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={{padding: 5}}>
          <Text style={{color: 'black', marginBottom: 5}}>Sub Total: </Text>
          <View style={{color: 'black', flexDirection: 'row'}}>
            <Text style={{color: 'black', marginTop: 3}}>Commission:</Text>
            <TextInput style={styles.CommisionText} onChange={setCommission}>
              {commission}{' '}
            </TextInput>
            <Text style={{color: 'black', marginTop: 3}}>% </Text>
          </View>
          <Button
            buttonStyle={styles.Button2}
            title="Add"
            onPress={handleIssuCharge}
          />
          <Text
            style={{
              fontSize: 16,
              paddingTop: 6,
              color: '#000',
            }}>
            Grand Total: {grandTotal}
          </Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Button
            buttonStyle={styles.Button2}
            title="Submit"
            onPress={handleIssueBill}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  SupplierContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 80,
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
    padding: 5,
  },
  text2: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000',
  },
  dropdownText: {
    color: '#000',
    fontSize: 18,
    paddingVertical: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  Input: {
    height: 40,
    width: 250,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
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
  Button2: {
    height: 40,
    width: 90,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#000',
    borderRadius: 10,
    padding: 8,
    fontSize: 18,
  },
  Icons2: {
    color: '#FFF',
    fontSize: 25,
    padding: 4,
    marginLeft: 5,
    borderRadius: 8,
  },
  priceInput: {
    marginLeft: 40,
    height: 40,
    width: 120,
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#000',
  },
  updateInput: {
    height: 35,
    width: 120,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
  },
  Card: {
    height: 150,
    width: 350,
    padding: 8,
    margin: 5,
    borderRadius: 10,
  },
  ShadowProps: {
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#E2E2E2',
    shadowOffset: {width: 4, height: 6},
    shadowColor: '#CECECE',
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  Button2: {
    height: 35,
    width: 100,
    fontSize: 12,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    margin: 3,
    padding: 4,
  },
  card2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceButton: {
    backgroundColor: '#24D14A',
    height: 30,
    padding: 3,
    width: 80,
  },
  footerContainer: {
    height: 120,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E9E9E9',
    marginBottom: 10,
    color: '#000',
  },
  CommisionText: {
    height: 30,
    width: 80,
    padding: 2,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
    color: '#000',
  },
});

export default NewBills;
