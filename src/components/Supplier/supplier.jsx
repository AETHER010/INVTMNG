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

const Supplier = ({navigation}) => {
  const Api_ULR = 'https://ims.itnepalsoultions.com.pujanrajrai.com.np';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_ULR}/accounts/apis/suppliers?search=`,
      );
      setData(response.data.data);
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
    try {
      const response = await axios.post(
        `${Api_ULR}/accounts/apis/suppliers/enable/${pk}`,
      );
      Alert.alert('User enabled successfully');
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async pk => {
    try {
      const response = await axios.post(
        `${Api_ULR}/accounts/apis/suppliers/disable/${pk}`,
      );
      Alert.alert('User disabled successfully');
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
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
            color="#000"
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          data.map((item, index) => (
            <View
              key={index}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.Card, styles.ShadowProps]}>
                <View style={styles.card2}>
                  <Text style={{fontSize: 18, color: '#000'}}>{item.name}</Text>
                  {item.is_blocked ? (
                    <Icon2
                      name="lock-open-variant-outline"
                      size={18}
                      color="#ff0000"
                      style={styles.sideIcon}
                      onPress={handlEnable}
                    />
                  ) : (
                    <Icon2
                      name="block-helper"
                      size={18}
                      color="#ff0000"
                      style={styles.sideIcon}
                      onPress={handleDisable}
                    />
                  )}
                </View>
                <Text style={{fontSize: 18, color: '#000', marginTop: 6}}>
                  Phone Number {item.contact_number}
                </Text>
                <View style={styles.card2}>
                  <Text
                    style={{fontSize: 16, paddingTop: 6, color: '#000'}}></Text>
                  <Icon2
                    name="square-edit-outline"
                    size={20}
                    color="#fff"
                    style={styles.sideIcon}
                    onPress={() => handleUpdate(item.pk)}
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
  SupplierContainer: {
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
    height: 120,
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
    // color: "red",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A39A0',
    padding: 3,
    borderRadius: 9,
  },
});

export default Supplier;
