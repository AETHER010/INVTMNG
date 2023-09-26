import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import {Button} from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {Api_Url} from '../../../utilities/api';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Linking from 'react-native';

export default class SupplierLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Name', 'Particular', 'Credit', 'Debit', 'Balance'],
      widthArr: [80, 120, 120, 50, 70, 80],
      data: [],
      loading: true,
      fromDate: new Date(),
      toDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
      supplier: [],
      supplierID: null,
      selectedSupplier: '',
      filteredData: [],
    };
  }

  componentDidMount() {
    this.fetchApiSupplier();
    this.getApiData();
  }

  getApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/suppliers/list/?page=1&page_size=100`,
      );
      const responseData = response.data.data;

      this.setState({data: responseData, loading: false});
      this.setState({filteredData: responseData, loading: false});
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({loading: false});
    }
  };

  fetchApiSupplier = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/bill/apis/purchase/suppliers/list/`,
      );
      const responseData = response.data;
      this.setState({supplier: responseData, loading: false});
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  // Function to handle date changes for From and To dates
  handleDateChange = (date, type) => {
    if (type === 'from') {
      this.setState({fromDate: date, showFromDatePicker: false});
    } else if (type === 'to') {
      this.setState({toDate: date, showToDatePicker: false});
    }
  };

  handleProductSelection = async index => {
    const selectedData = this.state.supplier[index];
    const selectedProductId = selectedData.pk;

    this.setState({supplierID: selectedProductId});
    const selectedSupplier2 = this.state.supplier[index].name;
    this.setState({selectedSupplier: selectedSupplier2}, () => {
      console.log('Updated selected supplier:', this.state.selectedSupplier);
    });

    this.filterData();
  };

  filterData = async () => {
    const {fromDate, toDate, supplierID} = this.state;
    console.log('filterData', supplierID);
    // Filter the data based on the selected supplier and date range
    const getUrl = `${Api_Url}/report/apis/ledger/suppliers/list/?supplierID=${supplierID}&fromDate=${fromDate}&toDate=${toDate}`;

    const response = await axios.get(getUrl);
    const data = response.data.data;
    console.log(data, 'asdvasdvgaDGVAjdsvVDASLJKDFLASBHDUIF');
    // Update the state with the filtered data
    this.setState({filteredData: data});
  };

  handleDownload = async () => {
    const {fromDate, toDate, supplierID} = this.state;

    try {
      // Make a GET request to the API endpoint
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/suppliers/list/?supplierID=${supplierID}&fromDate=${fromDate}&toDate=${toDate}`,
      );
      console.log(response.data);

      const jsonData = response.data.data;

      const jsonString = JSON.stringify(jsonData, null, 2);

      const blob = new Blob([jsonString], {type: 'application/json'});
      console.log('application/json', blob);

      const url = window.URL.createObjectURL(blob);
      console.log('application/json for url', url);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.txt'; // Specify the desired file name
      a.style.display = 'none';

      // Append the link to the body and trigger a click event to start the download
      document.body.appendChild(a);
      a.click();

      // Clean up by removing the created elements
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  render() {
    const {fromDate, toDate, showFromDatePicker, showToDatePicker} = this.state;
    const tableData =
      this.state.filteredData && this.state.filteredData.length > 0
        ? this.state.filteredData.map(
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
              moment(created_date).format('MMM DD, YYYY'), // Fixed date format
              suppliers,
              particular,
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
            ],
          )
        : [];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.SecondContainer}>
          <ModalDropdown
            style={styles.textDisplay}
            defaultValue="Suppliers"
            options={this.state.supplier.map(item => item.name)}
            onSelect={index => this.handleProductSelection(index)}
            defaultIndex={0}
            animated={true}
            isFullWidth={true}
            textStyle={styles.dropdownText}
            showsVerticalScrollIndicator={true}
            dropdownTextStyle={styles.dropdownText2}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => this.setState({showFromDatePicker: true})}>
            {fromDate ? (
              <Text style={{color: '#000'}}>
                {moment(fromDate).format('MMM DD, YYYY')}
              </Text>
            ) : (
              <Text style={{color: '#000'}}>From Date</Text>
            )}
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                this.handleDateChange(date, 'from'), this.filterData();
              }}
            />
          )}
          <Icon2 style={styles.swapIcon} name="swap"></Icon2>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => this.setState({showToDatePicker: true})}>
            {toDate ? (
              <Text style={{color: '#000'}}>
                {moment(toDate).format('MMM DD, YYYY')}
              </Text>
            ) : (
              <Text style={{color: '#000'}}>To Date</Text>
            )}
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                this.handleDateChange(date, 'to'), this.filterData();
              }}
            />
          )}
          <Icon
            style={styles.Button}
            name="download"
            onPress={this.handleDownload}
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
                    style={{
                      ...styles.row,
                      ...(index % 2 ? {backgroundColor: '#F7F6E7'} : {}), // Use an object for style
                    }}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>
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
    marginBottom: 5,
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
  dropdownText2: {
    color: '#000',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 17,
  },
});
