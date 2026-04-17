/* eslint-disable jsx-quotes */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import AppButton from './AppButton';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import LineBreak from './LineBreak';

const DeleteAccountModal = ({
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
                height: responsiveHeight(0.3),
                width: responsiveWidth(10),
                alignSelf: 'center',
              }}
            />
            <LineBreak space={3} />
            <View style={{gap: 20}}>
              <AppText
                title={'Delete Account'}
                textSize={3}
                textColor={AppColors.RED_COLOR}
                textAlignment={'center'}
                textFontWeight
              />
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: AppColors.LIGHTGRAY,
                  paddingVertical: responsiveHeight(3),
                }}>
                <AppText
                  title={'Are you sure you want to delete your account? This action cannot be undone.'}
                  textColor={'#424242'}
                  textSize={2}
                  textAlignment={'center'}
                  textFontWeight
                />
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <AppButton
                  title={'Cancel'}
                  textColor={AppColors.BTNCOLOURS}
                  textSize={2}
                  handlePress={handleResetOnPress}
                  btnWidth={43}
                  btnPadding={15}
                  btnBackgroundColor={'#f0ebee'}
                />
                <AppButton
                  title={'Yes, Delete'}
                  textColor={AppColors.WHITE}
                  textSize={2}
                  handlePress={handleApplyOnPress}
                  btnWidth={43}
                  btnPadding={15}
                  btnBackgroundColor={AppColors.BTNCOLOURS}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: responsiveHeight(35),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(5),
  },
});

export default DeleteAccountModal;
