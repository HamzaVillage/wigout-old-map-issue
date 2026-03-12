import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ColorValue,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';

interface CustomInputProps extends TextInputProps {
  logo?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputWidth?: number;
  inputHeight?: number;
  containerBg?: ColorValue;
  isFocused?: boolean;
  borderColor?: ColorValue;
  borderWidth?: number;
  placeholderTextWeight?: TextStyle['fontWeight'];
  containerStyle?: ViewStyle;
}

const AppTextInput = ({
  logo,
  rightIcon,
  inputWidth,
  inputHeight,
  containerBg,
  isFocused,
  borderColor,
  borderWidth = 1,
  placeholderTextWeight,
  placeholderTextColor,
  style,
  containerStyle,
  ...rest // Captures all other standard TextInput props
}: CustomInputProps) => {
  const dynamicContainerStyle: ViewStyle = {
    backgroundColor: containerBg
      ? containerBg
      : isFocused
      ? AppColors.inputBlur
      : AppColors.inputBackground,
    borderColor: isFocused
      ? AppColors.BTNCOLOURS
      : borderColor || AppColors.inputBorder,
    borderWidth: isFocused ? 1 : borderWidth,
  };

  return (
    <View style={[styles.container, dynamicContainerStyle, containerStyle]}>
      {logo && <View style={styles.iconContainer}>{logo}</View>}

      <TextInput
        {...rest}
        placeholderTextColor={placeholderTextColor || AppColors.GRAY}
        style={[
          styles.input,
          {
            width: inputWidth ? responsiveWidth(inputWidth) : undefined,
            height: inputHeight ? responsiveHeight(inputHeight) : undefined,
            fontWeight: placeholderTextWeight,
          },
          style,
        ]}
      />

      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 5, // Better vertical alignment across platforms
    borderRadius: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1, // Allows input to take remaining space between icons
    color: AppColors.BLACK,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default AppTextInput;

// /* eslint-disable react-native/no-inline-styles */
// import React from 'react';
// import {View, TextInput} from 'react-native';
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from '../utils/Responsive_Dimensions';
// import AppColors from '../utils/AppColors';

// type props = {
//   logo?: any;
//   inputPlaceHolder?: any;
//   inputBgColour?: any;
//   inputWidth?: number;
//   containerBg?: any;
//   rightIcon?: any;
//   secureTextEntry?: any;
//   placeholderTextColor?: any;
//   inputHeight?: any;
//   textAlignVertical?: any;
//   placeholderTextfontWeight?: any;
//   multiline?: any;
//   value?: any;
//   onChangeText?: any;
//   onFocus?: any;
//   borderWidth?: any;
//   borderColor?: any;
//   onBlur?: any;
//   isFocused?: any;
//   readOnly?: any;
//   defaultValue?: any;
//   maxLength?: any;
// };
// const AppTextInput = ({
//   logo,
//   secureTextEntry,
//   inputPlaceHolder,
//   inputWidth = 68,
//   containerBg,
//   rightIcon,
//   placeholderTextColor,
//   inputHeight,
//   textAlignVertical,
//   placeholderTextfontWeight,
//   multiline,
//   value,
//   onChangeText,
//   onFocus,
//   onBlur,
//   borderWidth,
//   borderColor,
//   isFocused,
//   readOnly,
//   defaultValue,
//   maxLength,
// }: props) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         backgroundColor: containerBg
//           ? containerBg
//           : isFocused
//           ? AppColors.inputBlur
//           : AppColors.inputBackground,
//         paddingHorizontal: 20,
//         paddingVertical: 5,
//         borderRadius: 12,
//         alignItems: 'center',
//         gap: 10,
//         borderWidth: isFocused ? 1 : borderWidth || 1,
//         borderColor: isFocused
//           ? AppColors.BTNCOLOURS
//           : borderColor || AppColors.inputBorder, //AppColors.WHITE,
//       }}>
//       {logo}

//       <TextInput
//         placeholder={inputPlaceHolder}
//         value={value}
//         onChangeText={onChangeText}
//         placeholderTextColor={
//           placeholderTextColor ? placeholderTextColor : AppColors.GRAY
//         }
//         defaultValue={defaultValue}
//         style={{
//           width: responsiveWidth(inputWidth),
//           color: AppColors.BLACK,
//           height: inputHeight ? responsiveHeight(inputHeight) : null,
//           fontWeight: placeholderTextfontWeight
//             ? placeholderTextfontWeight
//             : null,
//         }}
//         readOnly={readOnly}
//         secureTextEntry={secureTextEntry}
//         textAlignVertical={textAlignVertical}
//         multiline={multiline}
//         onFocus={onFocus}
//         onBlur={onBlur}
//         maxLength={maxLength}
//       />

//       {rightIcon}
//     </View>
//   );
// };

// export default AppTextInput;
