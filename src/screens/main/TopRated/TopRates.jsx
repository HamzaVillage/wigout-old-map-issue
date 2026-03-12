import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppHeader from '../../../components/AppHeader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import RecommendedCard from '../../../components/RecommendedCard';
import AppColors from '../../../utils/AppColors';
import FetchNearbyPlaces from '../../../ApiCalls/Main/FetchNearbyPlaces';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import HomeCard from '../../../components/HomeCard';

const TopRated = ({navigation}) => {
  const dispatch = useDispatch();
  const currentLocation = useSelector(state => state.user.current_location);
  const placesNearby = useSelector(state => state.user.places_nearby);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLocation?.latitude && currentLocation?.longitude) {
      fetchData();
    }
  }, [currentLocation]);

  const fetchData = async () => {
    setIsLoading(true);
    await FetchNearbyPlaces(currentLocation, dispatch);
    setIsLoading(false);
  };

  // Sort places by rating in descending order
  const topRatedPlaces = [...placesNearby]
    .filter(place => place.rating) // Ensure they have a rating
    .sort((a, b) => b.rating - a.rating);

  const renderItem = ({item}) => {
    return (
      <View style={{marginBottom: responsiveHeight(2)}}>
        {/* <RecommendedCard
          item={item}
          name={item.name}
          address={item.vicinity}
          CardImg={item.photos?.[0]?.photo_reference}
          cardContainerWidth={92}
          containerHeight={230}
          imageHeight={140}
          cardWidth={40}
          titleFontSize={2}
          locationFontSize={1.4}
          containerPaddingVertical={1.5}
          containerborderRadius={20}
          cardOnPress={() =>
            navigation.navigate('HomeDetails', {placeDetails: item})
          }
        /> */}

        <HomeCard
          name={item?.name}
          address={item?.vicinity}
          CardImg={item?.photos?.[0]?.photo_reference}
          cardHeight={30}
          cardWidth={92}
          cardOnPress={() =>
            navigation.navigate('HomeDetails', {placeDetails: item})
          }
        />
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{flex: 1}}>
      <AppHeader heading="Top Rated Restaurants" />
      <View
        style={{
          flex: 1,
          paddingHorizontal: responsiveWidth(4),
          paddingTop: responsiveHeight(2),
        }}>
        {isLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={AppColors.BTNCOLOURS} />
          </View>
        ) : topRatedPlaces.length > 0 ? (
          <FlatList
            data={topRatedPlaces}
            renderItem={renderItem}
            keyExtractor={item => item.place_id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: responsiveHeight(5)}}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <AppText
              title="No restaurants found nearby"
              textColor={AppColors.GRAY}
            />
          </View>
        )}
      </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default TopRated;
