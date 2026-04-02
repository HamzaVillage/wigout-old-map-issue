/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, ImageBackground} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AppButton from '../components/AppButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppColors from '../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import LineBreak from './LineBreak';
import AppText from './AppTextComps/AppText';
import AppTextInput from './AppTextInput';

type Props = {
  sliderRef: any;
  slides: any;
  currentIndex: any;
  setShowBranding: any;
  setCurrentIndex: any;
  sectionOneBg: any;
  sectionTwoBg: any;
  rating: any;
  include: any;
};

const HomeStarter = ({
  sliderRef,
  slides,
  currentIndex,
  setShowBranding,
  setCurrentIndex,
  sectionOneBg,
  sectionTwoBg,
  rating,
  include,
}: Props) => {
  const renderDots = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
      }}>
      <View style={{flexDirection: 'row'}}>
        {slides.map((_: any, index: any) => (
          <View
            key={index}
            style={{
              width: responsiveWidth(12),
              height: 4,
              borderRadius: 4,
              backgroundColor:
                index === currentIndex
                  ? rating
                    ? AppColors.darkBlue
                    : AppColors.BTNCOLOURS
                  : AppColors.DARKGRAY,
              marginHorizontal: responsiveWidth(1),
            }}
          />
        ))}
      </View>

      <TouchableOpacity onPress={() => setShowBranding(true)}>
        <AntDesign
          name={'close'}
          size={responsiveFontSize(2.5)}
          color={rating ? AppColors.WHITE : AppColors.GRAY}
        />
      </TouchableOpacity>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      sliderRef.current?.goToSlide(currentIndex + 1, true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sliderRef.current?.goToSlide(currentIndex - 1, true);
    }
  };

  const handleDone = () => {
    setShowBranding(true);
  };

  const renderItem = ({item}: any) => (
    <View style={{paddingHorizontal: responsiveWidth(4)}}>
      <LineBreak space={2} />
      {renderDots()}
      <LineBreak space={2} />
      <AppText
        title={item.title}
        textColor={rating ? AppColors.WHITE : AppColors.BLACK}
        textSize={2}
        textwidth={80}
        textFontWeight
      />
      <LineBreak space={2} />
      {!rating && (
        <AppText
          title={item.text}
          textColor={AppColors.GRAY}
          textSize={1.8}
          lineHeight={2.7}
          textwidth={80}
        />
      )}
      {rating && (
        <View style={{flexDirection: 'row', gap: 15}}>
          {item.data &&
            item.data?.map((num: any) => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#a65842',
                    width: 48,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                  }}>
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: AppColors.WHITE,
                      width: 30,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                    }}>
                    <AppText
                      title={num.num}
                      textColor={AppColors.WHITE}
                      textSize={2.2}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
      {include && (
        <AppTextInput
          placeholder={'Type your anwer here'}
          borderWidth={1}
          borderColor={AppColors.appBgColor}
          placeholderTextColor={AppColors.appBgColor}
          inputHeight={10}
          textAlignVertical={'top'}
          containerBg={'transparent'}
        />
      )}
      {renderCustomButtons()}
    </View>
  );

  const renderCustomButtons = () => {
    if (currentIndex === 0) {
      return (
        <View
          style={{
            paddingVertical: responsiveHeight(3),
            alignItems: 'flex-end',
          }}>
          <AppButton
            title={'Next'}
            handlePress={() => handleNext()}
            textFontWeight={false}
            btnPadding={12}
            textSize={1.8}
            btnBackgroundColor={rating && AppColors.darkBlue}
          />
        </View>
      );
    }

    if (currentIndex === 1) {
      return (
        <View
          style={{
            paddingVertical: responsiveHeight(3),
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <AppButton
              title={'Previous'}
              handlePress={() => handlePrev()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              textColor={rating ? AppColors.WHITE : AppColors.GRAY}
              btnBackgroundColor={'transparent'}
            />
            <AppButton
              title={'Next'}
              handlePress={() => handleNext()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              btnBackgroundColor={rating && AppColors.darkBlue}
            />
          </View>
        </View>
      );
    }

    if (currentIndex === 2) {
      return (
        <View
          style={{
            paddingVertical: responsiveHeight(3),
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <AppButton
              title={'Previous'}
              handlePress={() => handlePrev()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              textColor={rating ? AppColors.WHITE : AppColors.GRAY}
              btnBackgroundColor={'transparent'}
            />
            <AppButton
              title={'Next'}
              handlePress={() => handleNext()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              btnBackgroundColor={rating && AppColors.darkBlue}
            />
          </View>
        </View>
      );
    }

    if (currentIndex === 3) {
      return (
        <View
          style={{
            paddingVertical: responsiveHeight(3),
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <AppButton
              title={'Previous'}
              handlePress={() => handlePrev()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              textColor={rating ? AppColors.WHITE : AppColors.GRAY}
              btnBackgroundColor={'transparent'}
            />
            <AppButton
              title={'Next'}
              handlePress={() => handleNext()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              btnBackgroundColor={rating && AppColors.darkBlue}
            />
          </View>
        </View>
      );
    }

    if (currentIndex === 4) {
      return (
        <View
          style={{
            paddingVertical: responsiveHeight(3),
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <AppButton
              title={'Previous'}
              handlePress={() => handlePrev()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              textColor={rating ? AppColors.WHITE : AppColors.GRAY}
              btnBackgroundColor={'transparent'}
            />
            <AppButton
              title={'Done'}
              handlePress={() => handleDone()}
              textFontWeight={false}
              btnPadding={12}
              textSize={1.8}
              btnBackgroundColor={rating && AppColors.darkBlue}
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View>
      <ImageBackground
        source={sectionOneBg}
        style={{
          width: responsiveWidth(88),
          height: responsiveHeight(32),
          alignSelf: 'center',
          justifyContent: 'flex-end',
          paddingHorizontal: responsiveWidth(2),
          position: 'relative',
        }}
        imageStyle={{borderRadius: 20}}>
        <ImageBackground
          source={sectionTwoBg}
          imageStyle={rating ? {borderRadius: 20} : {}}
          style={{
            position: 'absolute',
            width: responsiveWidth(88),
            elevation: 10,
            top: responsiveHeight(27),
            alignSelf: 'center',
            borderRadius: 20,
            backgroundColor: sectionTwoBg,
          }}>
          <AppIntroSlider
            ref={sliderRef}
            data={slides}
            renderItem={renderItem}
            onSlideChange={index => setCurrentIndex(index)}
            showNextButton={false}
            showSkipButton={false}
            showDoneButton={false}
            dotStyle={{display: 'none'}}
            activeDotStyle={{display: 'none'}}
          />
        </ImageBackground>
      </ImageBackground>
      <LineBreak space={2} />
    </View>
  );
};

export default HomeStarter;
