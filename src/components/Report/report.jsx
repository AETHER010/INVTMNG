import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {Api_Url} from '../../utilities/api';

const Report = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  useEffect(() => {
    fetchApiData();

    console.log('fjngbskdfg', data.total_price);
  }, []);

  useEffect(() => {
    console.log('sadfg', data);
    console.log(data.total_customer_due);
  }, [data]);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(`${Api_Url}/report/apis/report/pl`);
      console.log(response.data, 'api response data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      console.log('jhsdvcb');
    }
  };

  return (
    <View>
      <View style={styles.UserContainer}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Icon
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('UserProfile')}
          />
          <Text style={styles.text}>Report</Text>
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
          onPress={() => navigation.navigate('Customer')}
          title="+ Create"
        />
      </View>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 10,
          }}>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                textDecorationLine: 'underline',
              }}>
              Total Purchase
            </Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  paddingTop: 6,
                  color: '#000',
                }}>
                Amount:
              </Text>
              <Text style={{fontSize: 14, paddingTop: 6, color: 'red'}}>
                {data.total_pruchase}
              </Text>
            </View>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                textDecorationLine: 'underline',
              }}>
              Total sales
            </Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  paddingTop: 6,
                  color: '#000',
                }}>
                Amount:
              </Text>
              <Text style={{fontSize: 14, paddingTop: 6, color: 'green'}}>
                {data.total_sales}
              </Text>
            </View>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                textDecorationLine: 'underline',
              }}>
              Miscellaneous Expenses
            </Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  paddingTop: 6,
                  color: '#000',
                }}>
                Amount:
              </Text>
              <Text style={{fontSize: 14, paddingTop: 6, color: 'red'}}>
                {data.total_expenses}
              </Text>
            </View>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                textDecorationLine: 'underline',
              }}>
              Total Commission
            </Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  paddingTop: 6,
                  color: '#000',
                }}>
                Amount:
              </Text>
              <Text style={{fontSize: 14, paddingTop: 6, color: 'green'}}>
                {data.total_expenses}
              </Text>
            </View>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                textDecorationLine: 'underline',
              }}>
              Total Profit
            </Text>
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  paddingTop: 6,
                  color: '#000',
                }}>
                Amount:
              </Text>
              <Text style={{fontSize: 14, paddingTop: 6, color: 'green'}}>
                {data.total_expenses}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  UserContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    height: 109,
    justifyContent: 'flex-end',
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
  Card: {
    height: 100,
    width: 160,
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ShadowProps: {
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#E2E2E2',
    shadowOffset: {width: 6, height: 8},
    shadowColor: '#CECECE',
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  SecondContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100,
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
});

export default Report;
