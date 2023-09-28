import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/appNavigator';
import LoadingScreen from './src/utilities/loading';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? <LoadingScreen /> : <AppNavigator />}
    </NavigationContainer>
  );
}
