import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeDashboard = ({navigation}) => {
  return (
    <ScrollView>
      <View style={styles.home}>
        <View style={styles.navContainer}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={styles.Icons} />

            <Text style={styles.text}>Home</Text>
            <Icon
              style={styles.Icons}
              name="person-circle-outline"
              onPress={() => navigation.navigate('UserProfile')}></Icon>
          </View>
        </View>
        <View style={styles.CardContainer}>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Bills')}
              style={styles.cardImage}
              source={require('../../Images/bills.png')}
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Bill
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Purchase')}
              style={styles.cardImage}
              source={require('../../Images/purchase.png')}
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Purchase
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Payment')}
              style={styles.cardImage}
              source={require('../../Images/payment.png')}
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Payment
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Ledger')}
              style={styles.cardImage}
              source={require('../../Images/Ledger.png')}
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Ledger
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Product')}
              style={styles.cardImage}
              source={require('../../Images/product.png')}
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Product
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Customer')}
              style={styles.cardImage}
              source={require('../../Images/customer.png')}
              resizeMode="contain"
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Customer
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('Supplier')}
              style={styles.cardImage}
              source={require('../../Images/supplier.png')}
              resizeMode="contain"
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              Supplier
            </Card.Title>
          </View>
          <View style={[styles.Card, styles.ShadowProps]}>
            <Card.Image
              onPress={() => navigation.navigate('User')}
              style={styles.cardImage}
              source={require('../../Images/user.png')}
              resizeMode="contain"
            />
            <Card.Title style={{fontSize: 18, marginTop: 6}} title="card title">
              User
            </Card.Title>
          </View>
        </View>
      </View>
    </ScrollView>
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
    marginTop: 10,
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
    height: 165,
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
    shadowOffset: {width: 4, height: 6},
    shadowColor: '#171717',
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});

export default HomeDashboard;
