import {View, Text, StyleSheet, TextInput} from 'react-native';

import {useState, useEffect} from 'react';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Api_Url} from '../../../utilities/api';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';

const PaymentClient = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchApiDataCustomer();
    }, []),
  );

  // useEffect(() => {
  //   fetchApiDataCustomer();
  //   // const apidate = data.created_date;
  //   // const formattedDate = moment(apidate).format('YYYY-MM-DD');
  //   // setFormattedDate(formattedDate);
  //   // console.log('formated', formattedDate);
  // }, []);

  const fetchApiDataCustomer = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/payment/apis/customer-payments/`,
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.clientContainer}>
      <View style={styles.SecondContainer}>
        <View style={styles.Search}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#888"
          />
          <Icon
            name="search"
            size={24}
            color="#888"
            style={styles.searchIcon}
          />
        </View>
        <Button
          buttonStyle={styles.Button}
          title="+ Create"
          onPress={() => navigation.navigate('NewPaymentClient')}
        />
      </View>
      {data.length === 0 ? (
        <Text style={styles.noDataText}>No Data Available</Text>
      ) : (
        data.map((item, index) => (
          <View
            key={index}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.Card, styles.ShadowProps]}>
              <View style={styles.card2}>
                <Text style={{fontSize: 18, color: '#000'}}>
                  {item.customer}
                </Text>

                {/* <Text style={{fontSize: 18, color: '#000'}}>
                      {formattedate}
                    </Text> */}
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: 18, color: '#000'}}>Amount:</Text>
                <Text style={{fontSize: 18, color: '#008000'}}>
                  {item.amount}
                </Text>
              </View>

              <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                Remarks : {item.remarks}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  SecondContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  Search: {
    marginTop: 10,
    flexDirection: 'row',
    // justifyContent: "space-evenly",
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    width: 220,
    borderRadius: 9,
    borderBlockColor: '#3A39A0',
  },
  input: {
    margin: 2,
    padding: 7,
    width: 170,
  },
  searchIcon: {
    borderLeftWidth: 2,
    borderLeftColor: '#3A39A0',
    paddingLeft: 6,
    marginLeft: 8,
    color: '#3A39A0',
  },
  Button: {
    marginTop: 12,
    height: 40,
    width: 80,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
  },
  Card: {
    borderRadius: 10,
    width: 380,
    padding: 8,
    margin: 8,
  },
  ShadowProps: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    shadowOffset: {width: 4, height: 6},
    shadowColor: '#CECECE',
    shadowOpacity: 0.8,
    shadowRadius: 3,
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
});

export default PaymentClient;
