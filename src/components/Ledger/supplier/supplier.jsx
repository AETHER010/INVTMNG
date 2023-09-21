import React, {Component, useState} from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

import axios from 'axios'; // Import Axios for API requests
import {Api_Url} from '../../../utilities/api';
import moment from 'moment';

export default class ExampleThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Name', 'Particular', 'Credit', 'Debit', 'Balance'],
      widthArr: [80, 80, 120, 70, 70, 80],
      data: [],
      loading: true,
      fromDate: new Date(),
      toDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
    };
  }

  componentDidMount() {
    this.getApiData();
  }

  getApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/suppliers/list/?page=2`,
      );
      const responseData = response.data.data;

      console.log(responseData, 'dsfhjgsjdhf'); // Assuming the API response is an object with a data property
      this.setState({data: responseData, loading: false});
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({loading: false});
    }
  };

  render() {
    const state = this.state;
    const {fromDate, toDate, showFromDatePicker, showToDatePicker} = this.state;
    const tableData =
      this.state.data && this.state.data.length > 0
        ? this.state.data.map(
            ({
              created_date,
              suppliers,
              particular,
              _type,
              amount,
              Credit,
              Debit,
              balance,
            }) => [
              moment(created_date).format('MMMDD,YYYY'),
              suppliers,
              particular,
              _type === 'Credit' ? (
                <Text style={{color: 'green'}}>{amount}</Text>
              ) : null,
              // Credit !== null ? Credit : null,
              // Debit !== null ? Debit : null,
              _type === 'Debit' ? (
                <Text style={{color: 'red'}}>{amount}</Text>
              ) : null,
              balance ? balance : null,
            ],
          )
        : [];

    return (
      <View style={styles.container}>
        <View style={styles.SecondContainer}>
          <Text style={styles.textDisplay}> Supplier</Text>
          <Text
            style={styles.textDisplay}
            onPress={() => this.setState({showDatePicker: true})}>
            Select Date
          </Text>

          <Button
            buttonStyle={styles.Button}
            title="Export"
            // onPress={handleSupplierLedger}
          />
        </View>

        <ScrollView horizontal={true}>
          <View>
            <Table>
              <Row
                data={state.tableHead}
                widthArr={state.widthArr}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table>
                {tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={state.widthArr}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    backgroundColor: '#537791',
  },
  text: {
    textAlign: 'center',
    fontWeight: '100',
    color: '#000',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 50,
    backgroundColor: '#E7E6E1',
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
    marginTop: 9,
    height: 40,
    width: 80,
    fontSize: 14,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 10,
  },
  textDisplay: {
    color: '#000',
    marginTop: 9,
    height: 40,
    width: 80,
    borderWidth: 1,
    borderColor: '#3A39A0',
    textAlign: 'center',
    paddingTop: 7,
    borderRadius: 10,
  },
});
