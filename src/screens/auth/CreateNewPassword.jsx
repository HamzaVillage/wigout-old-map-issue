/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import AppImages from '../../assets/images/AppImages';
import LineBreak from '../../components/LineBreak';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import CongratulationsModal from '../../components/CongratulationsModal';
import {useCustomNavigation} from '../../utils/Hooks';
import ScreenWrapper from '../../components/ScreenWrapper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {resetPassword} from '../../GlobalFunctions/auth';
import {useRoute} from '@react-navigation/native';
import {ShowToast} from '../../utils/api_content';

const CreateNewPassword = () => {
  const {navigateToRoute} = useCustomNavigation();
  const [showPassword, setShowPassword] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFocused, setIsFocused] = useState({
    password: false,
    confirmPassword: false,
  });
  const userId = useRoute()?.params?.userId;

  const handleCreateNewPassword = async () => {
    if (!password) {
      return ShowToast('error', 'Password is required');
    }

    if (!confirmPassword) {
      return ShowToast('error', 'Confirm Password is required');
    }

    if (password !== confirmPassword) {
      return ShowToast(
        'error',
        'Password and Confirm Password must be the same.',
      );
    }

    if (password.length < 6) {
      return ShowToast('error', 'Password must be at least 6 characters');
    }

    setShowCongratsModal(true);
    const res = await resetPassword({userId: userId, newPassword: password});

    if (res?.success) {
      ShowToast('success', res?.msg);
      navigateToRoute('Login');
      setShowCongratsModal(false);
    } else {
      ShowToast('error', res?.msg || res?.message);
      setShowCongratsModal(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScreenWrapper>
        <ScrollView style={{flex: 1}}>
        <AppHeader onBackPress heading={'Create New Password'} />

        <CongratulationsModal
          visible={showCongratsModal}
          imgSrc={AppImages.CORRECT}
        />

        <LineBreak space={9} />

        <View style={{paddingHorizontal: responsiveWidth(5)}}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={AppImages.GIRL}
              style={{width: responsiveWidth(75), height: responsiveHeight(30)}}
              resizeMode="contain"
            />
          </View>

          <LineBreak space={8} />

          <AppText
            title={'Create Your New Password'}
            textColor={AppColors.BLACK}
            textSize={2}
          />

          <LineBreak space={2} />

          <View>
            <AppTextInput
              inputPlaceHolder={'Password'}
              inputWidth={68}
              isFocused={isFocused.password}
              placeholderTextColor={AppColors.BLACK}
              value={password}
              onChangeText={text => setPassword(text)}
              onFocus={() => setIsFocused(prev => ({...prev, password: true}))}
              onBlur={() => setIsFocused(prev => ({...prev, password: false}))}
              logo={
                <MaterialIcons
                  name={'lock'}
                  size={responsiveFontSize(2)}
                  color={
                    isFocused.password ? AppColors.BTNCOLOURS : AppColors.GRAY
                  }
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(prevState => ({
                      ...prevState,
                      showPassword: !prevState.showPassword,
                    }))
                  }>
                  <FontAwesome
                    name={showPassword.showPassword ? 'eye' : 'eye-slash'}
                    size={responsiveFontSize(2)}
                    color={
                      isFocused.password ? AppColors.BTNCOLOURS : AppColors.GRAY
                    }
                  />
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword.showPassword}
            />
          </View>

          <LineBreak space={2} />

          <View>
            <AppTextInput
              inputPlaceHolder={'Confirm Password'}
              inputWidth={68}
              isFocused={isFocused.confirmPassword}
              placeholderTextColor={AppColors.BLACK}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              onFocus={() =>
                setIsFocused(prev => ({...prev, confirmPassword: true}))
              }
              onBlur={() =>
                setIsFocused(prev => ({...prev, confirmPassword: false}))
              }
              logo={
                <MaterialIcons
                  name={'lock'}
                  size={responsiveFontSize(2)}
                  color={
                    isFocused.confirmPassword
                      ? AppColors.BTNCOLOURS
                      : AppColors.GRAY
                  }
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(prevState => ({
                      ...prevState,
                      showConfirmPassword: !prevState.showConfirmPassword,
                    }))
                  }>
                  <FontAwesome
                    name={
                      showPassword.showConfirmPassword ? 'eye' : 'eye-slash'
                    }
                    size={responsiveFontSize(2)}
                    color={
                      isFocused.password ? AppColors.BTNCOLOURS : AppColors.GRAY
                    }
                  />
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword.showConfirmPassword}
            />
          </View>

          <LineBreak space={3} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: responsiveHeight(3),
                width: responsiveHeight(3),
                borderWidth: rememberMe ? 0 : 3,
                borderRadius: 7,
                borderColor: AppColors.BTNCOLOURS,
                backgroundColor: rememberMe
                  ? AppColors.BTNCOLOURS
                  : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setRememberMe(prevState => !prevState)}>
              {rememberMe ? (
                <FontAwesome
                  name={'check'}
                  size={responsiveFontSize(1.7)}
                  color={AppColors.WHITE}
                />
              ) : (
                <View />
              )}
            </TouchableOpacity>
            <AppText
              title={'Remember me'}
              textColor={AppColors.BLACK}
              textSize={2}
            />
          </View>

          <LineBreak space={10} />

          <AppButton
            title={'Continue'}
            textColor={AppColors.WHITE}
            textSize={2}
            btnPadding={15}
            handlePress={() => handleCreateNewPassword()}
          />
        </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default CreateNewPassword;
