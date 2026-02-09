import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  requestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -------------------- Permissions --------------------
export async function requestUserPermission() {
  const messaging = getMessaging(getApp());
  const authStatus = await requestPermission(messaging);
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

// -------------------- FCM Token --------------------
export async function getFcmToken() {
  const messaging = getMessaging(getApp());
  if (Platform.OS === 'ios') {
    const granted = await requestUserPermission();
    if (!granted) return null;
  }
  return await getToken(messaging);
}

// ✅ Helper: Build payload to send to backend
export async function getDeviceTokenPayload(token) {
  const deviceTokenType = Platform.OS === 'ios' ? 'ios' : 'android';
  // Removed DeviceInfo dependency as it is not installed
  return {
    deviceToken: token,
    deviceTokenType,
    deviceName: Platform.OS, // Fallback
  };
}

// -------------------- Display Notification --------------------
export async function displayNotification(remoteMessage) {
  console.log(
    'Displaying Notification:',
    JSON.stringify(remoteMessage, null, 2),
  );
  try {
    const channelId = await ensureAndroidChannel();
    // Use messageId to prevent duplicate notifications
    await notifee.displayNotification({
      id: remoteMessage.messageId || undefined, // Squashes duplicates
      title:
        remoteMessage.notification?.title ||
        remoteMessage.data?.title ||
        'New Notification',
      body: remoteMessage.notification?.body || remoteMessage.data?.body || '',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.MAX,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        sound: 'default',
        vibrationPattern: [300, 500],
      },
      data: remoteMessage.data,
    });
    console.log('Notification displayed successfully');
  } catch (error) {
    console.error('Failed to display notification:', error);
  }
}

async function ensureAndroidChannel() {
  console.log('Ensuring Android Channel...');
  const channelId = await notifee.createChannel({
    id: 'wigout_high_priority', // New ID to force fresh settings
    name: 'WigOut High Priority',
    importance: AndroidImportance.MAX, // Upgraded to MAX
    sound: 'default',
    vibration: true,
  });
  console.log('Channel created/verified:', channelId);
  return channelId;
}

// -------------------- Foreground Listener --------------------
export function listenForForegroundMessages() {
  console.log('Initializing Foreground FCM Listener...');
  const messaging = getMessaging(getApp());
  return onMessage(messaging, async remoteMessage => {
    console.log(
      'Foreground FCM Message Received:',
      JSON.stringify(remoteMessage, null, 2),
    );
    if (
      (remoteMessage?.notification &&
        Object.keys(remoteMessage.notification).length > 0) ||
      (remoteMessage?.data && Object.keys(remoteMessage.data).length > 0)
    ) {
      await displayNotification(remoteMessage);
    }
  });
}

// -------------------- Background Handler --------------------
export function registerBackgroundHandler() {
  console.log('Registering Background FCM Handler...');
  const messaging = getMessaging(getApp());
  setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log(
      'Background FCM Message Received:',
      JSON.stringify(remoteMessage, null, 2),
    );
    if (
      (remoteMessage?.notification &&
        Object.keys(remoteMessage.notification).length > 0) ||
      (remoteMessage?.data && Object.keys(remoteMessage.data).length > 0)
    ) {
      await displayNotification(remoteMessage);
    }
  });
}

// -------------------- Notifee Foreground --------------------
export function registerNotifeeForegroundHandler() {
  return notifee.onForegroundEvent(async ({type, detail}) => {
    // Handle foreground events here if needed
    if (type === EventType.PRESS) {
      console.log('Notification pressed in foreground', detail.notification);
    }
  });
}

// -------------------- Notifee Background --------------------
export function registerNotifeeBackgroundHandler() {
  notifee.onBackgroundEvent(async ({type, detail}) => {
    // Handle background events here if needed
    if (type === EventType.PRESS) {
      console.log('Notification pressed in background', detail.notification);
      // Example: store event in AsyncStorage if needed
      await AsyncStorage.setItem(
        'last_notification_press',
        JSON.stringify(detail.notification),
      );
    }
  });
}
