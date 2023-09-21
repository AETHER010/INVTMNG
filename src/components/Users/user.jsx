import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Button} from 'react-native-elements';
import {Api_Url} from '../../utilities/api';

const User = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApiData();
  }, [page]);

  const fetchApiData = async () => {
    console.log('page number', page);
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/list/user/?page=${page}&page_size=${limit}`,
      );
      setData(response.data.data);
      setTotalPages(Math.ceil(response.data.count / limit));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  return (
    <ScrollView>
      <View>
        <View style={styles.UserContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('Home2')}
            />
            <Text style={styles.text}>User</Text>
            <Icon
              style={styles.Icons}
              name="person-circle-outline"
              onPress={() => navigation.navigate('UserProfile')}></Icon>
          </View>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <Button
            buttonStyle={styles.Button}
            title="+ Create"
            onPress={() => navigation.navigate('NewUser')}
          />
        </View>
        <ScrollView>
          <View>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              data.map((item, index) => (
                <View
                  key={index}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={[styles.Card, styles.ShadowProps]}>
                    <Text style={{fontSize: 18, color: '#000'}}>
                      UserId:{item.pk}
                    </Text>

                    <View style={styles.card2}>
                      <Text style={{fontSize: 20, color: '#000'}}>
                        Username: {item.username}
                      </Text>
                      {item.is_blocked ? (
                        <Button
                          buttonStyle={[
                            styles.Button2,
                            {backgroundColor: 'red'},
                          ]}
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              buttonStyle={styles.Button}
              title="Previous"
              onPress={() => {
                if (page > 1) {
                  setPage(page - 1);
                  fetchApiData();
                }
              }}
            />
            <Button
              buttonStyle={styles.Button}
              title="Next"
              onPress={() => {
                if (page < totalPages) {
                  console.log('Next');
                  setPage(page + 1);
                  fetchApiData();
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  UserContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 109,
  },
  text: {
    fontSize: 34,
    color: '#FFFFFF',
    marginTop: 10,
  },
  Icons: {
    color: '#fff',
    // height: 40,
    // width: 40,
    margin: 10,
    fontSize: 45,
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
    height: 100,
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
});

export default User;
