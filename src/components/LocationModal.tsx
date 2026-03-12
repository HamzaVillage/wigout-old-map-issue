import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';

import AppTextInput from './AppTextInput';
import AppButton from './AppButton';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';
import LineBreak from './LineBreak';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

interface ModalProps {
  value: string;
  onChangeText: (text: string) => void;
  handlePress: () => void;
  loading?: boolean;
  fetchCurrentLocation: () => void;
  locationLoading?: boolean;
}

const LocationModal = ({
  value,
  onChangeText,
  handlePress,
  loading = false,
  fetchCurrentLocation,
  locationLoading = false,
}: ModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  return (
    <View style={styles.modal}>
      {/* Top Grabber/Handle for Bottom Sheet Look */}
      <View style={styles.grabber} />

      <LineBreak space={2} />

      <View style={styles.content}>
        <AppText
          title="Location"
          textSize={2.5}
          textColor={AppColors.BLACK}
          textAlignment="center"
          textFontWeight
        />

        <LineBreak space={1} />

        {/* Fetch Location Action */}
        <View style={styles.actionContainer}>
          {locationLoading ? (
            <ActivityIndicator size="small" color={AppColors.BLUE} />
          ) : (
            <TouchableOpacity
              onPress={fetchCurrentLocation}
              style={styles.fetchButton}
              activeOpacity={0.7}>
              <Foundation name="target-two" size={20} color={AppColors.BLUE} />
              <AppText
                title="Use Current Location"
                textColor={AppColors.BLUE}
                textSize={1.8}
              />
            </TouchableOpacity>
          )}
        </View>

        <LineBreak space={1} />

        {/* Location Display or Input */}
        <View style={styles.inputSection}>
          {isEditing ? (
            <AppTextInput
              placeholder="Enter location manually"
              value={value === 'Enter your location manually' ? '' : value}
              onChangeText={onChangeText}
              borderColor={AppColors.primaryColor}
              inputWidth={75}
              autoFocus
              rightIcon={
                <TouchableOpacity onPress={toggleEditing}>
                  <Icon
                    name="close-circle"
                    size={responsiveFontSize(2.5)}
                    color={AppColors.GRAY}
                  />
                </TouchableOpacity>
              }
            />
          ) : (
            <TouchableOpacity
              onPress={toggleEditing}
              style={styles.displayBox}
              activeOpacity={0.6}>
              <View style={styles.displayTextContainer}>
                <AppText
                  textSize={1.8}
                  title={value || 'Select Location'}
                  textAlignment="center"
                  numberOfLines={1}
                />
                <Icon
                  name="location-sharp"
                  size={responsiveFontSize(2)}
                  color={AppColors.BLACK}
                  style={styles.locationIcon}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <LineBreak space={3} />

        <AppButton
          title="Continue"
          handlePress={handlePress}
          loading={loading}
          btnPadding={18}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: responsiveHeight(40),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
  },
  grabber: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    height: 5,
    width: 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  content: {
    width: '100%',
  },
  actionContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fetchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputSection: {
    width: '100%',
    alignItems: 'center',
    minHeight: responsiveHeight(8),
    justifyContent: 'center',
  },
  displayBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppColors.appBgColor,
    paddingVertical: 15,
    width: responsiveWidth(85),
    justifyContent: 'center',
  },
  displayTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  locationIcon: {
    marginLeft: 5,
  },
});

export default LocationModal;
