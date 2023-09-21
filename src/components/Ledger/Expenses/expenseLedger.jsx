import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import axios from 'axios'; // Import Axios for API requests
import {Api_Url} from '../../../utilities/api';
import moment from 'moment';

export default class ExpenseLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Name', 'Particular', 'Credit', 'Debit', 'Balance'],
      widthArr: [50, 80, 120, 70, 70, 80],
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getApiData();
  }

  getApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/expenses/list/`,
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
              moment(created_date).format('MMM DD, YYYY'),
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
        <Text
          style={{
            color: '#888',
            padding: 2,
            fontSize: 20,
          }}>
          Expenses:
        </Text>
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
});
