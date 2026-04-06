import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppImages from '../../assets/images/AppImages';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import {useCustomNavigation} from '../../utils/Hooks';

const Splash = ({onComplete}) => {
  const {navigateToRoute} = useCustomNavigation();

  useEffect(() => {
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        // Fallback or default behavior
        navigateToRoute('OnBoarding');
      }
    }, 1500);
  }, [navigateToRoute, onComplete]);

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
