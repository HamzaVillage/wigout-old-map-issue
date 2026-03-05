import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import AppImages from '../../../assets/images/AppImages';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import AppColors from '../../../utils/AppColors';

const data = [
  {
    id: 1,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Lauralee Quintero',
    isFollow: false,
  },
  {
    id: 2,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Tanner Stafford',
    isFollow: true,
  },
  {
    id: 3,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Chantal Shelburne',
    isFollow: false,
  },
  {
    id: 4,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Maryland Winkles',
    isFollow: true,
  },
  {
    id: 5,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Sanjuanita Ordonez',
    isFollow: false,
  },
  {
    id: 6,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Marci Senter',
    isFollow: false,
  },
  {
    id: 7,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Elanor Pera',
    isFollow: false,
  },
  {
    id: 8,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Marielle Wigington',
    isFollow: true,
  },
  {
    id: 9,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Rodolfo Goode',
    isFollow: false,
  },
  {
    id: 10,
    profImg: AppImages.FACE_SCAN,
    number: '+1-300-555-0135',
    name: 'Rochel Foose',
    isFollow: false,
  },
];

const InviteFriends = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onBackPress={() => navigation.goBack()}
        heading={'Invite Friends'}
      />
      <LineBreak space={2} />

      <FlatList
        data={data}
        ItemSeparatorComponent={() => <LineBreak space={3} />}
        ListFooterComponent={() => <LineBreak space={3} />}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: responsiveWidth(5),
              }}>
              <View
                style={{flexDirection: 'row', gap: 15, alignItems: 'center'}}>
                <Image
                  source={item.profImg}
                  style={{
                    width: responsiveWidth(13),
                    height: responsiveWidth(13),
                    borderRadius: 100,
                  }}
                />
                <View>
                  <AppText
                    title={item.name}
                    textColor={AppColors.BLACK}
                    textSize={2}
                    textFontWeight
                  />
                  <AppText
                    title={item.number}
                    textColor={AppColors.GRAY}
                    textSize={1.5}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  paddingHorizontal: responsiveWidth(4),
                  paddingVertical: responsiveHeight(0.5),
                  borderRadius: 40,
                  backgroundColor: item.isFollow
                    ? 'transparent'
                    : AppColors.BTNCOLOURS,
                  borderWidth: 2,
                  borderColor: item.isFollow
                    ? AppColors.BTNCOLOURS
                    : AppColors.BTNCOLOURS,
                }}>
                <AppText
                  title={item.isFollow ? 'Invited' : 'Invite'}
                  textColor={
                    item.isFollow ? AppColors.BTNCOLOURS : AppColors.WHITE
                  }
                  textSize={1.7}
                  textFontWeight
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </ScrollView>
  );
};

export default InviteFriends;
