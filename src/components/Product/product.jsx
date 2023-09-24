import axios from 'axios';
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

const Product = ({navigation}) => {
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
      const response = await axios.get(`${Api_Url}/products/apis/products`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (index, pk) => {
    navigation.navigate('NewProduct', {index, pk});
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setRefreshing(true);

    setRefreshing(true);
    fetchApiData();
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
    <View>
      <View style={styles.ProductContainer}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Icon
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('Home2')}
          />
          <Text style={styles.text}>Product</Text>
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
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <Icon
            name="search"
            size={24}
            color="#000"
            style={styles.searchIcon}
            // onPress={text => setSearchQuery(text)}
          />
        </View>
        <Button
          buttonStyle={styles.Button}
          title="+ Create"
          onPress={() => navigation.navigate('NewProduct')}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          filteredData.map((item, index) => (
            <View
              key={index}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.Card, styles.ShadowProps]}>
                <View style={styles.card2}>
                  <Text style={{fontSize: 18, color: '#000'}}>
                    Product Id: {item.pk}
                  </Text>
                  <Text style={{fontSize: 12, color: '#000'}}>
                    Stock: {item.pk}
                  </Text>
                </View>
                <Text style={{fontSize: 18, color: '#000'}}>{item.name}</Text>
                <View style={styles.card2}>
                  <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                    Selling Price: RS {item.standard_price}
                  </Text>
                  <Button
                    buttonStyle={styles.Button2}
                    onPress={() => handleUpdate(index, item.pk)}
                    title="View Detaiils"
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ProductContainer: {
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
    color: '#000',
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
  Button2: {
    height: 35,
    width: 120,
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
});

export default Product;
