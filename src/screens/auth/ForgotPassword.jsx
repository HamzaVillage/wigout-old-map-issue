/* eslint-disable react-native/no-inline-styles */
/* eslint-disable jsx-quotes */
import React, {useState} from 'react';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import AppHeader from '../../components/AppHeader';
import LineBreak from '../../components/LineBreak';
import {Image} from 'react-native';
import AppImages from '../../assets/images/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import AppColors from '../../utils/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/AppButton';
import {useCustomNavigation} from '../../utils/Hooks';
import ScreenWrapper from '../../components/ScreenWrapper';

const data = [
  {
    id: 1,
    icon: (
      <Ionicons
        name={'chatbubble-ellipses'}
        size={responsiveFontSize(3.3)}
        color={AppColors.WHITE}
      />
    ),
    title: 'via SMS:',
    message: '+1 111****99',
  },
  {
    id: 2,
    icon: (
      <MaterialIcons
        name={'email'}
        size={responsiveFontSize(3.3)}
        color={AppColors.WHITE}
      />
    ),
    title: 'via Email:',
    message: 'and***ley@yourdomain.com',
  },
];

const ForgotPassword = () => {
  const {navigateToRoute} = useCustomNavigation();
  const [isSelected, setIsSelected] = useState({shown: 'via_sms', id: 1});

  return (
    <ScreenWrapper>
      <ScrollView style={{flex: 1}}>
        <AppHeader onBackPress heading={'Forgot Password'} />

        <LineBreak space={8} />

        <View style={{paddingHorizontal: responsiveWidth(5)}}>
          <Image
            source={AppImages.MOBILE}
            style={{width: responsiveWidth(90), height: responsiveHeight(30)}}
            resizeMode="contain"
          />

          <LineBreak space={3} />

          <AppText
            title={
              'Select which contact details should we use to reset your password'
            }
            textColor={AppColors.BLACK}
            textSize={2.1}
          />

          <LineBreak space={3} />

          <FlatList
            data={data}
            contentContainerStyle={{gap: 15}}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={{
                    borderWidth: 3,
                    borderColor:
                      (isSelected.shown == 'via_sms' &&
                        isSelected.id == item.id) ||
                      (isSelected.shown == 'via_email' &&
                        isSelected.id == item.id)
                        ? AppColors.BTNCOLOURS
                        : AppColors.LIGHTGRAY,
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveHeight(2),
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                  }}
                  onPress={() => {
                    if (item.id == 1) {
                      setIsSelected({shown: 'via_sms', id: item.id});
                    } else {
                      setIsSelected({shown: 'via_email', id: item.id});
                    }
                  }}>
                  <View
                    style={{
                      backgroundColor: AppColors.LIGHT_BTNCOLOURS,
                      borderRadius: 100,
                      padding: responsiveWidth(5),
                    }}>
                    {item.icon}
                  </View>
                  <View style={{gap: 5}}>
                    <AppText
                      title={item.title}
                      textColor={AppColors.GRAY}
                      textSize={1.6}
                    />
                    <AppText
                      title={item.message}
                      textColor={AppColors.BLACK}
                      textSize={1.9}
                      textFontWeight
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          <LineBreak space={4} />

          <AppButton
            title={'Continue'}
            textColor={AppColors.WHITE}
            textSize={2}
            btnPadding={15}
            handlePress={() => navigateToRoute('EmailForForgotPassword')}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ForgotPassword;
