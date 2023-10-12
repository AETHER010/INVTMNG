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
import RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class ExpenseLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Date', 'Credit', 'Debit', 'Balance', 'Remarks'],
      widthArr: [80, 70, 80, 70, 110],
      data: [],
      loading: true,
      fromDate: new Date(2022, 0, 1),
      toDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
      client: [],
      clientId: null,
      selectors: ['Debit', 'Credit'],
      filteredData: [],
      userRole: '',
      refreshing: false,
      page: 1,
    };
  }

  componentDidMount() {
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
        `${Api_Url}/report/apis/ledger/expenses/list/?page=${page}&page_size=20`,
      );
      const responseData = response.data.data;

      // console.log(responseData, 'dsfhjgsjdhf');
      // this.setState({data: responseData, loading: false});
      const newData =
        page === 1 ? responseData : [...this.state.data, ...responseData];
      this.setState({data: newData, loading: false, page});
      this.setState({filteredData: responseData, loading: false});
    } catch (error) {
      console.error('Error fetching data:', error);
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

  handleDateChange = (date, type) => {
    if (type === 'from') {
      this.setState({fromDate: date, showFromDatePicker: false});
      this.filterData();
    } else if (type === 'to') {
      this.setState({toDate: date, showToDatePicker: false});
      this.filterData();
    }
  };

  filterData = async () => {
    const {fromDate, toDate} = this.state;

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');
    // Filter the data based on the selected supplier and date range
    const getUrl = `${Api_Url}/report/apis/ledger/expenses/list/?fromDate=${formattedFromDate}&toDate=${formattedToDate}`;

    const response = await axios.get(getUrl);
    const data = response.data.data;
    console.log(data, 'asdvasdvgaDGVAjdsvVDASLJKDFLASBHDUIF');
    // Update the state with the filtered data
    this.setState({filteredData: data});
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

    const apiUrl = `${Api_Url}/report/pages/expenses/export-excel/?from_date=${formattedFromDate}&to_date=${formattedToDate}`;
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
        const contentDisposition = response.headers['content-disposition'];
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        let filename = 'downloaded.pdf'; // Default filename

        if (filenameMatch) {
          filename = filenameMatch[1];
        }
        const uniqueFilename = await this.generateUniqueFilename(filename);
        const pdfdata = response.request._response;
        const pdfData2 = JSON.stringify(pdfdata);
        const filePath = `${RNFS.DownloadDirectoryPath}/${uniqueFilename}`; // Change the file name and path as needed
        console.log(`${filePath}`, 'sakuhdfgiask');
        await RNFS.writeFile(filePath, pdfData2, 'base64');

        Alert.alert('Download Complete', `PDF ${filename} saved to device.`);
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
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
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

  generateUniqueFilename = async filename => {
    const directory = RNFS.DownloadDirectoryPath;
    let uniqueFilename = filename;

    let counter = 1;
    while (await RNFS.exists(`${directory}/${uniqueFilename}`)) {
      // If the file with the current name already exists, increment the counter
      uniqueFilename = `${filename.replace('.pdf', '')}_${counter}.pdf`;
      counter++;
    }

    return uniqueFilename;
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
        <View style={styles.container}>
          <View style={styles.SecondContainer}>
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
              <ScrollView
                style={styles.dataWrapper}
                onScroll={this.handleScroll}>
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
