import React from 'react';
import {View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import LineBreak from '../../../components/LineBreak';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppColors from '../../../utils/AppColors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppIcons} from '../../../assets/icons';
import SVGXml from '../../../components/SVGXML';
import AppText from '../../../components/AppTextComps/AppText';
import AppButton from '../../../components/AppButton';

const cardData = [
  {id: 1, icon: AppIcons.paypal, title: 'PayPal'},
  {id: 2, icon: AppIcons.google_pay, title: 'Google Pay'},
  {id: 3, icon: AppIcons.black_apple, title: 'Apple Pay'},
  {id: 4, icon: AppIcons.stripe, title: 'Stripe'},
  {id: 5, icon: AppIcons.master_card, title: '•••• •••• •••• •••• 4679'},
  {id: 6, icon: AppIcons.master_card, title: '•••• •••• •••• •••• 4679'},
  {id: 7, icon: AppIcons.master_card, title: '•••• •••• •••• •••• 4679'},
];

const Payments = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{flex: 1}}>
      <AppHeader
        onBackPress={() => navigation.goBack()}
        heading="Payments"
        rightIcon={
          <MaterialCommunityIcons
            name={'line-scan'}
            size={responsiveFontSize(3)}
            color={AppColors.WHITE}
          />
        }
      />
      <LineBreak space={4} />

      <View style={{paddingHorizontal: responsiveWidth(5)}}>
        <FlatList
          data={cardData}
          ItemSeparatorComponent={() => <LineBreak space={3} />}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.WHITE,
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveHeight(3),
                  borderRadius: 25,
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
                    <SVGXml icon={item.icon} width={'30'} height={'30'} />
                    <AppText
                      title={item.title}
                      textColor={AppColors.BLACK}
                      textSize={2}
                      textFontWeight
                    />
                  </View>
                  <AppText
                    title={'Connected'}
                    textColor={AppColors.BTNCOLOURS}
                    textSize={1.8}
                    textFontWeight
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <LineBreak space={5} />
        <AppButton
          title={'Add New Account'}
          textColor={AppColors.WHITE}
          btnPadding={15}
          textSize={2}
          handlePress={() => navigation.navigate('ReviewSummary')}
        />
        <LineBreak space={2} />
      </View>
    </ScrollView>
  );
};

export default Payments;
