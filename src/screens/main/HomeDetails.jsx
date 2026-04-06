import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';

// Enable playback in silence mode
Sound.setCategory('Playback');

import ImageIntroSlider from '../../components/ImagesIntroSlider';
import AppColors from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import AppImages from '../../assets/images/AppImages';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import RatingWithProgressbar from '../../components/RatingWithProgressbar';
import {
  Google_API_KEY,
  Google_Base_Url,
  Google_Places_Images,
} from '../../utils/api_content';
import {setPlaceDetail} from '../../redux/Slices';
import {AddReviews} from '../../ApiCalls/Main/Reviews/ReviewsApiCall';
import {
  AddWishList,
  GetWishList,
  RemoveWishList,
} from '../../ApiCalls/Main/WishList_API/WishListAPI';
import ShowError from '../../utils/ShowError';
import ScreenWrapper from '../../components/ScreenWrapper';

const HomeDetails = ({route}) => {
  const {placeDetails} = route.params;
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  const [morePlaceDetails, setMoreInfoDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeReview, setTypeReview] = useState('');
  const [avoidLoader, setAvoidLoader] = useState(false);
  const [goAgainLoader, setGoAgainLoader] = useState(false);
  const [reviewLoader, setReviewLoader] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const [wishlistLoader, setWishlistLoader] = useState(false);

  // Sound refs with mounting guard
  const celebrationSound = useRef(null);
  const isSoundLoaded = useRef(false);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;

    // Pre-load the sound from Android resources
    celebrationSound.current = new Sound(
      'cloudcheering',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('failed to load the sound', error);
        } else {
          // Only mark as loaded if we haven't already unmounted
          if (isComponentMounted.current) {
            isSoundLoaded.current = true;
          }
        }
      },
    );

    return () => {
      isComponentMounted.current = false;
      const soundObj = celebrationSound.current;

      // Immediate cleanup of refs
      isSoundLoaded.current = false;
      celebrationSound.current = null;

      if (soundObj) {
        try {
          // CRITICAL: The Double.doubleValue() crash happens when _key is not a number.
          // We check typeof specifically to avoid passing null/undefined to the bridge.
          if (typeof soundObj._key === 'number' && soundObj._key !== -1) {
            if (typeof soundObj.release === 'function') {
              soundObj.release();
            }
          }
        } catch (e) {
          console.log('Final sound cleanup error:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    const soundObj = celebrationSound.current;
    const isLoaded = isSoundLoaded.current;

    if (showCelebration) {
      if (soundObj && isLoaded && typeof soundObj._key === 'number') {
        try {
          soundObj.setVolume(1.0).play(success => {
            if (!success) console.log('playback failed');
          });
        } catch (e) {
          console.log('Play crash prevented:', e);
        }
      }
    } else {
      // Small check to see if we are still mounted before stopping
      if (
        isComponentMounted.current &&
        soundObj &&
        isLoaded &&
        typeof soundObj._key === 'number'
      ) {
        try {
          soundObj.stop();
        } catch (e) {
          console.log('Stop crash prevented:', e);
        }
      }
    }
  }, [showCelebration]);

  useEffect(() => {
    const id = placeDetails?.place_id || placeDetails?.placeId;
    if (id) {
      getMorePlaceInfo(id);
      checkIfInWishList(id);
    }
  }, [placeDetails, token]);

  const checkIfInWishList = async id => {
    try {
      const res = await GetWishList(token);
      const wishlistData = res?.wishLists || res?.data || res;
      if (wishlistData && Array.isArray(wishlistData)) {
        const isInWishlist = wishlistData.some(item => item.placeId === id);
        setIsWishList(isInWishlist);
      }
    } catch (error) {
      console.log('Error checking wishlist:', error);
    }
  };

  const getMorePlaceInfo = async id => {
    try {
      setLoading(true);
      const url = `${Google_Base_Url}place/details/json?place_id=${id}&key=${Google_API_KEY}`;

      const response = await axios.get(url);

      if (response.data?.result) {
        setMoreInfoDetail(response.data.result);
        dispatch(setPlaceDetail(response.data.result));
      } else {
        ShowError('Could not fetch extra details.', 2000);
      }
    } catch (error) {
      console.error('getMorePlaceInfo Error:', error);
      ShowError('Network error. Please try again.', 2000);
    } finally {
      setLoading(false);
    }
  };

  // Memoized image extraction to prevent recalculation on every render
  const images = useMemo(() => {
    const photos = morePlaceDetails?.photos || placeDetails?.photos;
    if (!photos || !Array.isArray(photos)) return [];

    return photos
      .map(photo => {
        if (typeof photo === 'string') return photo;
        if (photo?.photo_reference)
          return `${Google_Places_Images}${photo.photo_reference}`;
        return null;
      })
      .filter(Boolean);
  }, [morePlaceDetails, placeDetails]);

  // Compute breakdown from reviews
  const ratingData = useMemo(() => {
    const breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    const reviews = morePlaceDetails?.reviews || [];

    if (reviews.length === 0) return [];

    reviews.forEach(r => {
      if (breakdown[r.rating] !== undefined) {
        breakdown[r.rating] += 1;
      }
    });

    return Object.keys(breakdown)
      .map(star => ({
        id: star,
        rating: Number(star),
        progress: Math.round((breakdown[star] / reviews.length) * 100),
      }))
      .reverse();
  }, [morePlaceDetails]);

  const recommendationPercentage = morePlaceDetails?.rating
    ? Math.round((morePlaceDetails.rating / 5) * 100)
    : 0;

  const getCategory = () => {
    const types = morePlaceDetails?.types || placeDetails?.types || [];
    if (types.length === 0) return 'Place';
    const filterTypes = [
      'point_of_interest',
      'establishment',
      'food',
      'natural_feature',
      'street_address',
      'route',
    ];
    const meaningfulType =
      types.find(t => !filterTypes.includes(t)) || types[0];
    return meaningfulType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const createReview = async type => {
    if (!morePlaceDetails) {
      ShowError('Please wait, details are loading...', 2000);
      return;
    }

    if (type === 'Avoid') setAvoidLoader(true);
    if (type === 'Go Again') setGoAgainLoader(true);
    if (type === 'Review') setReviewLoader(true);
    const data = {
      placeId: morePlaceDetails?.place_id,
      restaurantName: morePlaceDetails?.name,
      address: morePlaceDetails?.formatted_address,
      rating: morePlaceDetails?.rating,
      reviewText: typeReview,
      actionType: type,
      photos: images,
      category: getCategory(),
      latitude: morePlaceDetails?.geometry?.location?.lat,
      longitude: morePlaceDetails?.geometry?.location?.lng,
    };

    try {
      const res = await AddReviews(token, data);
      if (res.success) {
        if (type === 'Go Again') {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 4000);
        }
        setTypeReview('');
      }
      if (!(res.success && type === 'Go Again')) {
        ShowError(res.msg || 'Review processed', 2000);
      }
    } catch (err) {
      ShowError('Failed to add review', 2000);
    } finally {
      setAvoidLoader(false);
      setGoAgainLoader(false);
      setReviewLoader(false);
    }
  };

  const toggleWishlist = async () => {
    if (!morePlaceDetails && !placeDetails) return;

    setWishlistLoader(true);
    const placeId =
      morePlaceDetails?.place_id ||
      placeDetails?.place_id ||
      placeDetails?.placeId;

    try {
      if (isWishList) {
        const res = await RemoveWishList(token, {placeId});
        console.log('res in RemoveWishList in toggleWishlist:-', res);
        if (res?.success) {
          setIsWishList(false);
          ShowError(res?.msg || 'Removed from wishlist', 2000);
        }
      } else {
        const data = {
          placeId: placeId,
          name: morePlaceDetails?.name || placeDetails?.name,
          address: morePlaceDetails?.formatted_address || placeDetails?.address,
          image: morePlaceDetails?.photos?.[0]?.photo_reference || '',
          rating: morePlaceDetails?.rating || placeDetails?.rating,
          userRatingsTotal:
            morePlaceDetails?.user_ratings_total ||
            placeDetails?.user_ratings_total ||
            0,
          category: getCategory(),
          notes: '',
          isVisited: false,
        };
        const res = await AddWishList(token, data);
        console.log('res in AddWishList in toggleWishlist:-', res);
        if (res?.success) {
          setIsWishList(true);
          ShowError(res?.msg || 'Added to wishlist', 2000);
        }
      }
    } catch (error) {
      console.log('Wishlist toggle error:', error);
      ShowError('Something went wrong', 2000);
    } finally {
      setWishlistLoader(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={AppColors.BLACK} />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {images.length > 0 && <ImageIntroSlider images={images} />}

        <LineBreak space={2} />

        <View style={styles.contentPadding}>
          <View style={styles.titleRow}>
            <View style={{width: responsiveWidth(80)}}>
              <AppText
                title={
                  morePlaceDetails?.name || placeDetails?.name || 'No Name'
                }
                textColor={AppColors.BLACK}
                textSize={3}
                textFontWeight
              />
            </View>

            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={toggleWishlist}
              disabled={wishlistLoader}>
              {wishlistLoader ? (
                <ActivityIndicator size="small" color={AppColors.BTNCOLOURS} />
              ) : (
                <FontAwesome
                  name={isWishList ? 'bookmark' : 'bookmark-o'}
                  size={24}
                  color={AppColors.BTNCOLOURS}
                />
              )}
            </TouchableOpacity>
          </View>

          <LineBreak space={2} />

          {/* Ratings Section */}
          <View style={styles.sectionBorder}>
            <AppText
              title="Reviews & Ratings"
              textColor={AppColors.BLACK}
              textSize={2}
              textFontWeight
            />
            <LineBreak space={1} />

            <View style={styles.rowAlignCenter}>
              <FlatList
                data={ratingData}
                scrollEnabled={false}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={<LineBreak space={2} />}
                renderItem={({item}) => (
                  <View style={styles.ratingRow}>
                    <View style={styles.starLabel}>
                      <AppText
                        title={item.rating}
                        textSize={1.8}
                        textColor={AppColors.ThemeColor}
                      />
                      <Entypo
                        name="star"
                        size={responsiveFontSize(2)}
                        color={AppColors.ThemeColor}
                      />
                    </View>
                    <RatingWithProgressbar
                      progress={item.progress}
                      animated
                      style={{width: '70%'}}
                    />
                  </View>
                )}
              />

              <View style={{gap: 20, marginLeft: 10}}>
                <View>
                  <View style={styles.compactRow}>
                    <AppText
                      title={`${morePlaceDetails?.rating || '-'}`}
                      textSize={4}
                      textColor={AppColors.BLACK}
                      textFontWeight
                    />
                    <AntDesign name="star" size={24} color={AppColors.Yellow} />
                  </View>
                  <AppText
                    title={`${morePlaceDetails?.reviews?.length || 0} Reviews`}
                    textSize={1.5}
                    textColor={AppColors.BLACK}
                  />
                </View>

                <View>
                  <AppText
                    title={`${recommendationPercentage}%`}
                    textSize={3.5}
                    textColor={AppColors.BLACK}
                  />
                  <AppText
                    title="Recommended"
                    textSize={1.5}
                    textColor={AppColors.BLACK}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Location Section */}
          {/* <View style={styles.sectionBorder}>
            <AppText
              title="Location"
              textColor={AppColors.BLACK}
              textSize={2}
              textFontWeight
            />
            <LineBreak space={2} />
            <View style={styles.compactRow}>
              <Ionicons
                name="location"
                size={responsiveFontSize(1.8)}
                color={AppColors.BTNCOLOURS}
              />
              <AppText
                title={
                  morePlaceDetails?.formatted_address ||
                  placeDetails?.address ||
                  'Address not found'
                }
                textColor={AppColors.GRAY}
                textSize={1.8}
              />
            </View>
            <LineBreak space={2} />
            <View style={styles.mapPlaceholder}>
              <Image
                source={AppImages.USER_LOCATION}
                style={styles.mapPlaceholder}
                resizeMode="contain"
              />
            </View>
          </View> */}

          {/* Review Input */}
          <View style={{paddingVertical: responsiveHeight(2)}}>
            <AppText
              title="Add Review"
              textColor={AppColors.BLACK}
              textSize={2}
              textFontWeight
            />
            <LineBreak space={2} />
            <AppTextInput
              placeholder="Write your detailed review"
              textAlignVertical="top"
              inputHeight={15}
              multiline
              onChangeText={setTypeReview}
              value={typeReview}
              rightIcon={
                <View style={styles.inputAction}>
                  <TouchableOpacity
                    onPress={() => createReview('Review')}
                    disabled={reviewLoader}>
                    {reviewLoader ? (
                      <ActivityIndicator
                        size="small"
                        color={AppColors.BTNCOLOURS}
                      />
                    ) : (
                      <Ionicons
                        name="send"
                        size={responsiveFontSize(2.5)}
                        color={AppColors.BTNCOLOURS}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              }
            />
          </View>

          {/* Action Buttons */}
          {!isWishList && (
            <View style={styles.buttonRow}>
              <AppButton
                title="Avoid"
                handlePress={() => createReview('Avoid')}
                btnWidth={44}
                btnBackgroundColor={AppColors.LIGHT_BTNCOLOURS}
                loading={avoidLoader}
              />
              <AppButton
                title="Go Again"
                handlePress={() => createReview('Go Again')}
                btnWidth={44}
                btnBackgroundColor={AppColors.BTNCOLOURS}
                loading={goAgainLoader}
              />
            </View>
          )}
        </View>
        <LineBreak space={4} />
      </ScrollView>

      {/* Celebration Modal */}
      <Modal
        isVisible={showCelebration}
        // animationIn="zoomIn"
        // animationOut="zoomOut"
        backdropOpacity={0.2}
        style={{margin: 0}}>
        <View style={styles.gifContainer}>
          <FastImage
            source={require('../../assets/gif/celebration.gif')}
            style={{height: '100%', width: '100%'}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  contentPadding: {paddingHorizontal: 20},
  sectionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.appBgColor,
    paddingVertical: responsiveHeight(2),
  },
  rowAlignCenter: {flexDirection: 'row', alignItems: 'center'},
  compactRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  starLabel: {
    flexDirection: 'row',
    gap: responsiveWidth(0.5),
    alignItems: 'center',
  },
  mapPlaceholder: {width: responsiveWidth(90)},
  inputAction: {
    flex: 1,
    height: responsiveHeight(12),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContent: {
    // backgroundColor: AppColors.WHITE,
    // borderRadius: 20,
    // paddingTop: 20,
    // paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wishlistBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.WHITE,
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  gifContainer: {
    height: responsiveHeight(48),
    width: responsiveWidth(100),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default HomeDetails;
