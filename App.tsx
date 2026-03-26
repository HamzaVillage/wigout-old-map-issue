import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/routes/Routes';
import {persistor, store} from './src/redux/Store';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {webClientId} from './src/utils/api_content';
import {
  listenForForegroundMessages,
  registerNotifeeForegroundHandler,
  requestUserPermission,
  displayNotification, // ✅ Added proper import
} from './src/utils/Notifications';
import {
  startBackgroundService,
  stopBackgroundService,
} from './src/services/BackgroundLocationService';
import {notifyUserForNearbyReviewedPlaces} from './src/GlobalFunctions/main';
import notifee from '@notifee/react-native'; // ✅ Added notifee import
import {requestLocationPermission} from './src/utils/Permissions';

const latitude = '37.4191213';
const longitude = '-122.0932968';

const BackgroundManager = () => {
  const token = useSelector((state: any) => state?.user?.token);
  const location = useSelector((state: any) => state?.user?.current_location);

  useEffect(() => {
    const startService = async () => {
      if (token) {
        // ✅ Immediate hit when active/on login
        if (location?.latitude) {
          notifyUserForNearbyReviewedPlaces(
            token,
            location?.latitude,
            location?.longitude,
          );
        }

        const permissionGranted = await requestLocationPermission();
        if (permissionGranted) {
          startBackgroundService();
        } else {
          console.log('Location permission not granted, service not started.');
        }
      } else {
        stopBackgroundService();
      }
    };

    startService();
  }, [token]);

  return null;
};

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
    });

    // Initialize Notifications
    const initNotifications = async () => {
      const unsubscribeMessaging = listenForForegroundMessages();
      const unsubscribeNotifee = registerNotifeeForegroundHandler();

      return () => {
        unsubscribeMessaging();
        unsubscribeNotifee();
      };
    };

    const cleanup = initNotifications();
    return () => {
      cleanup.then(unsub => unsub?.());
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <BackgroundManager />
          <Routes />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
