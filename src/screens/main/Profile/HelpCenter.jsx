/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import Categories from '../../../components/Categories';
import {helpCenterCategoriesData} from '../../../utils/LocalData';
import FAQScreen from '../../../components/FAQScreen';
import SuggestionInput from '../../../components/Suggest';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import LineTab from '../../../components/LineTab';
import ScreenWrapper from '../../../components/ScreenWrapper';

const tabsData = [
  {id: 1, title: 'FAQ'},
  {id: 2, title: 'Contact us'},
];

const cardData = [
  {
    id: 1,
    icon: (
      <FontAwesome5
        name={'headphones'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Customer Service',
  },
  {
    id: 2,
    icon: (
      <FontAwesome
        name={'whatsapp'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'WhatsApp',
  },
  {
    id: 3,
    icon: (
      <MaterialCommunityIcons
        name={'web'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Website',
  },
  {
    id: 4,
    icon: (
      <Ionicons
        name={'logo-facebook'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Facebook',
  },
  {
    id: 5,
    icon: (
      <AntDesign
        name={'twitter'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Twitter',
  },
  {
    id: 6,
    icon: (
      <Entypo
        name={'instagram-with-circle'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Instagram',
  },
];

const HelpCenter = () => {
  const navigation = useNavigation();
  const [isSelectedTab, setIsSelectedTab] = useState({id: 1});
  const [isSelectedCategorie, SetIsSelectedCategorie] = useState({id: 1});

  return (
    <ScreenWrapper>
      <View style={{flex: 1}}>
        <AppHeader
          onBackPress={() => navigation.goBack()}
          heading={'Help Center'}
        />
        <LineBreak space={4} />

        <View style={{paddingHorizontal: responsiveWidth(5)}}>
        <LineTab
          data={tabsData}
          isSelectedTab={isSelectedTab}
          setIsSelectedTab={setIsSelectedTab}
          textwidth={46}
        />
      </View>
      <LineBreak space={3} />

      {isSelectedTab.id == 1 && (
        <>
          <View style={{paddingHorizontal: responsiveWidth(5)}}>
            <FlatList
              data={helpCenterCategoriesData}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{gap: 12}}
              renderItem={({item}) => {
                return (
                  <Categories
                    item={item}
                    isSelectedCategorie={isSelectedCategorie}
                    SetIsSelectedCategorie={SetIsSelectedCategorie}
                  />
                );
              }}
            />
          </View>
          <LineBreak space={3} />
          <View style={{paddingHorizontal: responsiveWidth(5)}}>
            <SuggestionInput />
          </View>
          <LineBreak space={2} />
          <View style={{paddingHorizontal: responsiveWidth(5)}}>
            <FAQScreen />
          </View>
        </>
      )}

      {isSelectedTab.id == 2 && (
        <ScrollView style={{flex: 1, paddingHorizontal: responsiveWidth(5)}}>
          <FlatList
            data={cardData}
            ItemSeparatorComponent={() => <LineBreak space={3} />}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={{
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: AppColors.appBgColor,
                    paddingHorizontal: responsiveWidth(5),
                    paddingVertical: responsiveHeight(3),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 15,
                        alignItems: 'center',
                      }}>
                      {item.icon}
                      <AppText
                        title={item.title}
                        textColor={AppColors.BLACK}
                        textSize={2}
                        textFontWeight
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      )}
      </View>
    </ScreenWrapper>
  );
};

export default HelpCenter;
