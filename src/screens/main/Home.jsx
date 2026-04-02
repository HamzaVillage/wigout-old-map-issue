import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';

import AppColors from '../../utils/AppColors';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import {AppIcons} from '../../assets/icons';
import SVGXml from '../../components/SVGXML';
import {useCustomNavigation} from '../../utils/Hooks';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import {baseUrl} from '../../utils/api_content';
import HomeCard from '../../components/HomeCard';
import ScreenWrapper from '../../components/ScreenWrapper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FetchNearbyPlaces from '../../ApiCalls/Main/FetchNearbyPlaces';

const CATEGORIES = [
  {id: '1', name: 'Restaurants', type: 'restaurant', icon: 'restaurant'},
  {id: '2', name: 'Shops', type: 'store', icon: 'storefront'},
  {id: '3', name: 'Gas', type: 'gas_station', icon: 'local-gas-station'},
  {id: '4', name: 'Hotels', type: 'lodging', icon: 'hotel'},
  {id: '5', name: 'Shopping', type: 'shopping_mall', icon: 'shopping-bag'},
  {id: '6', name: 'Cafes', type: 'cafe', icon: 'local-cafe'},
];

const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  address: 'San Francisco, CA',
};

const Home = () => {
  const dispatch = useDispatch();
  const {navigateToRoute} = useCustomNavigation();
  const userData = useSelector(state => state.user.userData);
  const fetchedLocations = useSelector(
    state => state?.user?.places_nearby || [],
  );
  const currentLocation = useSelector(state => state.user.current_location);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  // Animation values (preserved from your original code)
  const headerAnim = useRef(new Animated.Value(0)).current;
  const recommendedAnim = useRef(new Animated.Value(0)).current;
  const nearbyAnim = useRef(new Animated.Value(0)).current;

  // Flow control states
  const [includeShowBranding, setIncludeShowBranding] = useState(true);

  // Filtered list for high-rated locations
  const recommendedLocations = [...fetchedLocations]
    .filter(item => item?.rating > 4)
    .sort((a, b) => b.rating - a.rating);

  // Fetch logic for category/location updates
  useEffect(() => {
    fetchData();
  }, [currentLocation, selectedCategory]);

  const fetchData = async () => {
    const loc =
      currentLocation?.latitude && currentLocation?.longitude
        ? currentLocation
        : DEFAULT_LOCATION;

    setIsLoading(true);
    await FetchNearbyPlaces(loc, dispatch, selectedCategory.type);
    setIsLoading(false);

    // Re-trigger entrance animations if data arrives later
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(recommendedAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(nearbyAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Start initial animations staggered
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
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
            opacity: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1], // Always keep 30% visible to avoid dim header
            }),
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
          <TouchableOpacity
            onPress={() => navigateToRoute('WishList')}
            style={styles.notificationBtn}>
            <FontAwesome
              name="bookmark"
              size={20}
              color={AppColors.BTNCOLOURS}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigateToRoute('Notifications')}
            style={styles.notificationBtn}>
            <SVGXml width="25" height="25" icon={AppIcons.notification_black} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <LineBreak space={2} />

      {/* Category Tabs Section */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}>
          {CATEGORIES.map(category => {
            const isActive = selectedCategory.id === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.tabItem, isActive && styles.activeTabItem]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}>
                <View style={styles.tabContent}>
                  <MaterialIcons
                    name={category.icon}
                    size={responsiveFontSize(2)}
                    color={isActive ? AppColors.WHITE : AppColors.GRAY}
                    style={{marginRight: 6}}
                  />
                  <AppText
                    title={category.name}
                    textColor={isActive ? AppColors.WHITE : AppColors.GRAY}
                    textSize={1.5}
                    textFontWeight={isActive}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <LineBreak space={1} />

      {/* Recommended Horizontal Section */}
      {includeShowBranding && (
        <>
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
          </View>

          <LineBreak space={2} />

          <Animated.View
            style={{
              paddingHorizontal: responsiveWidth(5),
              opacity: recommendedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 1], // Always keep 10% visible to avoid blank gap if stuck
              }),
              transform: [
                {
                  translateY: recommendedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}>
            <FlatList
              data={recommendedLocations}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `rec-${index}`}
              ListEmptyComponent={
                <AppText
                  title={`No recommended ${selectedCategory.name.toLowerCase()} found`}
                />
              }
              contentContainerStyle={{
                gap: 12,
                marginBottom: responsiveHeight(2),
              }}
              renderItem={({item}) => (
                <HomeCard
                  name={item?.name}
                  address={item?.vicinity}
                  CardImg={item?.photos?.[0]?.photo_reference}
                  category={selectedCategory.name}
                  cardHeight={30}
                  cardWidth={75}
                  cardOnPress={() =>
                    navigateToRoute('HomeDetails', {placeDetails: item})
                  }
                />
              )}
            />
          </Animated.View>

          <View style={{paddingHorizontal: responsiveWidth(5)}}>
            <LineBreak space={1} />
            <AppText
              title={`Discover ${selectedCategory.name} Nearby`}
              textColor={AppColors.BLACK}
              textSize={2}
              textFontWeight
            />
            <LineBreak space={2} />
          </View>
        </>
      )}
    </View>
  );

  console.log('fetchedLocations:-', fetchedLocations);
  console.log('recommendedLocations:-', recommendedLocations);
  return (
    <ScreenWrapper>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
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
                <AppText
                  title={`No ${selectedCategory.name.toLowerCase()} found nearby`}
                />
              </View>
            ) : null
          }
          renderItem={({item, index}) => (
            <Animated.View
              style={{
                opacity: nearbyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 1], // Always keep 10% visible
                }),
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
                category={selectedCategory.name}
                CardImg={item?.photos?.[0]?.photo_reference}
                cardOnPress={() =>
                  navigateToRoute('HomeDetails', {placeDetails: item})
                }
              />
            </Animated.View>
          )}
        />
      )}
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
    // padding: responsiveWidth(2),
    height: 40,
    width: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Tab Bar Styles (Glassmorphism)
  tabContainer: {
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: 'transparent',
    marginBottom: responsiveHeight(1),
  },
  tabScrollContent: {
    paddingHorizontal: responsiveWidth(5),
    gap: responsiveWidth(3),
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: responsiveWidth(25),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activeTabItem: {
    backgroundColor: AppColors.BTNCOLOURS,
    borderColor: AppColors.BTNCOLOURS,
    elevation: 6,
    shadowColor: AppColors.BTNCOLOURS,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});

export default Home;
