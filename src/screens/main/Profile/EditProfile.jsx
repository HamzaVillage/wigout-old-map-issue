import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppTextInput from '../../../components/AppTextInput';
import PhoneInputScreen from '../../../components/PhoneInput';
import {useDispatch, useSelector} from 'react-redux';
import {baseUrl, ShowToast} from '../../../utils/api_content';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import AppButton from '../../../components/AppButton';
import {DateTimePickerModal} from 'react-native-modal-datetime-picker';
import {updateProfile} from '../../../GlobalFunctions/main';
import {UpdateProfile} from '../../../redux/Slices';

const EditProfile = () => {
  const phoneRef = useRef(null);
  const userData = useSelector((state: RootState) => state.user.userData);
  const [image, setImage] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [gender, setGender] = useState('male');
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const openImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(date);
    hideDatePicker();
  };

  const handleContinue = async () => {
    const number = phoneRef.current.getValue();

    setIsLoading(true);
    const res = await updateProfile({
      id: userData?._id,
      fullName: fullName,
      nickName: nickName,
      image: image ? image : `${baseUrl}/${userData?.profileImage}`,
      email: email,
      number: number,
      gender: gender,
      date: moment(date).format('D/M/YYYY'),
    });

    if (res?.success) {
      ShowToast('success', 'Profile Update Successfully');
      await dispatch(UpdateProfile(res?.data));
    } else {
      ShowToast('error', res?.msg || res?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFullName(userData?.fullName);
    setNickName(userData?.nickName);
    setDate(moment(userData?.DOB, 'DD/MM/YYYY').toDate());
    setEmail(userData?.email);
    setGender(userData?.gender);
  }, [userData]);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader onBackPress heading={'Profile'} />

        <LineBreak space={4} />

        <View style={{flex: 1, alignItems: 'center'}}>
          <ImageBackground
            source={
              image
                ? {uri: image}
                : {uri: `${baseUrl}/${userData?.profileImage}`}
            }
            imageStyle={{borderRadius: 100, position: 'relative'}}
            style={{width: 120, height: 120}}>
            <View
              style={{
                position: 'absolute',
                bottom: responsiveHeight(1),
                right: 0,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.BTNCOLOURS,
                  padding: responsiveWidth(1),
                  borderRadius: 5,
                }}
                onPress={() => openImagePicker()}>
                <MaterialIcons
                  name={'edit'}
                  size={responsiveFontSize(2)}
                  color={AppColors.WHITE}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={date}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <LineBreak space={3} />

          <View style={{width: responsiveWidth(87), gap: 20}}>
            <AppTextInput
              inputPlaceHolder={'Full Name'}
              value={fullName}
              onChangeText={text => setFullName(text)}
            />
            <AppTextInput
              inputPlaceHolder={'Nick Name'}
              value={nickName}
              onChangeText={text => setNickName(text)}
            />
            <AppTextInput
              inputPlaceHolder={'Date of Birth'}
              readOnly={true}
              value={moment(date).format('D/M/YYYY')}
              rightIcon={
                <TouchableOpacity onPress={() => showDatePicker()}>
                  <MaterialCommunityIcons
                    name={'calendar-month-outline'}
                    size={responsiveFontSize(2.5)}
                    color={AppColors.BLACK}
                  />
                </TouchableOpacity>
              }
            />
            <AppTextInput
              inputPlaceHolder={'Email'}
              value={email}
              onChangeText={text => setEmail(text)}
              rightIcon={
                <MaterialCommunityIcons
                  name={'email-outline'}
                  size={responsiveFontSize(2.5)}
                  color={AppColors.BLACK}
                />
              }
            />

            <PhoneInputScreen
              phoneRef={phoneRef}
              defaultVal={userData?.phone}
            />

            <View
              style={{
                width: responsiveWidth(85),
                alignItems: 'center',
                backgroundColor: AppColors.inputBg,
                borderRadius: 10,
                alignSelf: 'center',
                paddingLeft: responsiveWidth(4),
              }}>
              <Picker
                selectedValue={gender}
                mode="dropdown"
                dropdownIconColor={AppColors.GRAY}
                style={{
                  width: '100%',
                  color: AppColors.GRAY,
                }}
                onValueChange={itemValue => setGender(itemValue)}>
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>

            <LineBreak space={3} />

            <AppButton
              title={'Save'}
              textColor={AppColors.WHITE}
              textSize={2}
              btnPadding={18}
              loading={isLoading}
              handlePress={() => handleContinue()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
