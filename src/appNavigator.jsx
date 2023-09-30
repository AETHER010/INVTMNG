import {View, Text} from 'react-native';
import React from 'react';
import HomeDashboard from './components/Home/home';
import Login from './components/Login/login';
import Bills from './components/Bills/bill';
import User from './components/Users/user';
import NewUser from './components/Users/addeditUser';
import Purchase from './components/Purchase/purchase';
import NewPurchase from './components/Purchase/addEditPurchase';
import Payment from './components/Payment/payment';
import Ledger from './components/Ledger/ledger';
import Product from './components/Product/product';
import NewProduct from './components/Product/addEditProduct';
import Customer from './components/Customer/customer';
import NewCustomer from './components/Customer/addEditCustomer';
import Supplier from './components/Supplier/supplier';
import NewSupplier from './components/Supplier/addEditSupplier';
import NewBills from './components/Bills/newBills';
import PriceList from './components/Pricelist/priceList';
import SubCustomer from './components/Customer/SubCustomer/subcustomer';
import PaymentClient from './components/Payment/Client/client';
import PaymentSupplier from './components/Payment/Supplier/supplier';
import NewPaymentClient from './components/Payment/Client/newClient';
import NewPaymentSupplier from './components/Payment/Supplier/newSupplier';
import ViewPurchase from './components/Purchase/viewPurchase';
import ViewBills from './components/Bills/viewBils';
import UserProfile from './components/Users/userProfile';
import Report from './components/Report/report';
import ChangePassword from './components/Users/changePassword';
import NewSubCustomer from './components/Customer/SubCustomer/addEditSubcustomer';
import AddPriceList from './components/Pricelist/addEditPrice';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from './components/Users/userAuth';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState('');
  const [userRoles, setUserRoles] = useState('');

  useEffect(() => {
    getTokens();
    getUserRole();
  }, [user]);

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRoles(role);
    console.log('role of user', role);
  };

  const getTokens = async () => {
    try {
      const token = await getUserData();
      console.log('token', token);
      setUser(token);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
    console.log('token of user', user);
  };

  const Stack = createStackNavigator();
  return (
    <NavigationContainer independent={true}>
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
    </NavigationContainer>
  );
}
