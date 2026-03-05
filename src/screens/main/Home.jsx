import React, {useState} from 'react';
import {View, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

import AppColors from '../../utils/AppColors';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import {AppIcons} from '../../assets/icons';
import SVGXml from '../../components/SVGXML';
import {useCustomNavigation} from '../../utils/Hooks';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import RecommendedCard from '../../components/RecommendedCard';
import {baseUrl} from '../../utils/api_content';

const Home = () => {
  const {navigateToRoute} = useCustomNavigation();
  const userData = useSelector(state => state.user.userData);
  const fetchedLocations = useSelector(
    state => state?.user?.places_nearby || [],
  );

  // Flow control states
  const [includeShowBranding, setIncludeShowBranding] = useState(true);

  // Filtered list for high-rated locations
  const recommendedLocations = fetchedLocations.filter(
    item => item?.rating > 4,
  );

  // console.log('fetchedLocations:-', fetchedLocations);
  const renderHeader = () => (
    <View>
      <LineBreak space={3} />
      {/* Profile and Greeting Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileSection}>
          <TouchableOpacity>
            <FastImage
              source={{
                uri: `${baseUrl}/${userData?.profileImage}`,
                priority: FastImage.priority.normal,
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={{gap: 2}}>
            <AppText
              title="Greeting 👋"
              textColor={AppColors.GRAY}
              textSize={1.7}
            />
            <AppText
              title={`${userData?.fullName ?? 'User'} ${
                userData?.nickName ?? ''
              }`}
              textColor={AppColors.BLACK}
              textSize={2.2}
              textFontWeight
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigateToRoute('Notifications')}
          style={styles.notificationBtn}>
          <SVGXml width="25" height="25" icon={AppIcons.notification_black} />
        </TouchableOpacity>
      </View>

      <LineBreak space={3} />

      {/* Recommended Horizontal Section */}
      {includeShowBranding && (
        <View style={{paddingHorizontal: responsiveWidth(5)}}>
          <View style={styles.sectionHeader}>
            <AppText
              title="Recommended"
              textColor={AppColors.BLACK}
              textSize={2}
              textFontWeight
            />
            <TouchableOpacity></TouchableOpacity>
          </View>

          <LineBreak space={2} />

          <FlatList
            data={recommendedLocations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `rec-${index}`}
            ListEmptyComponent={<AppText title="No Recommendation found" />}
            contentContainerStyle={{gap: 12, marginBottom: responsiveHeight(2)}}
            renderItem={({item}) => (
              <RecommendedCard
                item={item}
                name={item?.name}
                address={item?.vicinity}
                CardImg={item?.photos?.[0]?.photo_reference}
                bottomPadding={0.1}
                cardWidth={35.3}
                cardContainerWidth={75}
                isHeartIconMoveToEnd
                locationMaxWidth={60}
                cardOnPress={() =>
                  navigateToRoute('HomeDetails', {placeDetails: item})
                }
              />
            )}
          />

          <LineBreak space={2} />
          <AppText
            title="Discover Nearby"
            textColor={AppColors.BLACK}
            textSize={2}
            textFontWeight
          />
          <LineBreak space={2} />
        </View>
      )}
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      {/* Main Container using FlatList for better performance */}
      <FlatList
        data={includeShowBranding ? fetchedLocations : []}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        keyExtractor={(item, index) => `nearby-${index}`}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{paddingBottom: responsiveHeight(4)}}
        ListEmptyComponent={
          includeShowBranding && fetchedLocations.length === 0 ? (
            <View style={{paddingHorizontal: responsiveWidth(5)}}>
              <AppText title="No Nearby restaurants found" />
            </View>
          ) : null
        }
        renderItem={({item}) => (
          <View>
            <RecommendedCard
              item={item}
              name={item?.name}
              address={item?.vicinity}
              CardImg={item?.photos?.[0]?.photo_reference}
              cardContainerWidth={43}
              cardWidth={20}
              titleFontSize={2}
              dateFontSize={1.5}
              locationFontSize={1.3}
              containerPaddingHorizontal={2}
              textContainerPaddingHorizontal={2}
              containerPaddingVertical={0}
              containerborderRadius={25}
              bottomPadding={0.5}
              dateNumOfLines={1}
              dateMaxWidth={35}
              locationNumOfLines={1}
              locationMaxWidth={25}
              titleMaxWidth={35}
              titleNumOfLines={1}
              cardOnPress={() =>
                navigateToRoute('HomeDetails', {placeDetails: item})
              }
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: AppColors.LIGHTGRAY, // Placeholder color
  },
  notificationBtn: {
    borderWidth: 1,
    borderColor: AppColors.WHITE,
    padding: responsiveWidth(2),
    borderRadius: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
  },
});

export default Home;
