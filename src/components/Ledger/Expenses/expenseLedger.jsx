import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import {Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'; // Import Axios for API requests
import {Api_Url} from '../../../utilities/api';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import ModalDropdown from 'react-native-modal-dropdown';

export default class ExpenseLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Credit', 'Debit', 'Balance', 'Remarks'],
      widthArr: [80, 70, 80, 70, 110],
      data: [],
      loading: true,
      fromDate: new Date(),
      toDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
      client: [],
      clientId: null,
      selectors: ['Debit', 'Credit'],
      filteredData: [],
    };
  }

  componentDidMount() {
    this.getApiData();
  }

  getApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/expenses/list/?page=1&page_size=100`,
      );
      const responseData = response.data.data;

      // console.log(responseData, 'dsfhjgsjdhf');
      this.setState({data: responseData, loading: false});
      this.setState({filteredData: responseData, loading: false});
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({loading: false});
    }
  };

  handleDateChange = (date, type) => {
    if (type === 'from') {
      this.setState({fromDate: date, showFromDatePicker: false});
    } else if (type === 'to') {
      this.setState({toDate: date, showToDatePicker: false});
    }
  };

  filterData = async () => {
    const {fromDate, toDate, supplierID} = this.state;
    console.log('filterData', supplierID);
    // Filter the data based on the selected supplier and date range
    const getUrl = `${Api_Url}/report/apis/ledger/suppliers/list/?fromDate=${fromDate}&toDate=${toDate}`;

    const response = await axios.get(getUrl);
    const data = response.data.data;
    console.log(data, 'asdvasdvgaDGVAjdsvVDASLJKDFLASBHDUIF');
    // Update the state with the filtered data
    this.setState({filteredData: data});
  };

  render() {
    const {fromDate, toDate, showFromDatePicker, showToDatePicker} = this.state;
    const tableData =
      this.state.filteredData && this.state.filteredData.length > 0
        ? this.state.filteredData.map(
            ({
              created_date,
              _type,
              amount,
              Credit,
              Debit,
              balance,
              remarks,
            }) => [
              moment(created_date).format('MMM DD, YYYY'), // Fixed date format
              _type === 'Credit' ? (
                <Text style={{color: 'green', textAlign: 'center'}}>
                  {amount}
                </Text>
              ) : null,
              _type === 'Debit' ? (
                <Text style={{color: 'red', textAlign: 'center'}}>
                  {amount}
                </Text>
              ) : null,
              balance ? balance : null,
              remarks,
            ],
          )
        : [];

    return (
      <View style={styles.container}>
        <View style={styles.SecondContainer}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => this.setState({showFromDatePicker: true})}>
            {fromDate ? (
              <Text>{moment(fromDate).format('MMM DD, YYYY')}</Text>
            ) : (
              <Text>Select From Date</Text>
            )}
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, date) => this.handleDateChange(date, 'from')}
            />
          )}
          <Icon2 style={styles.swapIcon} name="swap"></Icon2>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => this.setState({showToDatePicker: true})}>
            {toDate ? (
              <Text>{moment(toDate).format('MMM DD, YYYY')}</Text>
            ) : (
              <Text>Select To Date</Text>
            )}
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, date) => this.handleDateChange(date, 'to')}
            />
          )}
          <Icon
            style={styles.Button}
            name="download"
            // onPress={handleSupplierLedger}
          />
        </View>

        <ScrollView
          horizontal={true}
          style={{maxHeight: Dimensions.get('window').height - 200}}>
          <View>
            <Table>
              <Row
                data={this.state.tableHead}
                widthArr={this.state.widthArr}
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
                    widthArr={this.state.widthArr}
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
  datePickerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 9,
    marginVertical: 10,
    borderColor: '#3A39A0',
  },
  Button: {
    marginTop: 14,
    height: 30,
    width: 30,
    fontSize: 24,
    backgroundColor: '#3A39A0',
    color: '#FFFFFF',
    borderRadius: 14,
    textAlign: 'center',
    paddingTop: 4,
  },
  textDisplay: {
    color: '#000',
    marginTop: 9,
    height: 40,
    width: 120,
    borderWidth: 1,
    borderColor: '#3A39A0',
    textAlign: 'center',
    paddingTop: 7,
    borderRadius: 10,
  },

  swapIcon: {
    color: '#000',
    fontSize: 25,
    marginTop: 17,
  },
  textDisplay: {
    color: '#000',
    marginTop: 9,
    height: 40,
    width: 120,
    borderWidth: 1,
    borderColor: '#3A39A0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  swapIcon: {
    color: '#000',
    fontSize: 25,
    marginTop: 17,
  },
  dropdownText: {
    color: '#000',
    fontSize: 18,
    paddingVertical: 4,
    paddingHorizontal: 17,
  },
});
