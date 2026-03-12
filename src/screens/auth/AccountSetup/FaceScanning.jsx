/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, ImageBackground} from 'react-native';
import AppImages from '../../../assets/images/AppImages';
import AppHeader from '../../../components/AppHeader';
import AppText from '../../../components/AppTextComps/AppText';
import AppColors from '../../../utils/AppColors';
import LineBreak from '../../../components/LineBreak';
import AppButton from '../../../components/AppButton';
import CongratulationsModal from '../../../components/CongratulationsModal';
import {useCustomNavigation} from '../../../utils/Hooks';
import ScreenWrapper from '../../../components/ScreenWrapper';

const FaceScanning = () => {
  const {navigateToRoute} = useCustomNavigation();
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  return (
    <ScreenWrapper>
      <View style={{flex: 1, padding: 20}}>
      <AppHeader onBackPress backIconColor={AppColors.WHITE} />

      <LineBreak space={5} />

      <CongratulationsModal
        visible={showCongratsModal}
        imgSrc={AppImages.DEFAULT_USER}
      />

      <View style={{flex: 1}}>
        <AppText
          title={'Face Recognition'}
          textSize={3.5}
          textColor={AppColors.WHITE}
          textAlignment={'center'}
          textFontWeight
        />

        <LineBreak space={2} />

        <AppText
          title={'Add a face recognition to make your account more secure.'}
          textSize={2}
          textColor={AppColors.LIGHTGRAY}
          textAlignment={'center'}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <AppButton
          title={'Skip'}
          textColor={AppColors.BLACK}
          textSize={2}
          handlePress={() => {
            setShowCongratsModal(true);
            setTimeout(() => {
              setShowCongratsModal(false);
              navigateToRoute('Login');
            }, 1000);
          }}
          btnWidth={42}
          btnPadding={15}
          btnBackgroundColor={AppColors.WHITE}
        />
        <AppButton
          title={'Continue'}
          textColor={AppColors.WHITE}
          textSize={2}
          handlePress={() => {
            setShowCongratsModal(true);
            setTimeout(() => {
              setShowCongratsModal(false);
              navigateToRoute('Main');
            }, 1000);
          }}
          btnWidth={42}
          btnPadding={15}
        />
      </View>
      </View>
    </ScreenWrapper>
  );
};

export default FaceScanning;
