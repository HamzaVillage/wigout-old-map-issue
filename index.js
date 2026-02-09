import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  registerBackgroundHandler,
  registerNotifeeBackgroundHandler,
} from './src/utils/Notifications';

// Register background handlers
registerBackgroundHandler();
registerNotifeeBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
