import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Api_Url} from '../../utilities/api';
import axios from 'axios';
import Supplier from './Supplier/supplier';
import Client from './Client/client';

const Payment = ({navigation}) => {
  const [data, setData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState('');
  const [formattedate, setFormattedDate] = useState('');
  const [action, setAction] = useState('supplier');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setAction('supplier');
  }, []);

  const changeCustomer = () => {
    setAction('client');
  };

  const changeSupplier = () => {
    setAction('supplier');
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View>
      <View style={styles.PaymentContainer}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Icon
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('Home2')}
          />
          <Text style={styles.text}>Payment</Text>
          <Icon style={styles.Icons} name="person-circle-outline"></Icon>
        </View>
        <View style={styles.division}>
          <Text
            style={[styles.text1, action === 'supplier' && styles.selectedText]}
            onPress={changeSupplier}>
            Supplier
          </Text>
          <View style={styles.text2}></View>
          <Text
            style={[styles.text1, action !== 'supplier' && styles.selectedText]}
            onPress={changeCustomer}>
            Clients
          </Text>
        </View>
      </View>
      {/* <View style={styles.SecondContainer}>
          <View style={styles.Search}>
            <TextInput style={styles.input} placeholder="Search..." />
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
            onPress={() => navigation.navigate('NewPayment')}
          />
        </View> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View>
          {action === 'supplier' ? <Supplier Api_Url={Api_Url} /> : <Client />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  PaymentContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 100,
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
  division: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text1: {
    fontSize: 24,
    color: '#fff',
  },
  text2: {
    borderRightWidth: 2,
    borderRightColor: '#FFF',
  },
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
    height: 110,
    width: 350,
    padding: 8,
    margin: 14,
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
  selectedText: {
    color: '#000',
  },
});

export default Payment;
