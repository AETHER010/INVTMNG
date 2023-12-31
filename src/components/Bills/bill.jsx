import {useEffect, useState} from 'react';
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
import moment from 'moment';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Api_Url} from '../../utilities/api';

const Bills = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState('');
  const [formattedate, setFormattedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      fetchApiData();
      const apidate = data.created_date;
      const formattedDate = moment(apidate).format('YYYY-MM-DD');
      setFormattedDate(formattedDate);
    }, []),
  );

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/sales/bills/list?page=${page}&page_size=10`,
      );
      setData(prevData => [...prevData, ...response.data.data]);
      setFilteredData(prevFilteredData => [
        ...prevFilteredData,
        ...response.data.data,
      ]);
      setPage(page + 1);
      // setData(response.data.data);
      // setFilteredData(response.data.data);
      // console.log('formated adfafa', response.data.data);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async id => {
    navigation.navigate('ViewBills', {id});
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setRefreshing(true);
    fetchApiData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    filterData();
  }, [data, searchQuery]);

  const filterData = () => {
    console.log(searchQuery, 'asjdfkasdfk');
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        item =>
          item.customer &&
          item.customer.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
      // console.log(filtered, 'asjdfkasdfk');
    }
  };

  const handleEndReached = () => {
    fetchApiData(); // Fetch more data when scrolled to the end
  };

  return (
    <View>
      <View>
        <View style={styles.PurchaseContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('Home2')}
            />
            <Text style={styles.text}>Sales</Text>
            <Icon
              style={styles.Icons}
              name="person-circle-outline"
              onPress={() => navigation.navigate('UserProfile')}></Icon>
          </View>
        </View>
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
            onPress={() => navigation.navigate('NewBills')}
          />
        </View>
        <View>
          <FlatList
            data={filteredData}
            renderItem={({item, index}) => (
              <View
                key={index}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={[styles.Card, styles.ShadowProps]}>
                  <View style={styles.card2}>
                    <Text style={{fontSize: 18, color: '#000'}}>
                      Id: {item.billid}
                    </Text>

                    <Text style={{fontSize: 14, color: '#000'}}>
                      {formattedate}
                    </Text>
                  </View>
                  <Text style={{fontSize: 18, color: '#000', paddingTop: 3}}>
                    {item.customer}
                  </Text>
                  <View style={styles.card2}>
                    <Text style={{fontSize: 16, paddingTop: 4, color: '#000'}}>
                      Total Amount: {item.grandtotal}
                    </Text>
                    <Button
                      buttonStyle={styles.Button2}
                      title="View Details"
                      onPress={() => handleUpdate(item.billid)}
                    />
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item.billid}
            onEndReached={handleEndReached} // Triggered when the user reaches the end
            onEndReachedThreshold={0.1} // Adjust this threshold as needed
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListFooterComponent={<View style={{height: 450}} />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PurchaseContainer: {
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
    // height: 40,
    // width: 40,
    margin: 10,
    fontSize: 35,
  },
  SecondContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  Search: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 40,
    borderRadius: 9,
    borderBlockColor: '#3A39A0',
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
  Button2: {
    fontSize: 12,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    margin: 3,
    padding: 6,
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
});

export default Bills;
