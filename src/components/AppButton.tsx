import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ColorValue,
  Platform,
  View,
} from 'react-native';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';
import {responsiveWidth} from '../utils/Responsive_Dimensions';

interface AppButtonProps {
  title: string;
  handlePress?: () => void;
  textColor?: ColorValue;
  textFontWeight?: boolean;
  textSize?: number;
  btnWidth?: number;
  btnBackgroundColor?: ColorValue;
  btnPadding?: number;
  borderWidth?: number;
  borderColor?: ColorValue;
  borderRadius?: number;
  leftIcon?: React.ReactNode;
  activeOpacity?: number;
  loading?: boolean;
  disabled?: boolean;
  mT?: number;
  mB?: number;
  style?: ViewStyle;
}

const AppButton = ({
  title,
  handlePress,
  leftIcon,
  borderRadius = 100,
  borderWidth = 0,
  borderColor,
  btnPadding = 15,
  btnBackgroundColor,
  btnWidth,
  textColor = AppColors.WHITE,
  textFontWeight = true,
  textSize = 2,
  activeOpacity = 0.7,
  loading = false,
  disabled = false,
  mT,
  mB,
  style,
}: AppButtonProps) => {
  // Determine if the button should be uninteractable
  const isInteractionDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={activeOpacity}
      disabled={isInteractionDisabled}
      style={[
        styles.button,
        {
          backgroundColor: btnBackgroundColor || AppColors.BTNCOLOURS,
          padding: btnPadding,
          borderRadius: borderRadius,
          width: btnWidth ? responsiveWidth(btnWidth) : '100%',
          borderWidth: borderWidth,
          borderColor: borderColor as any,
          opacity: isInteractionDisabled ? 0.6 : 1, // Visual feedback for disabled state
          marginTop: mT,
          marginBottom: mB,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor} // Loader matches text color for better visibility
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconGap}>{leftIcon}</View>}
          <AppText
            textColor={textColor}
            textSize={textSize}
            title={title}
            textFontWeight={textFontWeight}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // Standard shadow for buttons to make them look clickable
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGap: {
    marginRight: 10,
  },
});

export default AppButton;

// /* eslint-disable react-native/no-inline-styles */
// import React from 'react';
// import {ActivityIndicator, TouchableOpacity} from 'react-native';
// import AppColors from '../utils/AppColors';
// import AppText from './AppTextComps/AppText';
// import {responsiveWidth} from '../utils/Responsive_Dimensions';

// type props = {
//   title?: any;
//   handlePress?: () => void;
//   textColor?: any;
//   textFontWeight?: boolean;
//   textSize?: any;
//   btnWidth?: any;
//   btnBackgroundColor?: any;
//   btnPadding?: any;
//   borderWidth?: any;
//   borderColor?: any;
//   borderRadius?: any;
//   leftIcon?: any;
//   activeOpacity?: any;
//   loading?: any;
// };
// const AppButton = ({
//   title,
//   handlePress,
//   leftIcon,
//   borderRadius,
//   borderWidth,
//   borderColor,
//   btnPadding,
//   btnBackgroundColor,
//   btnWidth,
//   textColor = AppColors.WHITE,
//   textFontWeight = true,
//   textSize = 2.5,
//   activeOpacity,
//   loading = false,
// }: props) => {
//   return (
//     <TouchableOpacity
//       onPress={handlePress}
//       activeOpacity={activeOpacity}
//       style={{
//         backgroundColor: btnBackgroundColor
//           ? btnBackgroundColor
//           : AppColors.BTNCOLOURS,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: btnPadding ? btnPadding : 10,
//         borderRadius: borderRadius ? borderRadius : 100,
//         width: btnWidth ? responsiveWidth(btnWidth) : 'auto',
//         borderWidth: borderWidth || 0,
//         borderColor: borderColor ? borderColor : null,
//         flexDirection: 'row',
//       }}
//       disabled={loading}>
//       {leftIcon}
//       {loading ? (
//         <ActivityIndicator size={'small'} color={AppColors.WHITE} />
//       ) : (
//         <AppText
//           textColor={textColor}
//           textSize={textSize}
//           title={title}
//           textFontWeight={textFontWeight}
//         />
//       )}
//     </TouchableOpacity>
//   );
// };

// export default AppButton;
