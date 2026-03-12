import React, {useEffect, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {OtpInput} from 'react-native-otp-entry';

import AppHeader from '../../components/AppHeader';
import AppButton from '../../components/AppButton';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppTextComps/AppText';
import ScreenWrapper from '../../components/ScreenWrapper';
import LineBreak from '../../components/LineBreak';

import {responsiveWidth} from '../../utils/Responsive_Dimensions';
import {useCustomNavigation} from '../../utils/Hooks';
import {
  forgotPassword,
  verifyOtpForResetPassword,
} from '../../GlobalFunctions/auth';
import {ShowToast} from '../../utils/api_content';
import {store} from '../../redux/Store';
import {setToken, setUserData} from '../../redux/Slices';
import {signUp} from '../../GlobalFunctions/auth';

const RESEND_TIME = 60;

const OtpVerification = () => {
  const {navigateToRoute} = useCustomNavigation();
  const route = useRoute();

  // Destructure params safely
  const {email = '', userId, from, accessToken} = route.params || {};
  const signupPayload = route.params?.signupPayload;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIME);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      return ShowToast('error', 'Please enter the full 4-digit code');
    }

    setIsLoading(true);
    try {
      const res = await verifyOtpForResetPassword({
        email,
        otp,
        token: accessToken,
      });

      if (res?.success) {
        ShowToast('success', res?.msg || 'Verification Successful');

        if (from === 'signUp') {
          store.dispatch(setToken(res?.token));
          store.dispatch(setUserData(res?.data));
          // Usually redirects to Home via Navigation container state
        } else {
          navigateToRoute('CreateNewPassword', {userId});
        }
      } else {
        ShowToast('error', res?.msg || 'Invalid OTP');
      }
    } catch (error) {
      ShowToast('error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    try {
      const res =
        from === 'signUp'
          ? await signUp(signupPayload)
          : await forgotPassword({email});
      console.log('res in resend otp', res);
      if (res?.success) {
        ShowToast('success', 'New code sent!');
        setTimer(RESEND_TIME);
      } else {
        ShowToast('error', res?.msg || 'Failed to resend OTP');
      }
    } catch (error) {
      ShowToast('error', error?.msg || 'Network error');
    } finally {
      setIsResending(false);
    }
  }, [email, timer, isResending]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppHeader onBackPress heading={'OTP Verification'} />

        <View style={styles.body}>
          <AppText
            title={`Code has been sent to`}
            textColor={AppColors.graysh}
            textSize={1.8}
          />
          <AppText
            title={email}
            textColor={AppColors.primaryColor}
            textSize={2}
            textFontWeight
          />

          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={4}
              focusColor={AppColors.BTNCOLOURS}
              onTextChange={setOtp}
              theme={{
                pinCodeContainerStyle: styles.otpBox,
                filledPinCodeContainerStyle: styles.otpBoxFilled,
                pinCodeTextStyle: styles.otpText,
                focusedPinCodeContainerStyle: styles.otpBoxFocused,
              }}
            />
          </View>

          <View style={styles.resendContainer}>
            {isResending ? (
              <ActivityIndicator size="small" color={AppColors.BTNCOLOURS} />
            ) : (
              <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
                <AppText
                  title={
                    timer > 0
                      ? `Resend code in ${timer}s`
                      : "Didn't receive code? Resend"
                  }
                  textColor={timer > 0 ? AppColors.WHITE : AppColors.BTNCOLOURS}
                  textSize={1.8}
                  textFontWeight={timer === 0}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Verify"
            handlePress={handleVerifyOtp}
            loading={isLoading}
          />
          <LineBreak space={2} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: responsiveWidth(5),
  },
  otpContainer: {
    marginVertical: 40,
    height: 100,
  },
  otpBox: {
    backgroundColor: AppColors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    width: responsiveWidth(18),
    height: responsiveWidth(18),
  },
  otpBoxFilled: {
    backgroundColor: AppColors.inputBlur,
  },
  otpBoxFocused: {
    borderColor: AppColors.BTNCOLOURS,
  },
  otpText: {
    fontSize: 24,
    color: AppColors.BLACK,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 20,
  },
  footer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: 20,
  },
});

export default OtpVerification;

// /* eslint-disable no-undef */
// /* eslint-disable react-native/no-inline-styles */
// import React, {useEffect, useState} from 'react';
// import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
// import AppHeader from '../../components/AppHeader';
// import AppButton from '../../components/AppButton';
// import AppColors from '../../utils/AppColors';
// import AppText from '../../components/AppTextComps/AppText';
// import {OtpInput} from 'react-native-otp-entry';
// import {responsiveWidth} from '../../utils/Responsive_Dimensions';
// import {useCustomNavigation} from '../../utils/Hooks';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import LineBreak from '../../components/LineBreak';
// import {useRoute} from '@react-navigation/native';
// import {
//   forgotPassword,
//   verifyOtpForResetPassword,
// } from '../../GlobalFunctions/auth';
// import {ShowToast} from '../../utils/api_content';
// import {store} from '../../redux/Store';
// import {setToken, setUserData} from '../../redux/Slices';

// const RESEND_TIME = 60;

// const OtpVerification = () => {
//   const {navigateToRoute} = useCustomNavigation();
//   const email = useRoute()?.params?.email;
//   const userId = useRoute()?.params?.userId;
//   const from = useRoute()?.params?.from;
//   const accessToken = useRoute()?.params?.accessToken;
//   const [otp, setOtp] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);
//   const [timer, setTimer] = useState(RESEND_TIME);

//   console.log('otp:-', otp);

//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       return ShowToast('error', 'OTP is required');
//     }

//     setIsLoading(true);

//     let data = {
//       // email: email,
//       token: accessToken,
//       OTP: otp,
//     };

//     const res = await verifyOtpForResetPassword(
//       // from === 'signUp' ? data :
//       {email, otp, token: accessToken},
//     );

//     console.log('res in otp verification:-', res);
//     if (res.success) {
//       ShowToast('success', res?.msg);
//       if (from === 'signUp') {
//         store.dispatch(setToken(res?.token));
//         store.dispatch(setUserData(res?.data));
//         // navigateToRoute('Login');
//       } else {
//         navigateToRoute('CreateNewPassword', {userId});
//       }
//     } else {
//       ShowToast('error', res?.msg || res?.message);
//     }
//     setIsLoading(false);
//   };

//   const handleResendOtp = async () => {
//     if (!isResending && !timer) {
//       setIsResending(true);
//       setTimer(RESEND_TIME); // restart timer
//       const res = await forgotPassword({email});
//       if (res?.success) {
//         ShowToast('success', res?.msg);
//         setIsResending(false);
//       } else {
//         ShowToast('error', 'Failed to resend OTP');
//         setIsResending(false);
//       }
//     }
//   };

//   useEffect(() => {
//     let interval;

//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer(prev => prev - 1);
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [timer]);

//   return (
//     <ScreenWrapper>
//       <View style={{flex: 1}}>
//         <AppHeader onBackPress heading={'OTP Code Verification'} />

//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             gap: 60,
//             alignItems: 'center',
//             paddingHorizontal: responsiveWidth(5),
//           }}>
//           <AppText
//             title={`Code has been send to ${email}`}
//             textColor={AppColors.BLACK}
//             textSize={2.1}
//           />
//           <View>
//             <OtpInput
//               numberOfDigits={4}
//               type="numeric"
//               focusColor={AppColors.BTNCOLOURS}
//               onFilled={text => console.log(`OTP is ${text}`)}
//               onTextChange={text => setOtp(text)}
//               theme={{
//                 pinCodeContainerStyle: {
//                   backgroundColor: 'transparent',
//                   borderRadius: 15,
//                   width: responsiveWidth(19.5),
//                 },
//                 filledPinCodeContainerStyle: {backgroundColor: '#f2f1ff'},
//                 pinCodeTextStyle: {color: AppColors.BLACK},
//               }}
//             />
//           </View>
//           {isResending ? (
//             <ActivityIndicator size={'small'} color={'#000'} />
//           ) : (
//             <TouchableOpacity onPress={() => handleResendOtp()}>
//               <AppText
//                 title={`Resend Code ${timer ? `(${timer}s)` : ''}`}
//                 textColor={AppColors.BLACK}
//                 textSize={2.1}
//               />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View
//           style={{
//             paddingHorizontal: responsiveWidth(5),
//           }}>
//           <AppButton
//             title={'Verify'}
//             textColor={AppColors.WHITE}
//             textSize={2}
//             btnPadding={15}
//             handlePress={() => handleVerifyOtp()}
//             loading={isLoading}
//           />
//         </View>
//         <LineBreak space={2} />
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default OtpVerification;
