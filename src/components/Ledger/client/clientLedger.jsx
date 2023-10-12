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
      tableHead: ['Date', 'Name', 'Particular', 'Debit', 'Credit', 'Balance'],
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
      page: 1,
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

  getApiData = async (page = 1) => {
    try {
      const response = await axios.get(
        `${Api_Url}/report/apis/ledger/customer/list/?page=${page}&page_size=20`,
      );
      const responseData = response.data.data;
      const newData =
        page === 1 ? responseData : [...this.state.data, ...responseData];
      this.setState({data: newData, loading: false, page});
      this.setState({filteredData: responseData, loading: false});
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
      this.setState({client: responseData, loading: false});
    } catch (error) {
      // Alert.alert('Error', 'An error occurred while fetching data.');
    }
  };

  handleProductSelection = async index => {
    const selectedData = this.state.client[index];
    const selectedProductId = selectedData.pk;
    this.setState({clientID: selectedProductId}, () => {
      this.filterData();
    });

    const selectedClient2 = this.state.client[index].name;
    this.setState({selectedClient: selectedClient2});

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
        headers,
      });

      if (response.status === 200) {
        const pdfData = response.request._response;
        const pdfData2 = JSON.stringify(pdfData);
        const contentDisposition = response.headers['content-disposition'];
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        let filename = 'downloaded.pdf'; // Default filename

        if (filenameMatch) {
          filename = filenameMatch[1];
        }
        const uniqueFilename = await this.generateUniqueFilename(filename);
        const filePath = `${RNFS.DownloadDirectoryPath}/${uniqueFilename}`;
        await RNFS.writeFile(filePath, pdfData2, 'base64');

        Alert.alert('Download Complete', `PDF ${filename} saved to device.`);
      } else {
        Alert.alert('Download Error', 'Failed to download PDF file.');
      }
    } catch (error) {
      // console.error('Error downloading data:', error);
      Alert.alert(
        'Download Error',
        'An error occurred while downloading the PDF.',
      );
    }
  };

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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
        return false;
      }
    } catch (err) {
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

  filterData = async () => {
    const {fromDate, toDate, clientID} = this.state;
    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');
    const getUrl = `${Api_Url}/report/apis/ledger/customer/list/?customer=${clientID}&from_date=${formattedFromDate}&to_Date=${formattedToDate}&page_size=100&page=1`;

    const response = await axios.get(getUrl);

    const data = response.data.data;
    this.setState({data: data});
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
              Debit,
              Credit,

              balance,
            }) => [
              moment(created_date).format('MMM DD, YYYY'), // Fixed date format
              customer,
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
