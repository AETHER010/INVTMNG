import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';

const ViewPurchase = ({navigation, route}) => {
  const id = route.params.id;
  const [apiData, setApiData] = useState([]);
  const [suplier, setSupplier] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState('');
  const [grandTotal, setGrandTotal] = useState('');

  useEffect(() => {
    fetchApiData(id);
    setData(apiData.bill_items);
    console.log('id', apiData);
  }, []);

  const fetchApiData = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/purchase/bills/details/${id}`,
      );
      setApiData(response.data.bill_items);
      setGrandTotal(response.data.grand_total);
      setSupplier(response.data.suppliers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Icon
        name="close"
        size={28}
        style={styles.minimizeIcon}
        onPress={() => navigation.navigate('Purchase')}
      />
      <Text style={styles.title}>{suplier}</Text>
      <ScrollView>
        {loading ? (
          <Text
            style={{
              color: '#000',
              justifyContent: 'center',
              fontSize: 20,
              margin: 5,
            }}>
            Loading...
          </Text>
        ) : apiData === 0 ? (
          <Text>No unconfirmed products available!!!</Text>
        ) : (
          apiData.map((item, index) => (
            <View
              key={index}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.Card, styles.ShadowProps]}>
                <Text style={{fontSize: 18, color: '#000'}}>
                  {item.product}
                </Text>
                <Text style={{fontSize: 18, color: '#000'}}>
                  Cost Price :{item.per_unit_price}
                </Text>
                <Text style={{fontSize: 18, color: '#000'}}>
                  Quantity {item.quantity}
                </Text>

                <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                  Total Price: {item.total_price}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={{color: '#000'}}>Grand Total: {grandTotal}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  minimizeIcon: {
    color: '#000',
    margin: 5,
    textAlign: 'right',
  },
  Card: {
    height: 120,
    width: 350,
    padding: 8,
    margin: 14,
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
    marginTop: 5,
  },
  priceButton: {
    backgroundColor: '#24D14A',
    height: 30,
    padding: 3,
    width: 80,
  },
  footer: {
    backgroundColor: '#E9E9E9',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 90,
  },
});

export default ViewPurchase;
