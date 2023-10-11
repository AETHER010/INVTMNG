import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {Api_Url} from '../../../utilities/api';

const PaymentClient = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [cumDate, setCumDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      fetchApiDataCustomer();
    }, []),
  );

  const fetchApiDataCustomer = async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    setLoading(true);

    try {
      const response = await axios.get(
        `${Api_Url}/payment/apis/customer-payments/?page=${page}&page_size=10`,
      );

      const newPageData = response.data.data;
      setData(prevData => [...prevData, ...newPageData]);
      setPage(page + 1);

      if (newPageData.length > 0) {
        const date = newPageData[0].created_date;
        const formattedDate = moment(date).format('YYYY-MM-DD');
        setCumDate(formattedDate);
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    filterData();
  }, [data, searchQuery]);

  const filterData = async () => {
    if (searchQuery.trim() === '') {
      // If the search query is empty, display all data
      setFilteredData(data);
    } else {
      const response = await axios.get(
        `${Api_Url}/payment/apis/customer-payments/?search=${encodeURIComponent(
          searchQuery,
        )}`,
      );

      const filtered = response.data.data;
      setFilteredData(filtered);
    }
  };

  const handleRefresh = () => {
    if (loading) return; // Prevent refreshing while loading
    setRefreshing(true);
    fetchApiDataCustomer();
  };

  const handleEndReached = () => {
    fetchApiDataCustomer(); // Fetch more data when scrolled to the end
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
            onChangeText={text => {
              setSearchQuery(text);
              filterData();
            }}
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
      <FlatList
        data={filteredData}
        renderItem={({item, index}) => (
          <View key={index} style={{}}>
            <View style={[styles.Card, styles.ShadowProps]}>
              <View style={styles.card2}>
                <Text style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}>
                  {item.customer_name}
                </Text>
                <Text style={{fontSize: 14, color: '#000'}}>{cumDate}</Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: 18, color: '#000'}}>Amount:</Text>
                <Text style={{fontSize: 18, color: '#008000'}}>
                  Rs. {item.amount}
                </Text>
              </View>
              <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                Remarks : {item.remarks}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()} // Convert id to string
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={<View style={{height: 350}} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default PaymentClient;
