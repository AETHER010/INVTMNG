import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-elements';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

const PriceList = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    const id = route.params.id;
    fetchApiData(id);
  }, []);

  const fetchApiData = async id => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/subcustomer/product/list/${id}/`,
      );
      setData(response.data.data);
      console.log(response.data, 'fsddfsd');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    console.log(id);
    try {
      await axios.delete(
        `${Api_Url}/accounts/apis/subcustomer/myproduct/delete/${id}/`,
      );

      Alert.alert('Price list Deleted Successfully');
      fetchApiData(route.params.id);
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    const ScId = route.params.id;
    navigation.navigate('AddPriceList', {ScId});
  };

  const handleUpdate = id => {
    const ScId = route.params.id;
    navigation.navigate('AddPriceList', {id, ScId});
  };

  return (
    <ScrollView>
      <View style={styles.Container}>
        <View style={styles.BillsContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Icon
              style={styles.Icons}
              name="arrow-back"
              onPress={() => navigation.navigate('SubCustomer')}
            />
            <Text style={styles.text}>PriceList</Text>
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
            onPress={handleNavigation}
            title="+ Create"
          />
        </View>
        {Array.isArray(data) && data.length === 0 ? (
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              marginTop: 8,
              fontSize: 22,
            }}>
            No data available!!!
          </Text>
        ) : (
          <View>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              data.map((item, index) => (
                <View
                  key={index}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={[styles.Card, styles.ShadowProps]}>
                    <View style={styles.card2}>
                      <Text style={{fontSize: 14, color: '#000'}}>
                        {item.name}
                      </Text>
                      <Text style={{fontSize: 14, color: '#000'}}>
                        Standard Rate: {item.standard_price}
                      </Text>
                    </View>
                    <View style={styles.card2}>
                      <Text style={{fontSize: 16, color: '#000'}}>
                        {item.price}
                      </Text>
                      <View style={{flexDirection: 'row', padding: 4}}>
                        <Icon2
                          name="square-edit-outline"
                          size={18}
                          color="#fff"
                          backgroundColor="#3A39A0"
                          style={styles.sideIcon}
                          onPress={() => handleUpdate(item.pk)}
                        />

                        <Icon2
                          name="delete"
                          size={18}
                          color="#fff"
                          style={styles.sideIcon}
                          onPress={() => handleDelete(item.pk)}
                          backgroundColor="#ff0000"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
  },
  BillsContainer: {
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
    height: 40,
    backgroundColor: '#3A39A0',
  },
  Card: {
    height: 90,
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
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sideIcon: {
    // color: "red",
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#3A39A0',
    padding: 3,
    borderRadius: 9,
    margin: 3,
  },
});

export default PriceList;
