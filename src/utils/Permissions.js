import {PermissionsAndroid, Platform} from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // Check if fine location is already granted
    const fineLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (fineLocationGranted) {
      console.log('Fine location permission already granted');

      // For Android 10+ (API 29+), check background location
      if (Platform.Version >= 29) {
        const backgroundLocationGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (backgroundLocationGranted) {
          console.log('Background location permission already granted');
          return true;
        }

        // If not granted, request background location
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message:
              'WigOut needs access to your location in the background to notify you about nearby reviewed places.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Background location permission granted');
          return true;
        } else {
          console.log('Background location permission denied');
          return false;
        }
      }

      return true;
    }

    // If fine location not granted, request it
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'WigOut needs access to your location to find nearby places.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');

      // For Android 10+ (API 29+), we need background location permission
      if (Platform.Version >= 29) {
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message:
              'WigOut needs access to your location in the background to notify you about nearby reviewed places.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Background location permission granted');
          return true;
        } else {
          console.log('Background location permission denied');
          return false;
        }
      }

      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
