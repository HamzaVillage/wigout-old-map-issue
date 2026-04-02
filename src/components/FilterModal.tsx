/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Install this library if not already
import AppTextInput from './AppTextInput';
import AppButton from './AppButton';
import AppColors from '../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import LineBreak from './LineBreak';
import {fullCategoriesData} from '../utils/LocalData';
import Categories from './Categories';
import {Slider} from '@miblanchard/react-native-slider';

const FilterModal = ({
  visible,
  handleApplyOnPress,
  handleResetOnPress,
}: any) => {
  const navigation = useNavigation();
  const [isSelectedCategorie, SetIsSelectedCategorie] = useState({id: 1});
  const [range, setRange] = useState([5, 100]);
  const [kmRange, setKmRange] = useState([1, 50]);

  const renderLabel = (value: number) => {
    return (
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>${value}</Text>
      </View>
    );
  };

  const renderKmLabel = (value: number) => {
    return (
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>km {value}</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <View>
            <LineBreak space={0.7} />

            <View
              style={{
                backgroundColor: AppColors.LIGHTGRAY,
                borderRadius: 100,
                height: responsiveHeight(0.5),
                width: responsiveWidth(10),
                alignSelf: 'center',
              }}
            />
            <LineBreak space={3} />
            <View style={{gap: 20}}>
              <AppText
                title={'Filter'}
                textSize={2.5}
                textColor={AppColors.WHITE}
                textAlignment={'center'}
                textFontWeight
              />
              <View
                style={{
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: AppColors.WHITE,
                  borderTopColor: AppColors.WHITE,
                  paddingVertical: responsiveHeight(3),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}>
                  <AppText
                    title={'Event Category'}
                    textColor={AppColors.WHITE}
                    textSize={2}
                    textFontWeight
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AllEventsDealsAndConcert', {
                        screenName: 'Popular Event 🔥',
                      })
                    }>
                    <AppText
                      title={'See All'}
                      textColor={AppColors.BTNCOLOURS}
                      textSize={1.8}
                      textFontWeight
                    />
                  </TouchableOpacity>
                </View>

                <LineBreak space={3} />

                <View>
                  <FlatList
                    data={fullCategoriesData}
                    ItemSeparatorComponent={() => <LineBreak space={1.5} />}
                    contentContainerStyle={{
                      gap: 12,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}
                    renderItem={({item}) => {
                      return (
                        <Categories
                          item={item}
                          isSelectedCategorie={isSelectedCategorie}
                          SetIsSelectedCategorie={SetIsSelectedCategorie}
                          activeButtonBgColor={AppColors.BTNCOLOURS}
                          buttonFontSize={1.6}
                        />
                      );
                    }}
                  />
                </View>

                <LineBreak space={1} />

                <AppText
                  title={'Ticket Price Range'}
                  textSize={2}
                  textColor={AppColors.WHITE}
                  textFontWeight
                />

                <LineBreak space={4} />

                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginRight: 10,
                      alignItems: 'stretch',
                      justifyContent: 'center',
                    }}>
                    <Slider
                      value={range}
                      onValueChange={setRange}
                      step={10}
                      thumbTintColor={AppColors.THEME_COLOR}
                      minimumTrackTintColor={AppColors.THEME_COLOR}
                      maximumTrackTintColor="#d3d3d3"
                      minimumValue={5}
                      maximumValue={100}
                      renderAboveThumbComponent={(index, value) =>
                        renderLabel(value)
                      }
                    />
                  </View>
                </View>

                <LineBreak space={2} />

                <AppText
                  title={'Location'}
                  textSize={2}
                  textColor={AppColors.WHITE}
                  textFontWeight
                />

                <LineBreak space={2} />

                <AppTextInput
                  placeholder={'New York, United States'}
                  inputWidth={73}
                  rightIcon={
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={responsiveFontSize(2.5)}
                      color="#fff"
                    />
                  }
                />
                <LineBreak space={3} />

                <AppText
                  title={'Event Location Range (km)'}
                  textSize={2}
                  textColor={AppColors.WHITE}
                  textFontWeight
                />

                <LineBreak space={3} />

                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginRight: 10,
                      alignItems: 'stretch',
                      justifyContent: 'center',
                    }}>
                    <Slider
                      value={kmRange}
                      onValueChange={setKmRange}
                      step={9}
                      thumbTintColor={AppColors.THEME_COLOR}
                      minimumTrackTintColor={AppColors.THEME_COLOR}
                      maximumTrackTintColor="#d3d3d3"
                      minimumValue={1}
                      maximumValue={50}
                      renderAboveThumbComponent={(index, value) =>
                        renderKmLabel(value)
                      }
                    />
                  </View>
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <AppButton
                  title={'Reset'}
                  textColor={AppColors.BLACK}
                  textSize={2}
                  handlePress={handleResetOnPress}
                  btnWidth={43}
                  btnPadding={15}
                  btnBackgroundColor={AppColors.WHITE}
                />
                <AppButton
                  title={'Apply'}
                  textColor={AppColors.BLACK}
                  textSize={2}
                  handlePress={handleApplyOnPress}
                  btnWidth={43}
                  btnPadding={15}
                />
              </View>
              <LineBreak space={1} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#474747',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: responsiveHeight(89),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(5),
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    left: responsiveWidth(-5),
    alignItems: 'center',
  },
  labelText: {
    backgroundColor: AppColors.THEME_COLOR,
    color: AppColors.WHITE,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: responsiveFontSize(1.3),
    borderRadius: 5,
  },
});

export default FilterModal;
