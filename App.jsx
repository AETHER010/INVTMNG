import {View, Text} from 'react-native';
import React from 'react';
import HomeDashboard from './src/components/Home/home';
import Login from './src/components/Login/login';
import Bills from './src/components/Bills/bill';
import User from './src/components/Users/user';
import NewUser from './src/components/Users/addeditUser';
import Purchase from './src/components/Purchase/purchase';
import NewPurchase from './src/components/Purchase/addEditPurchase';
import Payment from './src/components/Payment/payment';
import Ledger from './src/components/Ledger/ledger';
import Product from './src/components/Product/product';
import NewProduct from './src/components/Product/addEditProduct';
import Customer from './src/components/Customer/customer';
import NewCustomer from './src/components/Customer/addEditCustomer';
import Supplier from './src/components/Supplier/supplier';
import NewSupplier from './src/components/Supplier/addEditSupplier';
import NewBills from './src/components/Bills/newBills';
import PriceList from './src/components/Pricelist/priceList';
import SubCustomer from './src/components/Customer/SubCustomer/subcustomer';
import PaymentClient from './src/components/Payment/Client/client';
import PaymentSupplier from './src/components/Payment/Supplier/supplier';
import NewPaymentClient from './src/components/Payment/Client/newClient';
import NewPaymentSupplier from './src/components/Payment/Supplier/newSupplier';
import ViewPurchase from './src/components/Purchase/viewPurchase';
import ViewBills from './src/components/Bills/viewBils';
import UserProfile from './src/components/Users/userProfile';
import Report from './src/components/Report/report';
import ChangePassword from './src/components/Users/changePassword';
import NewSubCustomer from './src/components/Customer/SubCustomer/addEditSubcustomer';
import AddPriceList from './src/components/Pricelist/addEditPrice';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoadingScreen from './src/utilities/loading';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from './src/components/Users/userAuth';
import axios from 'axios';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await getTokens();
        await getUserRole();
      } catch (error) {
        console.error('Initialization error:', error);
      }
      setIsLoading(false); // Update isLoading after initialization
    };

    initializeApp();
  }, []);

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRoles(role);
  };

  const getTokens = async () => {
    try {
      const token = await getUserData();
      setUser(token);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
  };

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {user ? (
            <Stack.Screen name="Home" component={HomeDashboard} />
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )}
          <Stack.Screen name="Login2" component={Login} />
          <Stack.Screen name="Home2" component={HomeDashboard} />
          <Stack.Screen name="Bills" component={Bills} />
          <Stack.Screen name="Purchase" component={Purchase} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="Ledger" component={Ledger} />
          <Stack.Screen name="Product" component={Product} />
          <Stack.Screen name="Customer" component={Customer} />
          <Stack.Screen name="Supplier" component={Supplier} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="NewBills" component={NewBills} />
          <Stack.Screen name="NewSupplier" component={NewSupplier} />
          <Stack.Screen name="NewCustomer" component={NewCustomer} />
          <Stack.Screen name="NewProduct" component={NewProduct} />
          <Stack.Screen name="NewUser" component={NewUser} />
          <Stack.Screen name="PriceList" component={PriceList} />
          <Stack.Screen name="AddPriceList" component={AddPriceList} />
          <Stack.Screen name="NewPurchase" component={NewPurchase} />
          <Stack.Screen name="SubCustomer" component={SubCustomer} />
          <Stack.Screen name="NewSubCustomer" component={NewSubCustomer} />
          <Stack.Screen name="PaymentClient" component={PaymentClient} />
          <Stack.Screen name="PaymentSupplier" component={PaymentSupplier} />
          <Stack.Screen name="NewPaymentClient" component={NewPaymentClient} />
          <Stack.Screen
            name="NewPaymentSupplier"
            component={NewPaymentSupplier}
          />
          <Stack.Screen name="ViewPurchase" component={ViewPurchase} />
          <Stack.Screen name="ViewBills" component={ViewBills} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          {/* <Stack.Screen name="SupplierLedger" component={SupplierLedger} />
          <Stack.Screen name="ClientLedger" component={ClientLedger} />
          <Stack.Screen name="ExpenseLedger" component={ExpenseLedger} /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
