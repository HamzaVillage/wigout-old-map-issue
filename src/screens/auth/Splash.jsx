import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppImages from '../../assets/images/AppImages';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import {useCustomNavigation} from '../../utils/Hooks';

import {useDispatch} from 'react-redux';
import {setCurrentLocation} from '../../redux/Slices';
import {GetCurrentLocation} from '../../GlobalFunctions/other/GetCurrentLocation';
import LatLngIntoAddress from '../../GlobalFunctions/other/LatLngIntoAddress';

const Splash = ({onComplete}) => {
  const {navigateToRoute} = useCustomNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Fetch GPS coordinates
        const location = await GetCurrentLocation();

        if (location?.latitude && location?.longitude) {
          // 2. Convert to human-readable address
          const address = await LatLngIntoAddress(
            location.latitude,
            location.longitude,
          );

          // 3. Update Redux store
          dispatch(
            setCurrentLocation({
              latitude: location.latitude,
              longitude: location.longitude,
              address: address || 'Location identified',
            }),
          );
        }
      } catch (error) {
        console.log('Splash location fetch error:', error);
      } finally {
        // 4. Proceed to next screen regardless of location success
        // Small delay to ensure splash is visible for at least a moment
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            navigateToRoute('OnBoarding');
          }
        }, 1500);
      }
    };

    initApp();
  }, [dispatch, navigateToRoute, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={AppImages.wigOut} // app_name
          style={styles.appNameImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomSection}>
        <Image source={AppImages.main_logo} style={styles.mainLogo} />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BTNCOLOURS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bottomSection: {flex: 1},
  appNameImage: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  mainLogo: {
    height: responsiveHeight(78),
    width: responsiveWidth(100),
  },
});
