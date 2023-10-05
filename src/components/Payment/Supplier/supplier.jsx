import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  RefreshControl,
  FlatList,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Api_Url} from './../../../utilities/api';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const PaymentSupplier = () => {
  const navigation = useNavigation();
  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [supDate, setSupDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      fetchApiDatSupplier();
    }, []),
  );

  const fetchApiDatSupplier = async () => {
    if (loading) return; // If already loading data, return early

    try {
      setLoading(true);
      const response = await axios.get(
        `${Api_Url}/payment/apis/seller-payments/?page=${page}&page_size=10`,
      );
      setSupplierData(prevData => [...prevData, ...response.data.data]);
      setFilteredData(prevFilteredData => [
        ...prevFilteredData,
        ...response.data.data,
      ]);
      setPage(page + 1);
      const date = response.data.data.created_date;
      const formattedDate = moment(date).format('YYYY-MM-DD');
      setSupDate(formattedDate);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterData();
  }, [supplierData, searchQuery]);

  const filterData = () => {
    if (searchQuery.trim() === '') {
      setFilteredData(supplierData);
    } else {
      const filtered = supplierData.filter(
        item =>
          item.suppliers_name &&
          item.suppliers_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApiDatSupplier();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleEndReached = () => {
    fetchApiDatSupplier(); // Fetch more data when scrolled to the end
  };

  return (
    <View style={styles.container}>
      <View style={styles.SecondContainer}>
        <View style={styles.Search}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
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
          onPress={() => navigation.navigate('NewPaymentSupplier')}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 100,
            }}>
            <View style={[styles.Card, styles.ShadowProps]}>
              <View style={styles.card2}>
                <Text style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}>
                  {item.suppliers_name}
                </Text>

                <Text style={{fontSize: 14, color: '#000'}}>{supDate}</Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: 18, color: '#000'}}>Amount:</Text>
                <Text style={{fontSize: 18, color: '#FF0000'}}>
                  Rs. {item.amount}
                </Text>
              </View>

              <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                Remarks : {item.remarks}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.pk}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Make the main container flexible
    paddingBottom: 20,
  },
  SecondContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  Search: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    height: 40,
    width: 220,
    borderRadius: 9,
    borderColor: '#3A39A0',
  },
  input: {
    margin: 2,
    padding: 7,
    width: 170,
    color: '#000',
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
    width: '95%',
    padding: 8,
    margin: 8,
    borderWidth: 1,
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
});

export default PaymentSupplier;
