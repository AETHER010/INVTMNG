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
import {useFocusEffect} from '@react-navigation/native';
import {Api_Url} from '../../utilities/api';
import React from 'react';

const Customer = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  useFocusEffect(
    React.useCallback(() => {
      fetchApiData();
    }, []),
  );

  // useEffect(() => {
  //   fetchApiData();
  // }, []);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/customer?page=${page}&page_size=10`,
      );
      setData(prevData => [...prevData, ...response.data.data]);
      setFilteredData(prevFilteredData => [
        ...prevFilteredData,
        ...response.data.data,
      ]);
      setPage(page + 1);
      // setData(response.data.data);
      // setFilteredData(response.data.data);
      // console.log(response.data);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async pk => {
    navigation.navigate('NewCustomer', {pk});
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
    if (searchQuery.trim() === '') {
      // If the search query is empty, display all data
      setFilteredData(data);
    } else {
      // Use the Array.filter method to filter data based on the search query
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const handlesubcustomer = async id => {
    navigation.navigate('SubCustomer', {id});
  };

  const handleEndReached = () => {
    fetchApiData(); // Fetch more data when scrolled to the end
  };

  return (
    <View style={{flex: 1}}>
      <View>
        <View style={styles.CustomerContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('Home2')}
            />
            <Text style={styles.text}>Customer</Text>
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
            onPress={() => navigation.navigate('NewCustomer')}
          />
        </View>

        <FlatList
          data={filteredData}
          renderItem={({item, index}) => (
            <View
              key={index}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.Card, styles.ShadowProps]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}>
                    {item.name}
                  </Text>
                  <Button
                    buttonStyle={styles.Button3}
                    title="Sub Customer"
                    onPress={() => handlesubcustomer(item.pk)}
                  />
                </View>
                <View style={styles.card2}>
                  <Text style={{fontSize: 14, color: '#000', marginTop: 2}}>
                    Phone Number: {item.contact_number}
                  </Text>
                  <Button
                    buttonStyle={styles.Button2}
                    title="View Detaiils"
                    onPress={() => handleUpdate(item.pk)}
                  />
                </View>
                <Text style={{fontSize: 14, color: '#000', marginTop: 2}}>
                  Balance: {item.last_balance}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.billid}
          onEndReached={handleEndReached} // Triggered when the user reaches the end
          onEndReachedThreshold={0.1} // Adjust this threshold as needed
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CustomerContainer: {
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
    color: '#888',
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
    width: '92%',
    padding: 8,
    margin: 14,
    borderRadius: 10,
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
  Button3: {
    height: 35,
    width: 110,
    fontSize: 12,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
    fontSize: 18,
    marginLeft: 8,
  },
});

export default Customer;
