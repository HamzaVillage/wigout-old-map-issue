/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import LineBreak from '../../components/LineBreak';
import AppImages from '../../assets/images/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import AppTextInput from '../../components/AppTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../components/AppButton';
import SVGXml from '../../components/SVGXML';
import {AppIcons} from '../../assets/icons';
import {useCustomNavigation} from '../../utils/Hooks';
import {signIn, socialLogin} from '../../GlobalFunctions/auth';
import {signUpAndSignInFormValidation} from '../../utils/Validation';
import {ShowToast} from '../../utils/api_content';
import {setToken, setUserData} from '../../redux/Slices';
import {store} from '../../redux/Store';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {getFcmToken} from '../../GlobalFunctions/other/Firebase';
import {cleanSingle} from 'react-native-image-crop-picker';

// AsyncStorage keys
const REMEMBER_ME_EMAIL = '@rememberedEmail';
const REMEMBER_ME_PASSWORD = '@rememberedPassword';
const REMEMBER_ME_ENABLED = '@rememberMeEnabled';

const Login = () => {
  const [isFocused, setIsFocused] = useState({email: false, password: false});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {navigateToRoute, navigation} = useCustomNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  console.log('fcmToken', fcmToken);

  const loadSavedCredentials = useCallback(async () => {
    try {
      const savedEmail = await AsyncStorage.getItem(REMEMBER_ME_EMAIL);
      const savedPassword = await AsyncStorage.getItem(REMEMBER_ME_PASSWORD);
      const isRememberMeEnabled = await AsyncStorage.getItem(
        REMEMBER_ME_ENABLED,
      );

      if (isRememberMeEnabled === 'true' && savedEmail) {
        setEmail(savedEmail);
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  }, []);

  useEffect(() => {
    loadSavedCredentials();
  }, [loadSavedCredentials]);

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const newFcmToken = await getFcmToken();
        console.log('FCM Token:', newFcmToken);
        setFcmToken(newFcmToken);
      } catch (err) {
        console.error('Error fetching FCM token:', err);
      }
    };
    fetchFcmToken();
  }, []);

  const handleSignIn = async () => {
    const isValid = signUpAndSignInFormValidation(email, password);
    if (isValid !== true) return;

    setIsLoading(true);
    try {
      const res = await signIn({
        email: email?.trim().toLowerCase(),
        password: password,
        fcmToken,
      });

      if (res?.success) {
        if (rememberMe) {
          await AsyncStorage.multiSet([
            [REMEMBER_ME_EMAIL, email],
            [REMEMBER_ME_PASSWORD, password],
            [REMEMBER_ME_ENABLED, 'true'],
          ]);
        } else {
          await AsyncStorage.multiRemove([
            REMEMBER_ME_EMAIL,
            REMEMBER_ME_PASSWORD,
            REMEMBER_ME_ENABLED,
          ]);
        }

        store.dispatch(setToken(res?.accessToken));
        store.dispatch(setUserData(res?.data));
        ShowToast('success', res?.msg || 'Login Successful');
      } else {
        ShowToast('error', res?.msg || res?.message || 'Authentication Failed');
      }
    } catch (error) {
      ShowToast('error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader onBackPress={false} />

        <View style={{paddingHorizontal: responsiveWidth(5)}}>
          <View style={{width: responsiveWidth(100), alignItems: 'center'}}>
            <Image
              source={AppImages.signup_logo}
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(25),
              }}
              resizeMode="contain"
            />
          </View>

          <LineBreak space={2} />
          <AppText
            title={'Login to Your Account'}
            textAlignment={'center'}
            textColor={AppColors.BLACK}
            textFontWeight
            textSize={3}
          />
          <LineBreak space={4} />

          <View>
            <AppTextInput
              inputPlaceHolder={'Email'}
              inputWidth={70}
              keyboardType="email-address"
              autoCapitalize="none"
              isFocused={isFocused.email}
              onFocus={() => setIsFocused(prev => ({...prev, email: true}))}
              onBlur={() => setIsFocused(prev => ({...prev, email: false}))}
              placeholderTextColor={AppColors.GRAY}
              value={email}
              onChangeText={setEmail}
              logo={
                <MaterialIcons
                  name={'email'}
                  size={responsiveFontSize(2.2)}
                  color={
                    isFocused.email ? AppColors.BTNCOLOURS : AppColors.GRAY
                  }
                />
              }
            />

            <LineBreak space={2} />

            <AppTextInput
              inputPlaceHolder={'Password'}
              inputWidth={70}
              isFocused={isFocused.password}
              placeholderTextColor={AppColors.GRAY}
              onFocus={() => setIsFocused(prev => ({...prev, password: true}))}
              onBlur={() => setIsFocused(prev => ({...prev, password: false}))}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              logo={
                <MaterialIcons
                  name={'lock'}
                  size={responsiveFontSize(2.2)}
                  color={
                    isFocused.password ? AppColors.BTNCOLOURS : AppColors.GRAY
                  }
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={responsiveFontSize(2)}
                    color={AppColors.GRAY}
                  />
                </TouchableOpacity>
              }
            />

            <LineBreak space={2} />

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
              onPress={() => setRememberMe(!rememberMe)}>
              <View
                style={{
                  height: 22,
                  width: 22,
                  borderWidth: 2,
                  borderRadius: 6,
                  borderColor: AppColors.BTNCOLOURS,
                  backgroundColor: rememberMe
                    ? AppColors.BTNCOLOURS
                    : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {rememberMe && (
                  <FontAwesome
                    name={'check'}
                    size={12}
                    color={AppColors.WHITE}
                  />
                )}
              </View>
              <AppText
                title={'Remember me'}
                textColor={AppColors.BLACK}
                textSize={1.8}
              />
            </TouchableOpacity>

            <LineBreak space={3} />

            <View style={{alignItems: 'center'}}>
              <AppButton
                title={'Sign in'}
                handlePress={handleSignIn}
                textSize={1.8}
                btnPadding={18}
                btnWidth={90}
                loading={isLoading}
              />

              <LineBreak space={2} />

              <TouchableOpacity
                onPress={() => navigateToRoute('ForgotPassword')}>
                <AppText
                  title={'Forgot the password?'}
                  textColor={AppColors.BTNCOLOURS}
                  textSize={1.8}
                  textFontWeight
                />
              </TouchableOpacity>

              <LineBreak space={4} />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                }}>
                <View
                  style={{flex: 1, height: 1, backgroundColor: AppColors.GRAY}}
                />
                <AppText
                  title={' or continue with '}
                  textColor={AppColors.GRAY}
                  textSize={1.8}
                />
                <View
                  style={{flex: 1, height: 1, backgroundColor: AppColors.GRAY}}
                />
              </View>

              <LineBreak space={4} />

              <View style={{flexDirection: 'row', gap: 20}}>
                {/* <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#EEE',
                    width: responsiveWidth(18),
                    height: responsiveHeight(7),
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SVGXml
                    icon={AppIcons.facebook_rounded}
                    width={25}
                    height={25}
                  />
                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  style={{
                    borderWidth: 1,
                    borderColor: '#EEE',
                    width: responsiveWidth(18),
                    height: responsiveHeight(7),
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {gLoading ? (
                    <ActivityIndicator size="small" color={AppColors.BLACK} />
                  ) : (
                    <SVGXml icon={AppIcons.google_pay} width={25} height={25} />
                  )}
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: '#EEE',
                      width: responsiveWidth(18),
                      height: responsiveHeight(7),
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <SVGXml
                      icon={AppIcons.black_apple}
                      width={25}
                      height={25}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <LineBreak space={4} />

              <View style={{flexDirection: 'row', gap: 5, marginBottom: 20}}>
                <AppText
                  title={"Don't have an account?"}
                  textColor={AppColors.GRAY}
                  textSize={1.8}
                />
                <TouchableOpacity onPress={() => navigateToRoute('SignUp')}>
                  <AppText
                    title={'Sign up'}
                    textColor={AppColors.BTNCOLOURS}
                    textSize={1.8}
                    textFontWeight
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
