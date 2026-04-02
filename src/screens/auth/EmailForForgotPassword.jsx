import React, {useState, useCallback} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import AppColors from '../../utils/AppColors';
import {
  responsiveWidth,
  responsiveHeight,
} from '../../utils/Responsive_Dimensions';
import AppHeader from '../../components/AppHeader';
import LineBreak from '../../components/LineBreak';
import AppTextInput from '../../components/AppTextInput';
import {useCustomNavigation} from '../../utils/Hooks';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppButton from '../../components/AppButton';
import {ShowToast} from '../../utils/api_content';
import {forgotPassword} from '../../GlobalFunctions/auth';

const EmailForForgotPassword = () => {
  const {navigateToRoute} = useCustomNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = useCallback(async () => {
    // Basic regex for email validation
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) {
      return ShowToast('error', 'Email is required');
    }
    if (!emailRegex.test(email)) {
      return ShowToast('error', 'Please enter a valid email address');
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword({email: email.trim().toLowerCase()});

      if (res?.success) {
        ShowToast('success', res?.msg || 'OTP sent successfully');
        navigateToRoute('OtpVerification', {
          email: email.trim().toLowerCase(),
          userId: res?.data?.userId,
        });
      } else {
        ShowToast('error', res?.msg || res?.message || 'Something went wrong');
      }
    } catch (error) {
      ShowToast('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, navigateToRoute]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <SafeAreaView style={styles.container}>
          <AppHeader onBackPress heading={'Forgot Password'} />

          <View style={styles.body}>
            <LineBreak space={5} />
            <AppTextInput
              placeholder={'Email Address'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.footer}>
            <AppButton
              title={'Continue'}
              textColor={AppColors.WHITE}
              textSize={2}
              btnPadding={15}
              handlePress={handleForgotPassword}
              loading={isLoading}
            />
            <LineBreak space={2} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  footer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: Platform.OS === 'ios' ? 0 : responsiveHeight(2),
  },
});

export default EmailForForgotPassword;
