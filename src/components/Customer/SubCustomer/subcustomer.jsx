import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Api_Url} from '../../../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';

const SubCustomer = ({navigation, route}) => {
  // const Api_Url = 'http://192.168.1.70:8000';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [subCid, setSubCid] = useState(route.params?.id || null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Check if scid is null, and if so, try to retrieve it from AsyncStorage
      if (subCid === null) {
        retrieveScidFromStorage();
      } else {
        // Save the retrieved scid to AsyncStorage
        saveScidToStorage(subCid);
        fetchApiData(subCid);
      }
    }, [subCid]),
  );

  // Function to retrieve scid from AsyncStorage
  const retrieveScidFromStorage = async () => {
    try {
      const storedScid = await AsyncStorage.getItem('SubCid');
      if (storedScid !== null) {
        setSubCid(storedScid);
      }
    } catch (error) {
      console.error('Error retrieving scid:', error);
    }
  };

  // Function to save scid to AsyncStorage
  const saveScidToStorage = async value => {
    try {
      await AsyncStorage.setItem('subCid', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving subCid:', error);
    }
  };

  const fetchApiData = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/subcustomer/${id}`,
      );
      setData(response.data.data);
      console.log(response.data.data, 'asdghfvajshdfv');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationSC = async () => {
    navigation.navigate('NewSubCustomer');
  };

  const handleEnable = async pk => {
    try {
      await axios.post(`${Api_Url}/accounts/apis/subcustomer/enable/${pk}/`);
      Alert.alert('User enabled successfully');
      fetchApiData(route.params.id);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async pk => {
    try {
      await axios.post(`${Api_Url}/accounts/apis/subcustomer/disable/${pk}/`);
      Alert.alert('User disabled successfully');
      fetchApiData(route.params.id);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = id => {
    console.log('navigation', id);
    navigation.navigate('PriceList', {id});
  };

  const handleUpdate = async scid => {
    navigation.navigate('NewSubCustomer', {scid});
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setRefreshing(true);
    fetchApiData(subCid);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    filterData();

    console.log('fasdfbsakdf', filteredData);
  }, [data, searchQuery]);

  const filterData = () => {
    console.log('NewProduct', searchQuery);
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

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View>
        <View style={styles.CustomerContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('Customer')}
            />
            <Text style={styles.text}>Sub Customer</Text>
            <Icon style={styles.Icons} name="person-circle-outline"></Icon>
          </View>
        </View>
        <View style={styles.SecondContainer}>
          <View style={styles.Search}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="#000"
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
            onPress={handleNavigationSC}
          />
        </View>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          filteredData.map((item, index) => (
            <View
              key={index}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.Card, styles.ShadowProps]}>
                <View style={styles.card3}>
                  <Text
                    style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}>
                    {item.name}
                  </Text>
                  <Button
                    buttonStyle={styles.priceButton}
                    title="Price List"
                    onPress={() => handleNavigation(item.pk)}
                  />
                </View>
                <Text style={{fontSize: 16, color: '#000', marginTop: 5}}>
                  Phone Number: {item.contact_number}
                </Text>
                <View style={styles.card2}>
                  {item.is_blocked === true ? (
                    <Icon2
                      name="lock-open-variant-outline"
                      size={18}
                      color="#ff0000"
                      style={styles.sideIcon}
                      onPress={() => handleEnable(item.pk)}
                    />
                  ) : (
                    <Icon2
                      name="block-helper"
                      size={18}
                      color="#ff0000"
                      style={styles.sideIcon}
                      onPress={() => handleDisable(item.pk)}
                    />
                  )}
                  <Icon2
                    name="square-edit-outline"
                    size={18}
                    color="#fff"
                    style={styles.sideIcon}
                    onPress={() => handleUpdate(item.pk)}
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
    width: 380,
    padding: 8,
    margin: 8,
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
    justifyContent: 'flex-end',
  },
  card3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  priceButton: {
    backgroundColor: '#3A39A0',
    height: 30,
    padding: 3,
    width: 80,
    borderRadius: 8,
  },
  sideIcon: {
    // color: "red",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A39A0',
    padding: 5,
    borderRadius: 9,
    margin: 3,
  },
});

export default SubCustomer;
