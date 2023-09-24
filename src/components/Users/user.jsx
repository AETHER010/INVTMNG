import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Button} from 'react-native-elements';
import {Api_Url} from '../../utilities/api';

const User = ({navigation}) => {
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
        `${Api_Url}/accounts/apis/list/user/?page=1&page_size=100`,
      );
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUnblock = async username => {
    try {
      await axios.post(
        `https://ims.itnepalsoultions.com.pujanrajrai.com.np/accounts/apis/unblock/user/${username}`,
      );
      Alert.alert('Successfully unblock');
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      console.log('...');
    }
    fetchApiData();
  };

  const handleBlock = async username => {
    try {
      await axios.post(
        `https://ims.itnepalsoultions.com.pujanrajrai.com.np/accounts/apis/block/user/${username}`,
      );
      Alert.alert('Successfully Block');
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      console.log('Successfully block');
    }
    fetchApiData();
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setRefreshing(true);
    fetchApiData();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // useEffect(() => {
  //   filterData();
  // }, [data, searchQuery]);

  // const filterData = () => {
  //   if (searchQuery.trim() === '') {
  //     // If the search query is empty, display all data
  //     setFilteredData(data);
  //   } else {
  //     // Use the Array.filter method to filter data based on the search query
  //     const filtered = data.filter(item =>
  //       item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  //     );
  //     setFilteredData(filtered);
  //   }
  // };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View>
        <View style={styles.UserContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('Home2')}
            />
            <Text style={styles.text}>Users</Text>
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
            <Icon name="search" size={24} style={styles.searchIcon} />
          </View>
          <Button
            buttonStyle={styles.Button}
            title="+ Create"
            onPress={() => navigation.navigate('NewUser')}
          />
        </View>

        <View>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            data.map((item, index) => (
              <View
                key={index}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={[styles.Card, styles.ShadowProps]}>
                  {/* <Text style={{fontSize: 18, color: '#000'}}>
                    UserId:{item.pk}
                  </Text> */}

                  <View style={styles.card2}>
                    <Text style={{fontSize: 20, color: '#000'}}>
                      Username: {item.username}
                    </Text>
                    {item.is_blocked ? (
                      <Button
                        buttonStyle={[styles.Button2, {backgroundColor: 'red'}]}
                        title="Block"
                        onPress={() => handleUnblock(item.username)}
                      />
                    ) : (
                      <Button
                        buttonStyle={[
                          styles.Button2,
                          {backgroundColor: '#3A39A0'},
                        ]}
                        title="Unblock"
                        onPress={() => handleBlock(item.username)}
                      />
                    )}
                  </View>
                  <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                    Role: {item.role}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  UserContainer: {
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
  Button: {
    margin: 12,
    height: 40,
    width: 80,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
  },
  Card: {
    width: 370,
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
    width: 90,
    fontSize: 12,
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 4,
  },
  card2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
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
  },
  searchIcon: {
    borderLeftWidth: 2,
    borderLeftColor: '#3A39A0',
    paddingLeft: 6,
    marginLeft: 8,
    color: '#3A39A0',
  },
});

export default User;
