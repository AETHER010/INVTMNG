import axios from 'axios';
import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const Product = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(
        'https://ims.itnepalsoultions.com.pujanrajrai.com.np/products/apis/products',
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async index => {
    navigation.navigate('NewProduct', {index});
  };

  return (
    <View>
      <ScrollView>
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
            onPress={() => navigation.navigate('NewProduct')}
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
                    // onPress={() => handleUpdate(index)}
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
