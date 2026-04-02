/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Install this library if not already
import AppTextInput from './AppTextInput';
import AppButton from './AppButton';
import AppColors from '../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import LineBreak from './LineBreak';

const starIcons = [
  {
    id: 1,
    icon: (
      <MaterialIcons
        name={'star'}
        size={responsiveFontSize(4.5)}
        color={AppColors.WHITE}
      />
    ),
  },
  {
    id: 2,
    icon: (
      <MaterialIcons
        name={'star'}
        size={responsiveFontSize(4.5)}
        color={AppColors.WHITE}
      />
    ),
  },
  {
    id: 3,
    icon: (
      <MaterialIcons
        name={'star'}
        size={responsiveFontSize(4.5)}
        color={AppColors.WHITE}
      />
    ),
  },
  {
    id: 4,
    icon: (
      <MaterialIcons
        name={'star'}
        size={responsiveFontSize(4.5)}
        color={AppColors.WHITE}
      />
    ),
  },
  {
    id: 5,
    icon: (
      <MaterialIcons
        name={'star-outline'}
        size={responsiveFontSize(4.5)}
        color={AppColors.WHITE}
      />
    ),
  },
];

const LeaveAReviewModal = ({
  visible,
  handleApplyOnPress,
  handleResetOnPress,
}: any) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <View>
            <LineBreak space={0.7} />

            <View
              style={{
                backgroundColor: AppColors.LIGHTGRAY,
                borderRadius: 100,
                height: responsiveHeight(0.5),
                width: responsiveWidth(10),
                alignSelf: 'center',
              }}
            />
            <LineBreak space={3} />
            <View>
              <AppText
                title={'Leave a Review'}
                textSize={2.5}
                textColor={AppColors.WHITE}
                textAlignment={'center'}
                textFontWeight
              />
              <LineBreak space={3} />
              <View
                style={{
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.DARKGRAY,
                  borderTopColor: AppColors.DARKGRAY,
                  paddingVertical: responsiveHeight(3),
                }}>
                <AppText
                  title={
                    'How was your experience with Art & Painting Training?'
                  }
                  textSize={2}
                  textColor={AppColors.WHITE}
                  textFontWeight
                  textAlignment={'center'}
                  textwidth={60}
                  lineHeight={2.7}
                />

                <LineBreak space={2} />

                <FlatList
                  data={starIcons}
                  horizontal
                  contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    gap: 12,
                  }}
                  renderItem={({item}) => {
                    return <TouchableOpacity>{item.icon}</TouchableOpacity>;
                  }}
                />
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.DARKGRAY,
                  paddingVertical: responsiveHeight(3),
                }}>
                <AppText
                  title={'Write Your Review'}
                  textSize={2}
                  textColor={AppColors.WHITE}
                  textFontWeight
                />
                <LineBreak space={2} />
                <AppTextInput
                  placeholder={
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.'
                  }
                  inputWidth={73}
                  inputHeight={16}
                  textAlignVertical="top"
                  containerBg={AppColors.BGCOLOURS}
                  placeholderTextColor={AppColors.BLACK}
                  multiline={true}
                />
              </View>
              <LineBreak space={3} />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <AppButton
                  title={'Maybe Later'}
                  textColor={AppColors.BLACK}
                  textSize={2}
                  handlePress={handleResetOnPress}
                  btnWidth={43}
                  btnPadding={15}
                  btnBackgroundColor={AppColors.WHITE}
                />
                <AppButton
                  title={'Submit'}
                  textColor={AppColors.BLACK}
                  textSize={2}
                  handlePress={handleApplyOnPress}
                  btnWidth={43}
                  btnPadding={15}
                />
              </View>
              <LineBreak space={1} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LeaveAReviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#474747',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: responsiveHeight(70),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(5),
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    left: responsiveWidth(-5),
    alignItems: 'center',
  },
  labelText: {
    backgroundColor: AppColors.THEME_COLOR,
    color: AppColors.WHITE,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: responsiveFontSize(1.3),
    borderRadius: 5,
  },
});
