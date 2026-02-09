import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import {notifyUserForNearbyReviewedPlaces} from '../GlobalFunctions/main';
import {store} from '../redux/Store';
import {Platform} from 'react-native';

// Sleep helper
const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

// Task Options for the Background Service
const options = {
  taskName: 'LocationTracking',
  taskTitle: 'Location Tracking Active',
  taskDesc: 'Updating location in background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'wigout://chat/jane', // Optional: Deep link
  parameters: {
    delay: 300000, // 5 minutes in milliseconds
  },
};

const veryIntensiveTask = async taskDataArguments => {
  // Infinite loop for the background service
  const {delay} = taskDataArguments;

  await new Promise(async resolve => {
    for await (const _ of BackgroundService) {
      console.log('Background Service running...');

      try {
        // Get Token from Redux Store
        const state = store.getState();
        const token = state?.user?.token; // Verify this path in Redux slice

        if (token) {
          getCurrentLocationAndNotify(token);
        } else {
          console.log('No token found in Redux store, skipping API call.');
        }
      } catch (error) {
        console.error('Background Service Error:', error);
      }

      await sleep(delay);
    }
  });
};

const getCurrentLocationAndNotify = token => {
  Geolocation.getCurrentPosition(
    async position => {
      const {latitude, longitude} = position.coords;
      console.log('Current Location:', latitude, longitude);

      // Call the API
      const res = await notifyUserForNearbyReviewedPlaces(
        token,
        latitude.toString(),
        longitude.toString(),
      );
      console.log('Notify API Response:', res);
    },
    error => {
      console.error('Location Error:', error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};

export const startBackgroundService = async () => {
  try {
    if (!BackgroundService.isRunning()) {
      await BackgroundService.start(veryIntensiveTask, options);
      console.log('Background Service Started');
    }
  } catch (e) {
    console.error('Error starting background service:', e);
  }
};

export const stopBackgroundService = async () => {
  try {
    await BackgroundService.stop();
    console.log('Background Service Stopped');
  } catch (e) {
    console.error('Error stopping background service:', e);
  }
};
