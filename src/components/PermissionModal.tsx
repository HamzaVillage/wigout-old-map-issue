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

interface PermissionModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  onAskLater: () => void;
}

const PermissionModal = ({
  visible,
  onOk,
  onCancel,
  onAskLater,
}: PermissionModalProps) => {
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
                title={'Background Location Permission'}
                textSize={2.5}
                textColor={AppColors.BTNCOLOURS}
                textFontWeight
              />
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: AppColors.LIGHTGRAY,
                  paddingVertical: responsiveHeight(2),
                }}>
                <AppText
                  title={
                    'WigOut needs access to your location in the background to notify you about nearby reviewed places.'
                  }
                  textColor={'#424242'}
                  textSize={2}
                  lineHeight={2.8}
                />
              </View>

              <View style={styles.buttonContainer}>
                <AppButton
                  title={'ASK ME LATER'}
                  textColor={AppColors.BTNCOLOURS}
                  textSize={1.5}
                  handlePress={onAskLater}
                  btnWidth={30}
                  btnPadding={12}
                  btnBackgroundColor={'#f0ebee'}
                  textFontWeight={false}
                />
                <AppButton
                  title={'CANCEL'}
                  textColor={AppColors.RED_COLOR}
                  textSize={1.5}
                  handlePress={onCancel}
                  btnWidth={25}
                  btnPadding={12}
                  btnBackgroundColor={'#fde9e9'}
                  textFontWeight={false}
                />
                <AppButton
                  title={'OK'}
                  textColor={AppColors.WHITE}
                  textSize={1.5}
                  handlePress={onOk}
                  btnWidth={25}
                  btnPadding={12}
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
    minHeight: responsiveHeight(35),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default PermissionModal;
