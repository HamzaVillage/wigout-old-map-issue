/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, TouchableOpacity, Platform} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import LineBreak from '../../components/LineBreak';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppImages from '../../assets/images/AppImages';
import AppText from '../../components/AppTextComps/AppText';
import AppButton from '../../components/AppButton';
import SVGXml from '../../components/SVGXML';
import {AppIcons} from '../../assets/icons';
import {useCustomNavigation} from '../../utils/Hooks';

const GetStarted = () => {
  const {navigateToRoute} = useCustomNavigation();
  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onBackPress />
      <LineBreak space={5} />

      <View style={{paddingHorizontal: responsiveWidth(5)}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={AppImages.get_started}
            style={{width: responsiveWidth(100), height: responsiveHeight(23)}}
            resizeMode="contain"
          />

          <LineBreak space={2} />

          <AppText
            title={'Let’s you in'}
            textAlignment={'center'}
            textColor={AppColors.BLACK}
            textFontWeight
            textSize={5}
          />
          <LineBreak space={2} />

          {/* <View>
            <AppButton
              title={'Continue with Facebook'}
              btnBackgroundColor={AppColors.WHITE}
              textColor={AppColors.BLACK}
              textSize={1.8}
              borderWidth={1}
              btnPadding={15}
              borderColor={AppColors.DARKGRAY}
              btnWidth={90}
              borderRadius={10}
              leftIcon={
                <View style={{paddingHorizontal: responsiveWidth(2)}}>
                  <SVGXml
                    icon={AppIcons.facebook_rounded}
                    width={20}
                    height={20}
                  />
                </View>
              }
            />
          </View> */}

          <LineBreak space={2} />

          <View>
            <AppButton
              title={'Continue with Google'}
              btnBackgroundColor={AppColors.WHITE}
              textColor={AppColors.BLACK}
              textSize={1.8}
              borderWidth={1}
              btnPadding={15}
              borderColor={AppColors.DARKGRAY}
              btnWidth={90}
              borderRadius={10}
              leftIcon={
                <View style={{paddingHorizontal: responsiveWidth(2)}}>
                  <SVGXml icon={AppIcons.google_pay} width={20} height={20} />
                </View>
              }
            />
          </View>

          <LineBreak space={2} />

          {Platform.OS === 'ios' && (
            <View>
              <AppButton
                title={'Continue with Apple'}
                btnBackgroundColor={AppColors.WHITE}
                textColor={AppColors.BLACK}
                textSize={1.8}
                borderWidth={1}
                btnPadding={15}
                borderColor={AppColors.DARKGRAY}
                btnWidth={90}
                borderRadius={10}
                leftIcon={
                  <View style={{paddingHorizontal: responsiveWidth(2)}}>
                    <SVGXml
                      icon={AppIcons.black_apple}
                      width={20}
                      height={20}
                    />
                  </View>
                }
              />
            </View>
          )}

          <LineBreak space={4} />

          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: AppColors.GRAY,
                width: responsiveWidth(37),
                height: responsiveHeight(0.1),
              }}
            />
            <AppText
              title={'or'}
              textAlignment={'center'}
              textColor={AppColors.GRAY}
              textSize={2}
            />
            <View
              style={{
                backgroundColor: AppColors.GRAY,
                width: responsiveWidth(37),
                height: responsiveHeight(0.1),
              }}
            />
          </View>
          <LineBreak space={4} />
          <AppButton
            title={'Sign in with password'}
            handlePress={() => navigateToRoute('Login')}
            textSize={1.8}
            btnPadding={18}
            btnWidth={90}
          />
          <LineBreak space={4} />

          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <AppText
              title={'Don’t have an account?'}
              textAlignment={'center'}
              textColor={AppColors.GRAY}
              textSize={2}
            />
            <TouchableOpacity onPress={() => navigateToRoute('SignUp')}>
              <AppText
                title={'Sign up'}
                textAlignment={'center'}
                textColor={AppColors.BTNCOLOURS}
                textSize={2}
                textFontWeight
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GetStarted;
