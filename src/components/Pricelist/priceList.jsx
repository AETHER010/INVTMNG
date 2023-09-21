import {useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-elements';

const PriceList = ({navigation}) => {
  // useEffect(async () => {
  //   const response = await axios.get(
  //     "https://ims.itnepalsoultions.com.pujanrajrai.com.np/bill/apis/unconfirm-purchase-bill/2",
  //     {
  //       username,
  //       password,
  //     }
  //   );
  // }, []);
  return (
    <View style={styles.Container}>
      <View style={styles.BillsContainer}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Icon
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('Customer')}
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
          onPress={() => navigation.navigate('Customer')}
          title="+ Create"
        />
      </View>
      <View>
        {/* <View style={[styles.Card, styles.ShadowProps]}>
          <Text />
          <Text />
        </View> */}
      </View>
    </View>
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
  Card: {
    height: 40,
    backgroundColor: '#3A39A0',
  },
});

export default PriceList;
