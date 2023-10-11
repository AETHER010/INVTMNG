import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {Api_Url} from '../../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [userRoles, setUserRoles] = useState('');

  const [page, setPage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      getUserRole();
    }, [userRoles]),
  );

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRoles(role);
    console.log('role of user', role);
    if (role === 'superadmin' || role === 'admin') {
      fetchApiData();
    } else {
      Alert.alert('Access Denied', 'You cannot access user data.');
    }
  };

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/list/user/?page=${page}&page_size=10`,
      );
      setData(prevData => [...prevData, ...response.data.data]);
      setFilteredData(prevFilteredData => [
        ...prevFilteredData,
        ...response.data.data,
      ]);
      setPage(page + 1);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUnblock = async username => {
    // Show an alert to confirm the action
    Alert.alert(
      'Confirm Unblock',
      `Are you sure you want to unblock ${username}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              await axios.post(
                `${Api_Url}/accounts/apis/unblock/user/${username}`,
              );
            } catch (error) {
              console.error('Error updating data:', error);
            } finally {
              console.log('...');
            }
            fetchApiData();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleBlock = async username => {
    // Show an alert to confirm the action
    Alert.alert(
      'Confirm Block',
      `Are you sure you want to block ${username}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          onPress: async () => {
            try {
              await axios.post(
                `${Api_Url}/accounts/apis/block/user/${username}`,
              );
            } catch (error) {
              console.error('Error updating data:', error);
            } finally {
              console.log('Successfully blocked');
            }
            fetchApiData();
          },
        },
      ],
      {cancelable: false},
    );
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
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        item =>
          item.username &&
          item.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const handleEndReached = () => {
    fetchApiData(); // Fetch more data when scrolled to the end
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          style={styles.icon}
          name="arrow-back"
          onPress={() => navigation.navigate('Home2')}
        />
        <Text style={styles.headerText}>Users</Text>
        <Icon
          style={styles.icon}
          name="person-circle-outline"
          onPress={() => navigation.navigate('UserProfile')}
        />
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
          buttonStyle={styles.createButton}
          title="+ Create"
          onPress={() => navigation.navigate('NewUser')}
        />
      </View>

      <FlatList
        style={{marginTop: 8}}
        data={filteredData}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <View style={[styles.card, styles.shadowProps]}>
              <View style={styles.cardHeader}>
                <Text style={styles.usernameText} numberOfLines={1}>
                  Username: {item.username}
                </Text>
                {item.is_blocked ? (
                  <Button
                    buttonStyle={[styles.button2, {backgroundColor: '#3A39A0'}]}
                    title="Unlock"
                    onPress={() => handleUnblock(item.username)}
                  />
                ) : (
                  <Button
                    buttonStyle={[styles.button2, {backgroundColor: 'red'}]}
                    title="Block"
                    onPress={() => handleBlock(item.username)}
                  />
                )}
              </View>
              <Text style={{fontSize: 16, paddingTop: 6, color: '#000'}}>
                Role: {item.role}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.billid}
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
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: 10,
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    color: '#fff',
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
  createButton: {
    marginTop: 12,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    width: '95%',
    padding: 6,
  },
  shadowProps: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usernameText: {
    flex: 1,
    fontSize: 20,
    color: '#000',
    marginRight: 8,
    overflow: 'hidden',
  },
  button2: {
    fontSize: 12,
    color: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
});

export default User;
