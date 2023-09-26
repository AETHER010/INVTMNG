/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.jsx';
import {name as appName} from './app.json';
import {AlertProvider} from 'react-native-alert-notification';

const AppWithAlert = () => <App />;

AppRegistry.registerComponent(appName, () => AppWithAlert);
