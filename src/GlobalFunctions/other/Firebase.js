import {getApp} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

export async function requestUserPermission() {
  const messagingFirebase = getMessaging(getApp());
  const authStatus = await requestPermission(messagingFirebase);
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

// -------------------- FCM Token --------------------
export async function getFcmToken() {
  const messagingFirebase = getMessaging(getApp());
  if (Platform.OS === 'ios') {
    const granted = await requestUserPermission();
    if (!granted) return null;
  }
  return await getToken(messagingFirebase);
}
