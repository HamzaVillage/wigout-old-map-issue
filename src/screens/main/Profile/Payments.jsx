import React from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
// Components
import LineBreak from '../../../components/LineBreak';
import AppHeader from '../../../components/AppHeader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SVGXml from '../../../components/SVGXML';
import AppText from '../../../components/AppTextComps/AppText';
import AppButton from '../../../components/AppButton';

// Utils & Assets
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppColors from '../../../utils/AppColors';
import {AppIcons} from '../../../assets/icons';

const cardData = [
  {id: '1', icon: AppIcons.paypal, title: 'PayPal'},
  {id: '2', icon: AppIcons.google_pay, title: 'Google Pay'},
  {id: '3', icon: AppIcons.black_apple, title: 'Apple Pay'},
  {id: '4', icon: AppIcons.stripe, title: 'Stripe'},
  {id: '5', icon: AppIcons.master_card, title: '•••• •••• •••• •••• 4679'},
  {id: '6', icon: AppIcons.master_card, title: '•••• •••• •••• •••• 4679'},
  {id: '7', icon: AppIcons.master_card, title: '•••• •••• •••• •••• 4679'},
];

const Payments = ({navigation}) => {
  const ListHeader = () => (
    <>
      <AppHeader onBackPress={true} heading="Payments" />
      <LineBreak space={4} />
    </>
  );

  const renderPaymentItem = ({item}) => (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <SVGXml icon={item.icon} width="30" height="30" />
          <AppText
            title={item.title}
            textColor={AppColors.BLACK}
            textSize={2}
            textFontWeight
          />
        </View>
        <AppText
          title="Connected"
          textColor={AppColors.BTNCOLOURS}
          textSize={1.8}
          textFontWeight
        />
      </View>
    </TouchableOpacity>
  );

  const ListFooter = () => (
    <View style={styles.footerContainer}>
      <LineBreak space={5} />
      <AppButton
        title="Add New Account"
        textColor={AppColors.WHITE}
        btnPadding={15}
        textSize={2}
        // handlePress={() => navigation.navigate('ReviewSummary')}
      />
      <LineBreak space={2} />
    </View>
  );

  return (
    <ScreenWrapper>
      <FlatList
        data={cardData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPaymentItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ItemSeparatorComponent={() => <LineBreak space={3} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    // Add padding bottom if needed to ensure the footer isn't cut off
    paddingBottom: responsiveHeight(2),
  },
  footerContainer: {
    paddingHorizontal: responsiveWidth(5),
  },
  cardContainer: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: AppColors.appBgColor,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    marginHorizontal: responsiveWidth(5), // Moved margin here from the View wrapper
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
});

export default Payments;
