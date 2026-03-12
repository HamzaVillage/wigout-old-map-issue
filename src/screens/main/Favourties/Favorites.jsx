/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import ScreenWrapper from '../../../components/ScreenWrapper';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';

const Favorites = () => {
  return (
    <ScreenWrapper>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <AppText
          title={'This page is under construction'}
          textAlignment={'center'}
          textColor={AppColors.BLACK}
          textFontWeight
          textSize={3}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Favorites;
