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
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card} from 'react-native-elements';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';

const Supplier = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/suppliers?search=`,
      );
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async pk => {
    navigation.navigate('NewSupplier', {pk});
  };

  const handlEnable = async pk => {
    console.log('jfgvasjkf', pk);
    try {
      const response = await axios.post(
        `${Api_Url}/accounts/apis/suppliers/enable/${pk}/`,
      );
      Alert.alert('User enabled successfully');
      fetchApiData();
    } catch (error) {
      console.log('error', error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async pk => {
    console.log('jfgvasjkf', pk);
    try {
      const response = await axios.post(
        `${Api_Url}/accounts/apis/suppliers/disable/${pk}/`,
      );
      Alert.alert('User disabled successfully');
      fetchApiData();
    } catch (error) {
      console.log('error', error.response.data);
    } finally {
      setLoading(false);
    }
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

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View>
        <View style={styles.SupplierContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('Home2')}
            />
            <Text style={styles.text}>Supplier</Text>
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
            onPress={() => navigation.navigate('NewSupplier')}
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
                <View style={styles.card2}>
                  <Text
                    style={{fontSize: 18, color: '#000', fontWeight: 'bold'}}>
                    {item.name}
                  </Text>
                  {item.is_blocked ? (
                    <Icon2
                      name="lock-open-variant-outline"
                      size={18}
                      color="#ff0000"
                      style={styles.sideIcon}
                      onPress={() => handlEnable(item.pk)}
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
                </View>
                <View style={styles.card2}>
                  <Text style={{fontSize: 18, color: '#000', marginTop: 6}}>
                    Phone Number: {item.contact_number}
                  </Text>
                  <Icon2
                    name="square-edit-outline"
                    size={18}
                    color="#000"
                    style={styles.sideIcon2}
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
    // height: 40,
    // width: 40,
    margin: 10,
    fontSize: 35,
  },
  SecondContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // height: 100,
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
    height: 30,
    width: 30,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 2,
    padding: 8,
    justifyContent: 'center',
  },
  card2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sideIcon: {
    // color: "red",s
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 9,
    borderColor: '#FF0000',
    borderWidth: 0.5,
  },
  sideIcon2: {
    // color: "red",s
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 9,
    borderWidth: 0.5,
    borderColor: '#3A39A0',
  },
});

export default Supplier;
