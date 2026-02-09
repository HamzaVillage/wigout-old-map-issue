/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
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
import {socialLogin} from '../../GlobalFunctions/auth';
import {ShowToast} from '../../utils/api_content';
import {setToken, setUserData} from '../../redux/Slices';
import {store} from '../../redux/Store';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {getFcmToken} from '../../GlobalFunctions/other/Firebase';

const GetStarted = () => {
  const {navigateToRoute} = useCustomNavigation();
  const [gLoading, setGLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const newFcmToken = await getFcmToken();
        console.log('FCM Token:-', newFcmToken);
        setFcmToken(newFcmToken);
      } catch (err) {
        console.error('Error fetching FCM token:', err);
      }
    };
    fetchFcmToken();
  }, []);

  const handleGoogleSignIn = async () => {
    if (gLoading) {
      return;
    }
    setGLoading(true);
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      await GoogleSignin.signOut();

      const signInResult = await GoogleSignin.signIn();

      console.log('Google signInResult:', signInResult);

      const body = {
        email: signInResult?.data?.user?.email,
        socialType: 'Google',
        socialId: signInResult?.data?.user?.id,
        fcmToken: fcmToken,
      };

      console.log('body in socialLogin:-', body);
      const res = await socialLogin(body);
      console.log('res in socialLogin:-', res);

      if (res?.success) {
        store.dispatch(setToken(res?.token));

        let data = res?.data;
        // if (data?.userName) {
        //   data = {...data, isCreated: true};
        // } else {
        //   data = {...data, isCreated: false};
        // }
        store.dispatch(setUserData(data));

        ShowToast('success', res?.msg || 'Login Successful');
      } else {
        ShowToast('error', res?.msg || res?.message || 'Authentication Failed');
      }
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google sign-in cancelled');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        console.log('Google sign-in already in progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ShowToast('error', 'Google Play Services not available');
      } else {
        console.log(
          'Google sign-in error full details:',
          JSON.stringify(err, null, 2),
        );
        console.log('Google sign-in error:', err);
        ShowToast('error', err?.message || 'Something went wrong');
      }
    } finally {
      setGLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onBackPress={false} />
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
              handlePress={handleGoogleSignIn}
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
