import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import {notifyUserForNearbyReviewedPlaces} from '../GlobalFunctions/main';
import {store} from '../redux/Store';
import {Platform} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {GetReviews} from '../ApiCalls/Main/Reviews/ReviewsApiCall';
import {GetWishList} from '../ApiCalls/Main/WishList_API/WishListAPI';
import {isWithinRadius} from '../utils/LocationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppColors from '../utils/AppColors';

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
  color: AppColors.BTNCOLOURS,
  linkingURI: 'wigout://chat/jane', // Optional: Deep link
  parameters: {
    delay: 300000, // 5 minutes in milliseconds
  },
};

const veryIntensiveTask = async taskDataArguments => {
  const {delay} = taskDataArguments;

  while (BackgroundService.isRunning()) {
    console.log('Background Service pulse...');

    try {
      const state = store.getState();
      const token = state?.user?.token;

      if (token) {
        await checkProximityAndNotify(token);
      } else {
        console.log('No token found in Redux store, skipping pulse.');
      }
    } catch (error) {
      console.error('Background Service Error:', error);
    }

    await sleep(delay);
  }
};

const checkProximityAndNotify = async token => {
  Geolocation.getCurrentPosition(
    async position => {
      const {latitude, longitude} = position.coords;
      console.log('Current Background Location:', latitude, longitude);
      // let latitude = 37.450089;
      // let longitude = -122.117392;

      // 1. Send to Backend (existing logic)
      notifyUserForNearbyReviewedPlaces(token, latitude, longitude);

      // 2. Local Geofencing Logic
      try {
        const [revRes, wishRes] = await Promise.all([
          GetReviews(token),
          GetWishList(token),
        ]);

        const reviews = revRes?.reviews || [];
        const wishlist = wishRes?.wishLists || wishRes?.data || wishRes || [];

        const allPlaces = [
          ...reviews.map(r => ({
            id: r._id,
            name: r.restaurantName,
            lat: r.latitude,
            lng: r.longitude,
            type: r.actionType, // 'Go Again' or 'Avoid'
          })),
          ...(Array.isArray(wishlist) ? wishlist : []).map(w => ({
            id: w.placeId,
            name: w.name,
            lat: w.latitude,
            lng: w.longitude,
            type: 'WishList',
          })),
        ];

        // Filter out places without coordinates
        const trackablePlaces = allPlaces.filter(p => p.lat && p.lng);

        // Get notified history to prevent spam
        const notifiedRaw = await AsyncStorage.getItem('notified_places');
        const notifiedHistory = notifiedRaw ? JSON.parse(notifiedRaw) : {};
        const now = Date.now();

        for (const place of trackablePlaces) {
          if (isWithinRadius(latitude, longitude, place.lat, place.lng, 200)) {
            // Check if notified in last 24 hours
            const lastNotified = notifiedHistory[place.id] || 0;
            if (now - lastNotified > 24 * 60 * 60 * 1000) {
              await triggerLocalNotification(place);
              notifiedHistory[place.id] = now;
            }
          }
        }

        await AsyncStorage.setItem(
          'notified_places',
          JSON.stringify(notifiedHistory),
        );
      } catch (err) {
        console.error('Geofencing logic error:', err);
      }
    },
    error => {
      console.error('Background Location Error:', error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};

const triggerLocalNotification = async place => {
  let title = 'Check this out!';
  let body = `You are near ${place.name}.`;

  if (place.type === 'Go Again') {
    title = 'Welcome back?';
    body = `You're near ${place.name}, one of your favorites!`;
  } else if (place.type === 'Avoid') {
    title = 'Heads up!';
    body = `You're near ${place.name}, which you've marked to avoid.`;
  } else if (place.type === 'WishList') {
    title = 'WishList spot nearby!';
    body = `${place.name} is on your wishlist. Why not stop by?`;
  }

  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'geofencing_notifications',
    name: 'Nearby Places Alerts',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
    },
  });
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
