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
import React from 'react';
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
  const [chargeBillId, setChargeBillId] = useState('');

  const [unConfirmProducts, setUnConfirmProducts] = useState([]);

  const [grandTotal, setGrandTotal] = useState('');

  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState([]);

  const [viewProduct, setViewProduct] = useState('false');
  const [newPrice, setNewPrice] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const [commission, setCommission] = useState('');
  const [subTotal, setSubTotal] = useState('');

  const [lastPurchase, setLastPurchase] = useState('');
  const [customerPrice, setCustomerPrice] = useState('');
  const [sdPrice, setSdPrice] = useState('');
  const [stock, setStock] = useState('');

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
      // Alert.alert('Error', 'An error occurred while fetching data.');
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
      // console.log('API responsed after form submission:', response.data);
      gettingSupplierProducts(supplierId);
      setQuantity('');
      setPrice('');
      Alert.alert('Success', 'Product added successfully!');
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while submitting data.');
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
      // Alert.alert('Error', 'An error occurred while retreving data.');
    }
    gettingSupplierProducts(selectedData.pk);
  };

  const handlePriceSelection = async index => {
    const selectedProduct = product[index];
    const selectedId = selectedProduct.pk;
    setProductId(selectedId);
    setStock(selectedProduct.stock);

    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/suppliers/products/price/${supplierId}/${selectedProduct.pk}`,
      );
      console.log('upcofirm response454:', response.data.customerprice);
      setCustomerPrice(response.data.customerprice);
      setLastPurchase(response.data.lastpurchaseprice);
      setSdPrice(response.data.standardprice);
      if (response.data.customerprice === 'Na') {
        setPrice(response.data.standardprice);
      } else {
        setPrice(response.data.customerprice);
      }
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while retreving data.');
    }
  };

  const gettingSupplierProducts = async id => {
    console.log('Product issues bills', id);
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/unconfirm-bill/${id}/`,
      );
      console.log('API response for unconfirm products:', response.data.data);
      setGrandTotal(response.data.data.total_price);
      setCommission(response.data.data.charge_percentage);
      setChargeBillId(response.data.data.id);
      setSubTotal(response.data.data.sub_total);

      const apiData = response.data.data;
      const items = apiData.unconfirmsalesbill_item || [];
      setBillId(apiData.id);

      setUnConfirmProducts(items);
      // console.log('Product issues bills', unConfirmProducts);
    } catch (error) {
      console.error('API error:', error);
      // Alert.alert('Error', 'An error occurred while getting Product data.');
    }
  };

  const handleIssueBill = async () => {
    Alert.alert(
      'Confirm Issuance',
      'Are you sure you want to issue this bill?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Issue',
          onPress: async () => {
            try {
              await axios.post(
                `${Api_Url}/bill/apis/sales/issue-bill/${billId}/`,
              );
              Alert.alert('Success', 'Bill Issued Successfully');
              navigation.navigate('Bills');
            } catch (error) {
              console.error('API error:', error);
              // Alert.alert('Error', 'An error occurred while Issuing Bill.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    console.log('selectedUpdate:', selectedUpdate);
    setNewPrice(selectedUpdate.per_unit_price);
    setNewQuantity(selectedUpdate.quantity);
  }, [selectedUpdate]);

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
  };

  const handleDeleteProduct = async id => {
    Alert.alert('Confirmation', 'Are you sure you want to delete this bill?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await axios.delete(
              `${Api_Url}/bill/apis/sales/update-delete-unconfirm-bill/${id}/`,
            );
            gettingSupplierProducts(supplierId);
          } catch (error) {
            console.error('API error:', error);
          }
        },
      },
    ]);
  };

  const handleUpdateProduct = async id => {
    const formData = {
      quantity: newQuantity,
      per_unit_price: newPrice,
    };

    console.log(formData);

    try {
      await axios.put(
        `${Api_Url}/bill/apis/sales/update-delete-unconfirm-bill/${id}/`,
        formData,
      );
      Alert.alert('Success', 'Product Updated Successfully');
      gettingSupplierProducts(supplierId);
      setAction('false');
      setViewProduct('false');
    } catch (error) {
      console.error('API error:', error);
      // console.error('Error response:', error.response);
      // Alert.alert('Error', 'An error occurred while Updaing product.');
    }
  };

  const handleIssuCharge = async () => {
    console.log(chargeBillId, 'cbascks');
    const formData = {
      charge: commission,
    };

    console.log(commission);

    try {
      await axios.post(
        `${Api_Url}/bill/apis/sales/charge/${chargeBillId}/`,
        formData,
      );
      Alert.alert('Success', 'Charge Added Successfully');
      gettingSupplierProducts(supplierId);
    } catch (error) {
      console.error('API error:', error);
      // console.error('Error response:', error.response);
      // Alert.alert('Error', 'An error occurred while addin product.');
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
          <Text style={styles.text}>Sales</Text>
          <Icon2
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}></Icon2>
        </View>
      </View>
      <View style={styles.formContainer}>
        <View
          style={{
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // justifyContent: 'space-between',
            padding: 5,
            marginTop: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Customer:</Text>
            <ModalDropdown
              style={styles.Input}
              defaultValue="Select Customer..."
              options={supplier.map(item => item.name)}
              onSelect={index => {
                handleProductSelection(index);
              }}
              defaultIndex={0}
              animated={true}
              isFullWidth={true}
              textStyle={styles.dropdownText}
              showsVerticalScrollIndicator={true}
              dropdownTextStyle={styles.dropdownText}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Product:</Text>
            {product.length > 0 ? (
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
            ) : (
              <Text style={styles.productInput}>Select product...</Text>
            )}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Quantity:</Text>
            <View
              style={{
                flexDirection: 'column',
                width: '70%',
              }}>
              <TextInput
                style={styles.Input9}
                value={quantity}
                onChangeText={setQuantity}
              />
              <Text style={{color: 'black', fontSize: 12}}>Stock: {stock}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={styles.label}>Cost Price:</Text>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <TextInput
                  style={styles.priceInput}
                  value={price !== null ? price.toString() : ''}
                  onChangeText={setPrice}
                  editable={true}
                />
                <Text style={{color: 'black', fontSize: 12}}>
                  CP: {customerPrice} LPP: {lastPurchase} SP: {sdPrice}
                </Text>
              </View>
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
                    textAlign: 'center',
                    fontSize: 20,
                    margin: 5,
                  }}>
                  Products Not Selected.
                </Text>
              ) : (
                unConfirmProducts.map((item, index) => (
                  <View
                    key={index}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={[styles.Card, styles.ShadowProps]}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontWeight: 'bold',
                        }}>
                        {item.product_name}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, color: '#000'}}>
                          Cost Price:
                        </Text>

                        {action === 'false' ? (
                          <View>
                            <Text style={{fontSize: 16, color: '#000'}}>
                              {item.per_unit_price}
                            </Text>
                          </View>
                        ) : (
                          <TextInput
                            style={[styles.updateInput, {color: '#000'}]}
                            value={updatedPrice}
                            onChangeText={setUpdatedPrice}
                            editable={true}
                          />
                        )}
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, color: '#000'}}>
                          Quantity:
                        </Text>
                        {action === 'false' ? (
                          <Text style={{fontSize: 18, color: '#000'}}>
                            {item.quantity}
                          </Text>
                        ) : (
                          <TextInput
                            style={[styles.updateInput, {color: '#000'}]}
                            value={updatedQuantity}
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
                      value={newPrice ? newPrice.toString() : ''}
                      onChangeText={text => setNewPrice(text)}
                      editable={true}
                    />
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 4}}>
                    <Text style={{fontSize: 18, color: '#000', padding: 3}}>
                      quantity:
                    </Text>

                    <TextInput
                      style={[styles.updateInput, {color: '#000'}]}
                      value={newQuantity ? newQuantity.toString() : ''}
                      onChangeText={text => setNewQuantity(text)}
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
          <Text style={{color: 'black', marginBottom: 5}}>
            Sub Total:{subTotal}{' '}
          </Text>
          <View style={{color: 'black', flexDirection: 'row'}}>
            <Text style={{color: 'black', marginTop: 3}}>Commission:</Text>
            <TextInput
              style={styles.CommisionText}
              onChangeText={setCommission}>
              {commission}
            </TextInput>
            <Text style={{color: 'black', marginTop: 3}}>% </Text>
            <Icon
              style={styles.Button3}
              name="check-circle"
              onPress={handleIssuCharge}
              size={20}
            />
          </View>

          <Text
            style={{
              fontSize: 16,
              paddingTop: 6,
              color: '#000',
              fontWeight: 'bold',
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
    paddingVertical: 5,
    color: '#000',
  },
  Input: {
    height: 40,
    width: '70%',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000',
  },
  productInput: {
    height: 40,
    width: '70%',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
    color: '#000',
    fontSize: 18,
  },
  Input9: {
    height: 40,
    width: '100%',
    borderWidth: 2,
    borderColor: '#CED4DA',
    borderRadius: 4,
    paddingHorizontal: 8,

    color: '#000',
  },
  Button2: {
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#000',
    borderRadius: 10,
    padding: 9,
    fontSize: 18,
    paddingHorizontal: 18,
  },
  Button3: {
    height: 30,
    width: 30,
    fontSize: 25,
    borderColor: '#0000FF',
    borderWidth: 1,
    color: '#008000',
    borderRadius: 5,
    textAlign: 'center',
    paddingTop: 2,
  },
  Icons2: {
    color: '#FFF',
    fontSize: 25,
    padding: 4,
    marginLeft: 5,
    borderRadius: 8,
  },
  priceInput: {
    marginLeft: 22,
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
    width: 380,
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
    width: 60,
    padding: 2,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
    color: '#000',
  },
});

export default NewBills;
