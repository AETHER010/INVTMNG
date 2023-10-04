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
  RefreshControl,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';

export default class ClientLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Name', 'Particular', 'Credit', 'Debit', 'Balance'],
      widthArr: [80, 80, 120, 70, 70, 80],
      data: [],
      loading: true,
      fromDate: new Date(2022, 0, 1),
      toDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
      client: [],
      clientID: null,
      selectedClient: '',
      filteredData: [],
      userRole: '',
      refreshing: false,
      defaultClient: 'Client...',
    };
  }

  componentDidMount() {
    this.getApiData();
    this.fetchApiClient();
    this.getUserRole();
  }

  getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    this.setState({userRole: role});
  };

  getApiData = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/customer/list/?page=1&page_size=100`,
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
      this.filterData();
    } else if (type === 'to') {
      this.setState({toDate: date, showToDatePicker: false});
      this.filterData();
    }
  };

  fetchApiClient = async () => {
    try {
      const response = await axios.get(
        `${Api_Url}/accounts/apis/customer/?page=1&page_size=100`,
      );
      const responseData = response.data.data;
      console.log('API error:', responseData);
      this.setState({client: responseData, loading: false});
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  handleProductSelection = async index => {
    const selectedData = this.state.client[index];
    const selectedProductId = selectedData.pk;
    this.setState({clientID: selectedProductId}, () => {
      console.log('Updated supplierID:', this.state.clientID);
      this.filterData();
    });

    const selectedClient2 = this.state.client[index].name;
    this.setState({selectedClient: selectedClient2}, () => {
      console.log('Updated selected client:', this.state.selectedClient);
    });

    this.filterData();
  };

  handleDownload = async () => {
    const {fromDate, toDate, clientID} = this.state;

    // Request storage permission
    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) {
      return;
    }

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    const apiUrl = `${Api_Url}/report/pages/customer/export-pdf/?from_date=${formattedFromDate}&to_date=${formattedToDate}&customer=${clientID}`;
    const token = await AsyncStorage.getItem('access_token');
    const headers = {
      Accept: 'application/pdf',
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        headers, // Ensure the response is treated as binary data
      });

      if (response.status === 200) {
        // Save the PDF data to a file
        const pdfData = response.request._response;
        const pdfData2 = JSON.stringify(pdfData);
        const contentDisposition = response.headers['content-disposition'];
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        let filename = 'downloaded.pdf'; // Default filename

        if (filenameMatch) {
          filename = filenameMatch[1];
        }
        const filePath = `${RNFS.DownloadDirectoryPath}/${filename}`;
        await RNFS.writeFile(filePath, pdfData2, 'base64');

        Alert.alert('Download Complete', 'PDF file saved to device.');
      } else {
        Alert.alert('Download Error', 'Failed to download PDF file.');
      }
    } catch (error) {
      console.error('Error downloading data:', error);
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

  filterData = async () => {
    const {fromDate, toDate, clientID} = this.state;
    console.log('filterData', clientID);
    // Filter the data based on the selected supplier and date range
    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');
    const getUrl = `${Api_Url}/report/apis/ledger/customer/list/?customer=${clientID}&from_date=${formattedFromDate}&to_Date=${formattedToDate}`;

    const response = await axios.get(getUrl);
    const data = response.data.data;
    console.log(data, 'asdvasdvgaDGVAjdsvVDASLJKDFLASBHDUIF');
    // Update the state with the filtered data
    this.setState({data: data});
  };

  handleRefresh = () => {
    this.setState({refreshing: true});

    this.getApiData();
    this.setState({defaultClient: 'Suppliers...'});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  };

  render() {
    const {fromDate, toDate, showFromDatePicker, showToDatePicker} = this.state;
    const tableData =
      this.state.data && this.state.data.length > 0
        ? this.state.data.map(
            ({
              created_date,
              customer,
              particular,
              _type,
              amount,
              Credit,
              Debit,
              balance,
            }) => [
              moment(created_date).format('MMM DD, YYYY'), // Fixed date format
              customer,
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
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }>
        <View style={styles.container}>
          <View style={styles.SecondContainer}>
            <ModalDropdown
              style={styles.textDisplay}
              defaultValue={this.state.defaultClient}
              options={this.state.client.map(item => item.name)}
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
                <Text style={{color: '#000'}}>Select From Date</Text>
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
                <Text style={{color: '#000'}}>
                  {moment(toDate).format('MMM DD, YYYY')}
                </Text>
              ) : (
                <Text style={{color: '#000'}}>Select To Date</Text>
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
    width: 130,
    borderWidth: 1,
    borderColor: '#3A39A0',

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
    width: 130,
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
