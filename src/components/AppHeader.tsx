/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import BackIcon from './AppTextComps/BackIcon';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import {useCustomNavigation} from '../utils/Hooks';

type props = {
  // title?: string,
  onBackPress?: any;
  heading?: any;
  rightIcon?: any;
  middleIcon?: any;
  backIconColor?: any;
};

const AppHeader = ({
  onBackPress,
  heading,
  rightIcon,
  middleIcon,
  backIconColor,
}: props) => {
  const {goBack} = useCustomNavigation();
  const backHandler = () => {
    goBack();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        paddingTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(4),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}>
        {onBackPress && (
          <BackIcon onBackPress={backHandler} iconColor={backIconColor} />
        )}
        {middleIcon ? (
          middleIcon
        ) : (
          <AppText
            title={heading}
            textColor={backIconColor ? backIconColor : AppColors.BLACK}
            textFontWeight
            textSize={2.4}
          />
        )}
      </View>
      {rightIcon}
    </View>
  );
};

export default AppHeader;
