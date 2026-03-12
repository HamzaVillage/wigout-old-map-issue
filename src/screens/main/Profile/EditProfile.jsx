import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DateTimePickerModal} from 'react-native-modal-datetime-picker';

import AppHeader from '../../../components/AppHeader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import LineBreak from '../../../components/LineBreak';
import AppTextInput from '../../../components/AppTextInput';
import PhoneInputScreen from '../../../components/PhoneInput';
import AppButton from '../../../components/AppButton';

import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import {baseUrl, ShowToast} from '../../../utils/api_content';
import {updateProfile} from '../../../GlobalFunctions/main';
import {UpdateProfile} from '../../../redux/Slices';

const EditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);

  // Form State
  const [image, setImage] = useState(userData?.profileImage || null);
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [nickName, setNickName] = useState(userData?.nickName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [date, setDate] = useState(
    userData?.DOB ? moment(userData.DOB, 'DD/MM/YYYY').toDate() : null,
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const phoneRef = useRef(null);

  const profileImageUrl = useMemo(() => {
    if (image && !image.startsWith('http') && !image.startsWith('file')) {
      return {uri: `${baseUrl}/${image}`};
    }
    if (image?.startsWith('file')) return {uri: image};
    return userData?.profileImage
      ? {uri: `${baseUrl}/${userData.profileImage}`}
      : AppImages.userPH;
  }, [image, userData?.profileImage]);

  const openImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(res => {
        if (res?.path) setImage(res.path);
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED')
          ShowToast('error', 'Image selection failed');
      });
  }, []);

  const handleSave = async () => {
    const number = phoneRef.current?.getValue();
    setIsLoading(true);
    let payload = {
      id: userData?._id,
      fullName: fullName,
      nickName: nickName,
      image: image?.startsWith('file') ? image : userData?.profileImage,
      number: number,
      gender: gender,
      date: date ? moment(date).format('DD/MM/YYYY') : '',
    };
    console.log('payload:-', payload);
    try {
      const res = await updateProfile(payload);

      if (res?.success) {
        ShowToast('success', 'Profile Updated Successfully');
        dispatch(UpdateProfile(res?.data));
        navigation.goBack();
      } else {
        console.log('res in else:-', res);
        ShowToast('error', res?.msg || 'Update failed');
      }
    } catch (error) {
      console.error('Update Error:', error);
      ShowToast('error', 'Network error or request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getIconColor = fieldName =>
    focusedField === fieldName ? AppColors.BTNCOLOURS : AppColors.GRAY;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenWrapper>
        <AppHeader
          onBackPress={() => navigation?.goBack()}
          heading={'Edit Profile'}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <LineBreak space={2} />

          <View style={styles.avatarContainer}>
            <ImageBackground
              source={profileImageUrl}
              imageStyle={styles.avatarImage}
              style={styles.avatarFrame}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.editIconBadge}
                onPress={openImagePicker}>
                <MaterialIcons name="edit" size={16} color={AppColors.WHITE} />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={date || new Date()}
            maximumDate={new Date()}
            onConfirm={d => {
              setDate(d);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <LineBreak space={3} />

          <View style={styles.formContainer}>
            <AppTextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'fullName'}
              logo={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={responsiveFontSize(2.5)}
                  color={getIconColor('fullName')}
                />
              }
            />

            <AppTextInput
              placeholder="Nick Name"
              value={nickName}
              onChangeText={setNickName}
              onFocus={() => setFocusedField('nickName')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'nickName'}
              logo={
                <MaterialCommunityIcons
                  name="account-details-outline"
                  size={responsiveFontSize(2.5)}
                  color={getIconColor('nickName')}
                />
              }
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setDatePickerVisibility(true)}>
              <View pointerEvents="none">
                <AppTextInput
                  placeholder="Date of Birth"
                  value={date ? moment(date).format('DD/MM/YYYY') : ''}
                  readOnly
                  logo={
                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      size={responsiveFontSize(2.5)}
                      color={AppColors.GRAY}
                    />
                  }
                />
              </View>
            </TouchableOpacity>

            <AppTextInput
              placeholder="Email"
              value={email}
              editable={false}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'email'}
              logo={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={responsiveFontSize(2.5)}
                  color={getIconColor('email')}
                />
              }
            />

            <PhoneInputScreen
              phoneRef={phoneRef}
              defaultVal={userData?.phone}
            />

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                mode="dropdown"
                dropdownIconColor={AppColors.GRAY}
                style={[
                  styles.picker,
                  {color: gender ? AppColors.BLACK : AppColors.GRAY},
                ]}>
                <Picker.Item
                  label="Select Gender"
                  value=""
                  color={AppColors.GRAY}
                />
                <Picker.Item
                  label="Male"
                  value="male"
                  color={AppColors.BLACK}
                />
                <Picker.Item
                  label="Female"
                  value="female"
                  color={AppColors.BLACK}
                />
              </Picker>
            </View>

            <LineBreak space={2} />

            <AppButton
              title="Save Changes"
              loading={isLoading}
              handlePress={handleSave}
              btnPadding={18}
            />
          </View>
          <LineBreak space={4} />
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarFrame: {
    width: 120,
    height: 120,
    backgroundColor: AppColors.WHITE,
    borderRadius: 60,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarImage: {
    borderRadius: 60,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: AppColors.BTNCOLOURS,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.WHITE,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  formContainer: {
    width: responsiveWidth(90),
    gap: 15,
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: AppColors.inputBackground,
    borderRadius: 12,
    overflow: 'hidden',
    paddingLeft: 10,
    height: responsiveHeight(6.5),
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: AppColors.BLACK,
  },
});

export default EditProfile;
