import React, {useEffect, useRef, useState, memo, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-map-clustering';
import {Marker, PROVIDER_GOOGLE, Callout} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Components & Utils
import AppText from '../../../components/AppTextComps/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import LineBreak from '../../../components/LineBreak';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppImages from '../../../assets/images/AppImages';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {baseUrl, Google_Places_Images} from '../../../utils/api_content';
import {GetReviews} from '../../../ApiCalls/Main/Reviews/ReviewsApiCall';
import FetchNearbyPlaces from '../../../ApiCalls/Main/FetchNearbyPlaces';

const Discover = ({navigation}) => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const token = useSelector(state => state.user.token);
  const userData = useSelector(state => state.user.userData);
  const currentLocation = useSelector(state => state.user.current_location);
  const fetchedLocations = useSelector(state => state?.user?.places_nearby);

  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  // Sync markers whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (
        currentLocation?.latitude !== null &&
        currentLocation?.longitude !== null
      ) {
        fetchData();
      }
    }, [currentLocation, token]),
  );

  // Initial focus on user location
  useEffect(() => {
    if (
      currentLocation?.latitude !== null &&
      currentLocation?.longitude !== null &&
      mapRef.current
    ) {
      const region = {
        latitude: Number(currentLocation.latitude),
        longitude: Number(currentLocation.longitude),
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      setMapRegion(region);
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [currentLocation]);

  const fetchData = async (location = currentLocation) => {
    if (!location?.latitude || !location?.longitude) return;
    try {
      setLoadingReviews(true);

      // 1. Fetch user reviews
      const reviews = await GetReviews(token);
      if (Array.isArray(reviews)) {
        setUserReviews(reviews);
      }

      // 2. Fetch ALL nearby places for the given location
      await FetchNearbyPlaces(location, dispatch, 'all');
    } catch (error) {
      console.log('Error refreshing Discover markers:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleRegionChangeComplete = newRegion => {
    setMapRegion(newRegion);
    // ✅ AUTOMATICALLY SEARCH THIS AREA
    fetchData(newRegion);
  };

  // Handle navigation to details
  const handleMarkerPress = useCallback(
    place => {
      const formattedPlace = {
        ...place,
        place_id: place.place_id || place.placeId,
        name: place.name || place.restaurantName,
        photos:
          place.photos ||
          (place.imageUrl ? [{photo_reference: place.imageUrl}] : []),
      };
      navigation.navigate('HomeDetails', {placeDetails: formattedPlace});
    },
    [navigation],
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          clusterColor={AppColors.BTNCOLOURS}
          animationEnabled={true}
          onRegionChangeComplete={handleRegionChangeComplete}
          initialRegion={{
            latitude: currentLocation?.latitude || 37.78825,
            longitude: currentLocation?.longitude || -122.4324,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          }}>
          {/* ✅ USER LOCATION MARKER (FIXED) */}
          {currentLocation?.latitude !== null && (
            <Marker
              cluster={false}
              coordinate={{
                latitude: Number(currentLocation.latitude),
                longitude: Number(currentLocation.longitude),
              }}
              title="You"
              description="Your Current Location"
              zIndex={10}
              flat={false}>
              <View style={styles.userMarkerOuter}>
                <View style={styles.userMarkerInner}>
                  <FastImage
                    source={
                      userData?.profileImage
                        ? {uri: `${baseUrl}/${userData.profileImage}`}
                        : AppImages.USER_PLACEHOLDER
                    }
                    style={styles.userMarkerImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={styles.userMarkerArrow} />
              </View>
            </Marker>
          )}

          {/* PERSONAL REVIEWS */}
          {userReviews.map((review, index) => (
            <Marker
              key={`review-${review.placeId || index}`}
              coordinate={{
                latitude: Number(review.latitude),
                longitude: Number(review.longitude),
              }}
              onPress={() => handleMarkerPress(review)}
              zIndex={4}>
              <View
                style={[
                  styles.reviewMarkerContainer,
                  {
                    borderColor:
                      review.actionType === 'Avoid'
                        ? AppColors.Red
                        : AppColors.ThemeColor,
                  },
                ]}>
                <Ionicons
                  name={
                    review.actionType === 'Avoid' ? 'close-circle' : 'heart'
                  }
                  size={24}
                  color={
                    review.actionType === 'Avoid'
                      ? AppColors.Red
                      : AppColors.ThemeColor
                  }
                />
              </View>
              <Callout>
                <View style={{padding: 5, minWidth: 100}}>
                  <AppText title={review.restaurantName} textFontWeight />
                  <AppText
                    title={review.actionType}
                    textColor={
                      review.actionType === 'Avoid'
                        ? AppColors.Red
                        : AppColors.ThemeColor
                    }
                  />
                </View>
              </Callout>
            </Marker>
          ))}

          {/* NEARBY GOOGLE PLACES */}
          {Array.isArray(fetchedLocations) &&
            fetchedLocations.map((place, index) => {
              const lat = place?.geometry?.location?.lat;
              const lng = place?.geometry?.location?.lng;
              if (!lat || !lng) return null;

              const hasReview = userReviews.some(
                r =>
                  r.placeId === place.place_id || r.placeId === place.placeId,
              );
              if (hasReview) return null;

              return (
                <OptimizedMarker
                  key={`${place.place_id}-${index}`}
                  place={place}
                  onPress={() => handleMarkerPress(place)}
                  coordinate={{latitude: lat, longitude: lng}}
                />
              );
            })}
        </MapView>

        {/* FLOATING HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={{flex: 1}}>
              <View style={styles.row}>
                <Entypo
                  name={'location-pin'}
                  size={18}
                  color={AppColors.BTNCOLOURS}
                />
                <AppText
                  title={'Location (within 100 Miles)'}
                  textColor={AppColors.GRAY}
                  textSize={1.2}
                />
              </View>
              <AppText
                title={currentLocation?.address || 'Searching location...'}
                textColor={AppColors.BLACK}
                textSize={1.5}
                textFontWeight
                numberOfLines={2}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('SetLocation')}
              style={styles.changeBtn}>
              <AntDesign name={'edit'} size={14} color={AppColors.WHITE} />
              <AppText
                title={'Change'}
                textColor={AppColors.WHITE}
                textSize={1.4}
                textFontWeight
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOADING INDICATOR */}
        {loadingReviews && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={AppColors.BTNCOLOURS} />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

/* ✅ SMART MARKER COMPONENT (LIKE GOOGLE MAPS) */
const OptimizedMarker = memo(({place, coordinate, onPress}) => {
  const getCategoryTheme = () => {
    const types = place.types || [];

    // Food & Drink (Red/Orange)
    if (
      types.includes('restaurant') ||
      types.includes('food') ||
      types.includes('cafe') ||
      types.includes('bakery') ||
      types.includes('bar')
    ) {
      return {icon: 'restaurant', color: '#FF7043', name: 'Ionicons'};
    }

    // Shopping (Blue)
    if (
      types.includes('shopping_mall') ||
      types.includes('store') ||
      types.includes('supermarket') ||
      types.includes('clothing_store') ||
      types.includes('electronics_store')
    ) {
      return {
        icon: 'shopping',
        color: '#42A5F5',
        name: 'MaterialCommunityIcons',
      };
    }

    // Outdoors & Nature (Green)
    if (
      types.includes('park') ||
      types.includes('nature_reserve') ||
      types.includes('campground') ||
      types.includes('zoo') ||
      types.includes('aquarium')
    ) {
      return {icon: 'tree', color: '#66BB6A', name: 'MaterialCommunityIcons'};
    }

    // Lodging (Brown)
    if (types.includes('lodging') || types.includes('hotel')) {
      return {icon: 'bed', color: '#8D6E63', name: 'MaterialCommunityIcons'};
    }

    // Gas Stations & Car Services (Indigo)
    if (types.includes('gas_station') || types.includes('car_repair')) {
      return {
        icon: 'gas-station',
        color: '#5C6BC0',
        name: 'MaterialCommunityIcons',
      };
    }

    // Culture & Sightseeing (Purple)
    if (
      types.includes('museum') ||
      types.includes('art_gallery') ||
      types.includes('tourist_attraction') ||
      types.includes('church') ||
      types.includes('place_of_worship')
    ) {
      return {icon: 'bank', color: '#9575CD', name: 'MaterialCommunityIcons'};
    }

    // Health & Wellness (Teal)
    if (
      types.includes('hospital') ||
      types.includes('pharmacy') ||
      types.includes('gym') ||
      types.includes('spa')
    ) {
      return {
        icon: 'medical-bag',
        color: '#26A69A',
        name: 'MaterialCommunityIcons',
      };
    }

    // Entertainment (Pink)
    if (
      types.includes('movie_theater') ||
      types.includes('amusement_park') ||
      types.includes('night_club') ||
      types.includes('casino')
    ) {
      return {icon: 'movie', color: '#EC407A', name: 'MaterialCommunityIcons'};
    }

    // Default Fallback
    return {
      icon: 'location',
      color: AppColors.BTNCOLOURS,
      name: 'Ionicons',
    };
  };

  const theme = getCategoryTheme();

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View
        style={[
          styles.smartMarker,
          {
            backgroundColor: theme.color,
            borderWidth: 2,
            borderColor: AppColors.BTNCOLOURS,
          },
        ]}>
        {theme.name === 'Ionicons' ? (
          <Ionicons name={theme.icon} size={14} color="#FFF" />
        ) : (
          <MaterialCommunityIcons name={theme.icon} size={14} color="#FFF" />
        )}
      </View>
      <Callout tooltip>
        <View style={styles.calloutContainer}>
          <AppText title={place.name} textFontWeight textSize={1.4} />
          <View style={styles.row}>
            <Ionicons name="star" size={12} color="#FFB300" />
            <AppText title={`${place.rating || 'N/A'}`} textSize={1.2} />
          </View>
        </View>
      </Callout>
    </Marker>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  row: {flexDirection: 'row', alignItems: 'center', gap: 4},
  userMarkerOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  userMarkerInner: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: AppColors.BTNCOLOURS,
    backgroundColor: AppColors.BTNCOLOURS,
    overflow: 'hidden',
  },
  userMarkerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.BTNCOLOURS,
    transform: [{rotate: '180deg'}],
    marginTop: -2,
  },
  userMarkerImage: {
    height: '100%',
    width: '100%',
  },
  smartMarker: {
    height: 28,
    width: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  reviewMarkerContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: AppColors.WHITE,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  headerContainer: {
    position: 'absolute',
    top: responsiveHeight(2),
    left: responsiveWidth(4),
    right: responsiveWidth(4),
    zIndex: 10,
  },
  headerContent: {
    backgroundColor: AppColors.WHITE,
    padding: responsiveWidth(4),
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.2,
  },
  changeBtn: {
    backgroundColor: AppColors.BTNCOLOURS,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: AppColors.WHITE,
    padding: 12,
    borderRadius: 30,
    elevation: 10,
  },
  calloutContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 120,
  },
});

export default Discover;
