import {View, Text, StyleSheet, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import SuppplierLedger from './supplier/supplier';
import ClientLedger from './client/clientLedger';
import ExpenseLedger from './Expenses/expenseLedger';
import {useState} from 'react';

const Ledger = ({navigation}) => {
  const [action, setAction] = useState('supplier');

  const handleSupplierLedger = () => {
    setAction('supplier');
  };

  const handleExpenseLedger = () => {
    setAction('expense');
  };

  const handleClientLedger = () => {
    setAction('client');
  };

  return (
    <View>
      <View style={styles.LedgerContainer}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Icon
            style={styles.Icons}
            name="arrow-back"
            onPress={() => navigation.navigate('Home2')}
          />
          <Text style={styles.text}>Ledger</Text>
          <Icon
            style={styles.Icons}
            name="person-circle-outline"
            onPress={() => navigation.navigate('UserProfile')}
          />
        </View>
        <View style={styles.division}>
          <Text
            style={[styles.text1, action === 'supplier' && styles.selectedText]}
            onPress={handleSupplierLedger}>
            Supplier
          </Text>
          <View style={styles.text2}></View>
          <Text
            style={[styles.text1, action === 'client' && styles.selectedText]}
            onPress={handleClientLedger}>
            Clients
          </Text>
          <View style={styles.text2}></View>
          <Text
            style={[styles.text1, action === 'expense' && styles.selectedText]}
            onPress={handleExpenseLedger}>
            Expences
          </Text>
        </View>
      </View>

      <View>
        {action === 'supplier' ? <SuppplierLedger /> : null}
        {action === 'client' ? <ClientLedger /> : null}
        {action === 'expense' ? <ExpenseLedger /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  LedgerContainer: {
    display: 'flex',
    backgroundColor: '#3A39A0',
    justifyContent: 'flex-end',
    height: 120,
  },
  text: {
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: 10,
  },
  Icons: {
    color: '#fff',
    margin: 10,
    fontSize: 35,
  },
  division: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 4,
    paddingVertical: 5,
  },
  text1: {
    fontSize: 24,
    color: '#fff',
  },
  text2: {
    borderRightWidth: 2,
    borderRightColor: '#FFF',
  },
  SecondContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
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
  selectedText: {
    color: '#000',
  },
});

export default Ledger;
