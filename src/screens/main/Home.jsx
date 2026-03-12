import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from 'react-native';
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
import {baseUrl} from '../../utils/api_content';
import HomeCard from '../../components/HomeCard';
import ScreenWrapper from '../../components/ScreenWrapper';
import Entypo from 'react-native-vector-icons/Entypo';

const Home = () => {
  const {navigateToRoute} = useCustomNavigation();
  const userData = useSelector(state => state.user.userData);
  const fetchedLocations = useSelector(
    state => state?.user?.places_nearby || [],
  );

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const recommendedAnim = useRef(new Animated.Value(0)).current;
  const nearbyAnim = useRef(new Animated.Value(0)).current;

  // Flow control states
  const [includeShowBranding, setIncludeShowBranding] = useState(true);

  // Filtered list for high-rated locations
  const recommendedLocations = fetchedLocations.filter(
    item => item?.rating > 4,
  );

  useEffect(() => {
    // Start animations sequentially
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(recommendedAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(nearbyAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderHeader = () => (
    <View>
      <LineBreak space={3} />
      {/* Profile and Greeting Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}>
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
        <View style={{flexDirection: 'row', gap: 10}}>
          {/* <TouchableOpacity
            onPress={() => navigateToRoute('SetLocation')}
            style={styles.notificationBtn}>
            <Entypo name="location-pin" size={24} color={AppColors.darkBlue} />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => navigateToRoute('Notifications')}
            style={styles.notificationBtn}>
            <SVGXml width="25" height="25" icon={AppIcons.notification_black} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <LineBreak space={3} />

      {/* Recommended Horizontal Section */}
      {includeShowBranding && (
        <Animated.View
          style={{
            paddingHorizontal: responsiveWidth(5),
            opacity: recommendedAnim,
            transform: [
              {
                translateY: recommendedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}>
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
            keyExtractor={(_, index) => `rec-${index}`}
            ListEmptyComponent={<AppText title="No Recommendation found" />}
            contentContainerStyle={{gap: 12, marginBottom: responsiveHeight(2)}}
            renderItem={({item}) => (
              <HomeCard
                name={item?.name}
                address={item?.vicinity}
                CardImg={item?.photos?.[0]?.photo_reference}
                cardHeight={30}
                cardWidth={75}
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
        </Animated.View>
      )}
    </View>
  );

  console.log('fetchedLocations:-', fetchedLocations);
  console.log('recommendedLocations:-', recommendedLocations);
  return (
    <ScreenWrapper>
      {/* Main Container using FlatList for better performance */}
      <FlatList
        data={includeShowBranding ? fetchedLocations : []}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        keyExtractor={(_, index) => `nearby-${index}`}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{paddingBottom: responsiveHeight(4)}}
        ListEmptyComponent={
          includeShowBranding && fetchedLocations.length === 0 ? (
            <View style={{paddingHorizontal: responsiveWidth(5)}}>
              <AppText title="No Nearby restaurants found" />
            </View>
          ) : null
        }
        renderItem={({item, index}) => (
          <Animated.View
            style={{
              opacity: nearbyAnim,
              transform: [
                {
                  translateY: nearbyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}>
            <HomeCard
              name={item?.name}
              address={item?.vicinity}
              CardImg={item?.photos?.[0]?.photo_reference}
              cardOnPress={() =>
                navigateToRoute('HomeDetails', {placeDetails: item})
              }
            />
          </Animated.View>
        )}
      />
    </ScreenWrapper>
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
