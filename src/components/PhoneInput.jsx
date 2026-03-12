import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

const PhoneInputScreen = ({phoneRef, defaultVal}) => {
  const countryPickerRef = useRef(null);
  const [pickerData, setPickerData] = useState([]);

  useEffect(() => {
    if (phoneRef.current) {
      setPickerData(phoneRef.current.getPickerData());
    }
  }, []);

  const onPressFlag = () => {
    countryPickerRef.current?.open();
  };

  return (
    <PhoneInput
      ref={phoneRef}
      onPressFlag={onPressFlag}
      initialCountry={'us'}
      initialValue={defaultVal}
      style={styles.container}
      textStyle={styles.textStyle}
      autoFormat
      textProps={{
        placeholder: '+1 000 000 000',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(5),
    height: responsiveHeight(6),
    borderRadius: 12,
    backgroundColor: AppColors.inputBackground,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
  },
  textStyle: {color: AppColors.BLACK, marginLeft: 10},
});

export default PhoneInputScreen;
