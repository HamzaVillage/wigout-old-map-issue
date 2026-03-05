import React, {useState} from 'react';
import {View, ScrollView, FlatList, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import AppColors from '../../../utils/AppColors';
import LineTab from '../../../components/LineTab';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../../../components/AppTextComps/AppText';
import AppButton from '../../../components/AppButton';
import AppImages from '../../../assets/images/AppImages';
import CalendarView from '../../../components/CalendarView';

const tabsData = [
  {id: 1, title: 'List'},
  {id: 2, title: 'Calendar View'},
];

const data = [
  {
    id: 1,
    userImg: AppImages.resturant,
    username: 'Beauty Salon',
    location: 'Grand Park, New York',
  },
  {
    id: 2,
    userImg: AppImages.resturant,
    username: 'Beauty Salon',
    location: 'Grand Park, New York',
  },
  {
    id: 3,
    userImg: AppImages.resturant,
    username: 'Beauty Salon',
    location: 'Grand Park, New York',
  },
  {
    id: 4,
    userImg: AppImages.resturant,
    username: 'Beauty Salon',
    location: 'Grand Park, New York',
  },
];

const calendarData = [
  {
    id: 1,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 2,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 3,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 4,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 5,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 6,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    id: 7,
    prof: 'Wed',
    date: 'Feb 16 - 19',
    title: 'Lorem ipsum dolor sit amet',
  },
];

const VisitHistory = () => {
  const navigation = useNavigation();
  const [isSelectedTab, setIsSelectedTab] = useState({id: 1});

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onBackPress={() => navigation.goBack()}
        heading={'Visit History'}
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
        <View>
          <FlatList
            data={data}
            ItemSeparatorComponent={<LineBreak space={2} />}
            ListFooterComponent={<LineBreak space={2} />}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: AppColors.DARKGRAY,
                    paddingHorizontal: responsiveWidth(2),
                    marginHorizontal: responsiveWidth(5),
                    paddingVertical: responsiveHeight(1),
                    borderRadius: 7,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 7,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flexDirection: 'row', gap: 10}}>
                      <Image
                        source={item.userImg}
                        style={{width: 40, height: 40, borderRadius: 100}}
                      />
                      <View>
                        <AppText
                          title={item.username}
                          textColor={AppColors.BLACK}
                          textSize={1.7}
                          textFontWeight
                        />
                        <LineBreak space={0.2} />
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '93%',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 3,
                              alignItems: 'center',
                            }}>
                            <Ionicons
                              name={'location'}
                              size={responsiveFontSize(1.3)}
                              color={AppColors.BTNCOLOURS}
                            />
                            <AppText
                              title={item.location}
                              textColor={AppColors.GRAY}
                              textSize={1.3}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    <AppButton
                      title={'View Details'}
                      textSize={1.2}
                      btnPadding={10}
                      btnBackgroundColor={AppColors.BTNCOLOURS}
                      btnWidth={20}
                      borderRadius={4}
                      handlePress={() => navigation.navigate('HomeDetails')}
                    />
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {isSelectedTab.id == 2 && (
        <View style={{paddingHorizontal: responsiveWidth(5)}}>
          <CalendarView />
          <LineBreak space={2} />
          <FlatList
            data={calendarData}
            ItemSeparatorComponent={<LineBreak space={3} />}
            ListFooterComponent={<LineBreak space={2} />}
            ListHeaderComponent={<LineBreak space={2} />}
            renderItem={({item}) => {
              return (
                <View>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <View
                      style={{
                        backgroundColor:
                          item.id == 1 ? AppColors.BTNCOLOURS : AppColors.BLACK,
                        width: responsiveHeight(6),
                        height: responsiveHeight(6),
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <AppText
                        title={item.prof}
                        textColor={AppColors.WHITE}
                        textSize={1.7}
                        textFontWeight
                      />
                    </View>
                    <View>
                      <AppText
                        title={item.date}
                        textColor={AppColors.GRAY}
                        textSize={1.7}
                      />
                      <LineBreak space={0.5} />
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: AppColors.BTNCOLOURS,
                          paddingHorizontal: responsiveWidth(3),
                          paddingVertical: responsiveHeight(1),
                          borderRadius: 10,
                          width: responsiveWidth(74),
                        }}>
                        <AppText
                          title={item.title}
                          textColor={AppColors.BLACK}
                          textSize={1.7}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default VisitHistory;
