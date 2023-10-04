import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect, Fragment } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeDashboard = ({ navigation }) => {
  const [userRoles, setUserRoles] = useState('');

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRoles(role);
    console.log('role of user', role);
  };
  return (
    <Fragment>
      <SafeAreaView edges={["top"]} style={{ flex: 0, backgroundColor: '#3A39A0' }} />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <View style={styles.home}>
          <View style={styles.navContainer}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingTop: 13,
              }}>
              <Text style={styles.Icons}> </Text>
              <Text style={styles.text}>Home</Text>
              <Icon
                style={styles.Icons}
                name="person-circle-outline"
                onPress={() => navigation.navigate('UserProfile')}></Icon>
            </View>
          </View>
          <ScrollView>
            <View style={styles.CardContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image

                    style={styles.cardImage}
                    source={require('../../Images/bills.png')}
                  />
                  <Card.Title
                    style={{ fontSize: 18, marginTop: 6 }}
                    title="card title"
                    onPress={() => navigation.navigate('Bills')}>
                    Sales
                  </Card.Title>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Purchase')}>

                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image
                    onPress={() => navigation.navigate('Purchase')}
                    style={styles.cardImage}
                    source={require('../../Images/purchase.png')}
                  />
                  <Card.Title style={{ fontSize: 18, marginTop: 6 }} title="card title">
                    Purchase
                  </Card.Title>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Payment')}>


                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image
                    onPress={() => navigation.navigate('Payment')}
                    style={styles.cardImage}
                    source={require('../../Images/payment.png')}
                  />
                  <Card.Title style={{ fontSize: 18, marginTop: 6 }} title="card title">
                    Payment
                  </Card.Title>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Ledger')}>

                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image
                    onPress={() => navigation.navigate('Ledger')}
                    style={styles.cardImage}
                    source={require('../../Images/Ledger.png')}
                  />
                  <Card.Title style={{ fontSize: 18, marginTop: 6 }} title="card title">
                    Ledger
                  </Card.Title>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Product')}>

                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image
                    onPress={() => navigation.navigate('Product')}
                    style={styles.cardImage}
                    source={require('../../Images/product.png')}
                  />
                  <Card.Title style={{ fontSize: 18, marginTop: 6 }} title="card title">
                    Product
                  </Card.Title>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Customer')}>

                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image
                    onPress={() => navigation.navigate('Customer')}
                    style={styles.cardImage}
                    source={require('../../Images/customer.png')}
                    resizeMode="contain"
                  />
                  <Card.Title style={{ fontSize: 18, marginTop: 6 }} title="card title">
                    Customer
                  </Card.Title>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Supplier')}>

                <View style={[styles.Card, styles.ShadowProps]}>
                  <Card.Image
                    onPress={() => navigation.navigate('Supplier')}
                    style={styles.cardImage}
                    source={require('../../Images/supplier.png')}
                    resizeMode="contain"
                  />
                  <Card.Title style={{ fontSize: 18, marginTop: 6 }} title="card title">
                    Supplier
                  </Card.Title>
                </View>
              </TouchableOpacity>
              {userRoles === 'user' ? null : (
                <TouchableOpacity onPress={() => navigation.navigate('User')}>

                  <View style={[styles.Card, styles.ShadowProps]}>
                    <Card.Image
                      onPress={() => navigation.navigate('User')}
                      style={styles.cardImage}
                      source={require('../../Images/user.png')}
                      resizeMode="contain"
                    />
                    <Card.Title
                      style={{ fontSize: 18, marginTop: 6 }}
                      title="card title">
                      User
                    </Card.Title>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  home: {
    display: 'flex',
    backgroundColor: 'white',
  },
  navContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 80,
  },
  text: {
    fontSize: 34,
    color: '#FFFFFF',
    marginTop: 0,
  },
  Icons: {
    color: '#fff',
    // height: 40,
    // width: 40,
    margin: 10,
    fontSize: 45,
  },
  CardContainer: {
    // margin: 2,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: "#000",
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cardImage: {
    height: 80,
    width: 80,
  },
  Card: {
    // marginTop: 17,
    // marginLeft: 14.5,
    // marginRight: 13,
    // marginBottom: 13,
    margin: 12,
    height: 163,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  ShadowProps: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E2E2',
    shadowOffset: { width: 4, height: 6 },
    shadowColor: '#171717',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default HomeDashboard;
