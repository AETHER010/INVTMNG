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
  RefreshControl,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

import RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';

export default class SupplierLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Name', 'Particular', 'Debit', 'Credit', 'Balance'],
      widthArr: [80, 120, 120, 50, 70, 80],
      data: [],
      loading: true,
      fromDate: new Date(2022, 0, 1),
      toDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
      supplier: [],
      supplierID: null,
      selectedSupplier: '',
      defaultSupplier: 'Suppliers...',
      userRole: '',
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchApiSupplier();
    this.getApiData();
    this.getUserRole();
  }

  getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    this.setState({userRole: role});
  };

  getApiData = async (page = 1) => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/suppliers/list/?page=${page}&page_size=20`,
      );
      const responseData = response.data.data;

      const newData =
        page === 1 ? responseData : [...this.state.data, ...responseData];
      this.setState({data: newData, loading: false, page});
    } catch (error) {
      this.setState({loading: false});
    }
  };

  handleScroll = async event => {
    const {layoutMeasurement, contentSize, contentOffset} = event.nativeEvent;
    const contentHeight = contentSize.height;
    const yOffset = contentOffset.y;
    const visibleHeight = layoutMeasurement.height;

    if (yOffset + visibleHeight >= contentHeight - 20) {
      // Load more data when the user is near the bottom of the table
      const nextPage = this.state.page + 1;
      this.getApiData(nextPage);
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
      this.filterData();
    } else if (type === 'to') {
      this.setState({toDate: date, showToDatePicker: false});
      this.filterData();
    }
  };

  handleProductSelection = async index => {
    const selectedData = this.state.supplier[index];
    const selectedProductId = selectedData.pk;

    this.setState({selectedSupplier: selectedData.name}, () => {});

    this.setState({supplierID: selectedProductId}, () => {
      this.filterData(); // Call filterData after updating the state
    });
  };

  filterData = async () => {
    const {fromDate, toDate, supplierID} = this.state;

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    const getUrl = `${Api_Url}/report/apis/ledger/suppliers/list/?suppliers=${supplierID}&from_date=${formattedFromDate}&to_date=${formattedToDate}&page_size=100&page=${this.state.page}`;

    const response = await axios.get(getUrl);
    const data = response.data.data;
    this.setState({data: data});
  };

  handleDownload = async () => {
    const {fromDate, toDate, supplierID} = this.state;

    // Request storage permission
    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) {
      return;
    }

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    const apiUrl = `${Api_Url}/report/pages/suppliers/export-pdf/?from_date=${formattedFromDate}&to_date=${formattedToDate}&suppliers=${supplierID}`;
    const token = await AsyncStorage.getItem('access_token');
    const headers = {
      Accept: 'application/pdf',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        headers,
      });

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        let filename = 'downloaded.pdf'; // Default filename

        if (filenameMatch) {
          filename = filenameMatch[1];
        }
        const pdfdata = response.request._response;

        const pdfData2 = JSON.stringify(pdfdata);

        const filePath = `${RNFS.DownloadDirectoryPath}/${filename}`;
        await RNFS.writeFile(filePath, pdfData2, 'base64')
          .then(success => {
            console.log('FILE WRITTEN!');
          })
          .catch(err => {
            console.log(err.message);
          });

        Alert.alert(
          'Download Complete',
          `PDF file "${filename}" saved to device.`,
        );
      } else {
        Alert.alert('Download Error', 'Failed to download PDF file.');
      }
    } catch (error) {
      Alert.alert(
        'Download Error',
        'An error occurred while downloading the PDF.',
      );
    }
  };

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  render() {
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

              Debit,
              Credit,
              balance,
            }) => [
              moment(created_date).format('MMM DD, YYYY'), // Fixed date format
              suppliers,
              particular,
              _type === 'Debit' ? (
                <Text style={{color: 'red', textAlign: 'center'}}>
                  {amount}
                </Text>
              ) : null,
              _type === 'Credit' ? (
                <Text style={{color: 'green', textAlign: 'center'}}>
                  {amount}
                </Text>
              ) : null,

              balance ? balance : null,
            ],
          )
        : [];

    return (
      <View style={styles.container}>
        <View style={styles.SecondContainer}>
          <ModalDropdown
            style={styles.textDisplay}
            defaultValue={this.state.defaultSupplier}
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
          {this.state.userRole === 'admin' ||
          this.state.userRole === 'superadmin' ? (
            <Icon
              style={styles.Button}
              name="download"
              onPress={this.handleDownload}
            />
          ) : null}
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
            <ScrollView style={styles.dataWrapper} onScroll={this.handleScroll}>
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
    paddingHorizontal: 2,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 9,
    marginVertical: 9,
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
    width: '34%',
    borderWidth: 1,
    borderColor: '#3A39A0',
    borderRadius: 10,
  },
  swapIcon: {
    color: '#000',
    fontSize: 25,
    marginTop: 17,
  },
  dropdownText: {
    color: '#000',
    fontSize: 16,
    width: 120,
    paddingVertical: 7,
    textAlign: 'center',
  },
  dropdownText2: {
    color: '#000',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
});
