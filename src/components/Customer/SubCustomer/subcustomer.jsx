import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Api_Url} from '../../../utilities/api';

const SubCustomer = ({navigation, route}) => {
  // const Api_Url = 'http://192.168.1.70:8000';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    console.log('route', route.params);
    fetchApiData(route.params.id);
  }, []);

  const fetchApiData = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/subcustomer/${id}`,
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async pk => {
    navigation.navigate('NewCustomer', {pk});
  };

  const handleEnable = async pk => {
    try {
      await axios.post(`${Api_Url}/accounts/apis/subcustomer/enable/${pk}/`);
      Alert.alert('User enabled successfully');
      fetchApiData();
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
      fetchApiData();
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

  return (
    <ScrollView>
      <View>
        <View style={styles.CustomerContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('NewCustomer')}
            />
            <Text style={styles.text}>Sub Customer</Text>
            <Icon style={styles.Icons} name="person-circle-outline"></Icon>
          </View>
        </View>
        <View style={styles.SecondContainer}>
          <View style={styles.Search}>
            <TextInput style={styles.input} placeholder="Search..." />
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
            onPress={() => navigation.navigate('NewSubCustomer')}
          />
        </View>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          data.map((item, index) => (
            <View
              key={index}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.Card, styles.ShadowProps]}>
                <View style={styles.card3}>
                  <Text style={{fontSize: 18, color: '#000'}}>{item.name}</Text>
                  <Button
                    buttonStyle={styles.priceButton}
                    title="Price List"
                    onPress={() => handleNavigation(item.pk)}
                  />
                </View>
                <Text style={{fontSize: 16, color: '#000'}}>
                  {item.contact_number}
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
                    onPress={handleDisable}
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
    height: 110,
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
    marginTop: 5,
  },
  card3: {
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
  sideIcon: {
    // color: "red",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A39A0',
    padding: 3,
    borderRadius: 9,
    margin: 3,
  },
});

export default SubCustomer;
