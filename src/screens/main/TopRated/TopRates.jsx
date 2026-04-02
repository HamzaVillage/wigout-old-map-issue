import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppHeader from '../../../components/AppHeader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import AppColors from '../../../utils/AppColors';
import FetchNearbyPlaces from '../../../ApiCalls/Main/FetchNearbyPlaces';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import HomeCard from '../../../components/HomeCard';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CATEGORIES = [
  {id: '1', name: 'Restaurants', type: 'restaurant', icon: 'restaurant'},
  {id: '2', name: 'Shops', type: 'store', icon: 'storefront'},
  {id: '3', name: 'Gas', type: 'gas_station', icon: 'local-gas-station'},
  {id: '4', name: 'Hotels', type: 'lodging', icon: 'hotel'},
  {id: '5', name: 'Shopping', type: 'shopping_mall', icon: 'shopping-bag'},
  {id: '6', name: 'Cafes', type: 'cafe', icon: 'local-cafe'},
];

const AnimatedCard = ({item, index, navigation, selectedCategory}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 120)
        .duration(600)
        .springify()
        .damping(12)}>
      <View style={{marginBottom: responsiveHeight(2)}}>
        <HomeCard
          name={item?.name}
          address={item?.vicinity}
          CardImg={item?.photos?.[0]?.photo_reference}
          cardHeight={30}
          cardWidth={92}
          category={selectedCategory?.name}
          cardOnPress={() =>
            navigation.navigate('HomeDetails', {placeDetails: item})
          }
        />
      </View>
    </Animated.View>
  );
};

const TopRated = ({navigation}) => {
  const dispatch = useDispatch();
  const currentLocation = useSelector(state => state.user.current_location);
  const placesNearby = useSelector(state => state.user.places_nearby);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    if (currentLocation?.latitude && currentLocation?.longitude) {
      fetchData();
    }
  }, [currentLocation, selectedCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    await FetchNearbyPlaces(currentLocation, dispatch, selectedCategory.type);
    setIsLoading(false);
  };

  // Sort places by rating in descending order
  const topRatedPlaces = [...placesNearby]
    .filter(place => place.rating) // Ensure they have a rating
    .sort((a, b) => b.rating - a.rating);

  const renderItem = ({item, index}) => {
    return (
      <AnimatedCard
        item={item}
        index={index}
        navigation={navigation}
        selectedCategory={selectedCategory}
      />
    );
  };

  // console.log('selectedCategory:-', selectedCategory);
  return (
    <ScreenWrapper>
      <SafeAreaView style={{flex: 1}}>
        <AppHeader heading={`Top Rated ${selectedCategory.name}`} />

        {/* Category Tabs */}
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
                  {isActive && (
                    <Animated.View
                      layout={Layout.springify()}
                      style={styles.activeIndicator}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: responsiveWidth(4),
          }}>
          {isLoading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color={AppColors.BTNCOLOURS} />
            </View>
          ) : topRatedPlaces.length > 0 ? (
            <Animated.FlatList
              entering={FadeIn.duration(400)}
              data={topRatedPlaces}
              renderItem={renderItem}
              keyExtractor={item => item.place_id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: responsiveHeight(2),
                paddingBottom: responsiveHeight(5),
              }}
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <AppText
                title={`No ${selectedCategory.name.toLowerCase()} found nearby`}
                textColor={AppColors.GRAY}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingVertical: responsiveHeight(2),
    backgroundColor: 'transparent',
    marginTop: responsiveHeight(0.5),
  },
  tabScrollContent: {
    paddingHorizontal: responsiveWidth(4),
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
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 6,
    height: 6,
    backgroundColor: AppColors.BTNCOLOURS,
    borderRadius: 3,
  },
});

export default TopRated;
