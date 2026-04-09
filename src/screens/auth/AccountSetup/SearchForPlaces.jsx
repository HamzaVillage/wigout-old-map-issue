/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Svg, {Defs, LinearGradient, Stop, Rect} from 'react-native-svg';

// Components & Utils
import AppText from '../../../components/AppTextComps/AppText';
import AppColors from '../../../utils/AppColors';
import {responsiveWidth} from '../../../utils/Responsive_Dimensions';
import {useCustomNavigation, useDebounce} from '../../../utils/Hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackgroundScreen from '../../../components/AppTextComps/BackgroundScreen';
import ShowError from '../../../utils/ShowError';

// Logic & API
import {setIsListBuilt} from '../../../redux/Slices';
import FetchNearbyPlaces from '../../../ApiCalls/Main/FetchNearbyPlaces';
import {
  AddReviews,
  GetReviews,
  RemoveReview,
} from '../../../ApiCalls/Main/Reviews/ReviewsApiCall';
import {
  AddWishList,
  GetWishList,
  RemoveWishList,
} from '../../../ApiCalls/Main/WishList_API/WishListAPI';
import {Google_Places_Images} from '../../../utils/api_content';

const SearchForPlaces = ({navigation}) => {
  const {navigateToRoute, goBack} = useCustomNavigation();
  const dispatch = useDispatch();
  const {token, current_location, places_nearby, isListBuilt} = useSelector(
    state => state.user,
  );

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Local tracking state
  const [likedItems, setLikedItems] = useState([]);
  const [avoidItems, setAvoidItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const debouncedSearch = useDebounce(search, 600);

  // 1. Initial Sync
  const syncLists = async () => {
    if (!token) return;
    try {
      const [revRes, wishRes] = await Promise.all([
        GetReviews(token),
        GetWishList(token),
      ]);
      if (revRes?.reviews) {
        setLikedItems(revRes.reviews.filter(r => r.actionType === 'Go Again'));
        setAvoidItems(revRes.reviews.filter(r => r.actionType === 'Avoid'));
      }
      const wishlistData = wishRes?.wishLists || wishRes?.data || wishRes;
      if (wishlistData && Array.isArray(wishlistData)) {
        setWishlistItems(wishlistData);
      }
    } catch (e) {
      console.log('Sync error:', e);
    }
  };

  useEffect(() => {
    syncLists();
  }, [token]);

  // 2. Search Logic
  const handleSearch = useCallback(
    async query => {
      if (!current_location?.latitude) return;
      setLoading(true);
      await FetchNearbyPlaces(current_location, dispatch, '', query);
      setLoading(false);
    },
    [current_location, dispatch],
  );

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  // 3. Heart (Go Again) Logic
  const handleHeart = async item => {
    const existing = likedItems.find(l => l.placeId === item.place_id);

    if (existing) {
      const res = await RemoveReview({reviewId: existing._id}, token);
      if (res?.success) {
        setLikedItems(prev => prev.filter(l => l._id !== existing._id));
        ShowError('Removed from Go Again');
      }
      return;
    }

    const inAvoid = avoidItems.find(a => a.placeId === item.place_id);
    if (inAvoid) {
      const revRes = await RemoveReview({reviewId: inAvoid._id}, token);
      if (revRes?.success) {
        setAvoidItems(prev => prev.filter(a => a._id !== inAvoid._id));
      }
    }

    // Exclusivity: Remove from Wishlist first
    const inWish = wishlistItems.find(w => w.placeId === item.place_id);
    if (inWish) {
      const wishRes = await RemoveWishList(token, {placeId: item.place_id});
      if (wishRes?.success) {
        setWishlistItems(prev => prev.filter(w => w.placeId !== item.place_id));
      }
    }

    const data = {
      placeId: item.place_id,
      restaurantName: item.name,
      address: item.vicinity || item.formatted_address,
      rating: item.rating || 0,
      reviewText: 'Added from Search',
      actionType: 'Go Again',
      photos: item.photos?.[0]?.photo_reference
        ? [`${Google_Places_Images}${item.photos[0].photo_reference}`]
        : [],
      category: 'Search Result',
      latitude: item.geometry?.location?.lat,
      longitude: item.geometry?.location?.lng,
    };

    const res = await AddReviews(token, data);
    if (res?.success) {
      setLikedItems(prev => [
        ...prev,
        {_id: res.review?._id, placeId: item.place_id},
      ]);
      ShowError('Added to Go Again');
    }
  };

  // 4. Avoid Logic
  const handleAvoid = async item => {
    const existing = avoidItems.find(a => a.placeId === item.place_id);

    if (existing) {
      const res = await RemoveReview({reviewId: existing._id}, token);
      if (res?.success) {
        setAvoidItems(prev => prev.filter(a => a._id !== existing._id));
        ShowError('Removed from Avoids');
      }
      return;
    }

    const inLiked = likedItems.find(l => l.placeId === item.place_id);
    if (inLiked) {
      const resLiked = await RemoveReview({reviewId: inLiked._id}, token);
      if (resLiked?.success) {
        setLikedItems(prev => prev.filter(l => l._id !== inLiked._id));
      }
    }

    // Exclusivity: Remove from Wishlist first
    const inWish = wishlistItems.find(w => w.placeId === item.place_id);
    if (inWish) {
      const wishRes = await RemoveWishList(token, {placeId: item.place_id});
      if (wishRes?.success) {
        setWishlistItems(prev => prev.filter(w => w.placeId !== item.place_id));
      }
    }

    const data = {
      placeId: item.place_id,
      restaurantName: item.name,
      address: item.vicinity || item.formatted_address,
      actionType: 'Avoid',
      photos: item.photos?.[0]?.photo_reference
        ? [`${Google_Places_Images}${item.photos[0].photo_reference}`]
        : [],
      category: 'Search Result',
      latitude: item.geometry?.location?.lat,
      longitude: item.geometry?.location?.lng,
    };

    const res = await AddReviews(token, data);
    if (res?.success) {
      setAvoidItems(prev => [
        ...prev,
        {_id: res.review?._id, placeId: item.place_id},
      ]);
      ShowError('Added to Avoids');
    }
  };

  const handleWishlistToggle = async item => {
    try {
      const existing = wishlistItems.find(w => w.placeId === item.place_id);
      if (existing) {
        const res = await RemoveWishList(token, {placeId: item.place_id});
        if (res?.success) {
          setWishlistItems(prev =>
            prev.filter(w => w.placeId !== item.place_id),
          );
          ShowError('Removed from Wish List');
        } else {
          ShowError(res?.message || 'Failed to remove from Wish List');
        }
        return;
      }

      // Mutual exclusivity: Remove from Go Again
      const inLiked = likedItems.find(l => l.placeId === item.place_id);
      if (inLiked) {
        const resLiked = await RemoveReview({reviewId: inLiked._id}, token);
        if (resLiked?.success) {
          setLikedItems(prev => prev.filter(l => l._id !== inLiked._id));
        }
      }

      // Mutual exclusivity: Remove from Avoid
      const inAvoid = avoidItems.find(a => a.placeId === item.place_id);
      if (inAvoid) {
        const resAvoid = await RemoveReview({reviewId: inAvoid._id}, token);
        if (resAvoid?.success) {
          setAvoidItems(prev => prev.filter(a => a._id !== inAvoid._id));
        }
      }

      const data = {
        placeId: item.place_id,
        name: item.name,
        address: item.vicinity || item.formatted_address,
        image: item.photos?.[0]?.photo_reference || '',
        rating: item.rating || 0,
        userRatingsTotal: item.user_ratings_total || 0,
        category: 'Search Result',
        notes: '',
        isVisited: false,
      };

      const res = await AddWishList(token, data);
      if (res?.success) {
        setWishlistItems(prev => [...prev, {placeId: item.place_id, ...data}]);
        ShowError('Added to Wish List');
      } else {
        ShowError(res?.message || 'Failed to add to Wish List');
      }
    } catch (e) {
      console.log('Wishlist toggle error:', e);
      ShowError('Something went wrong');
    }
  };

  // 5. Render Helpers
  const renderPlaceItem = ({item}) => {
    const imageUrl = item.photos?.[0]?.photo_reference
      ? `${Google_Places_Images}${item.photos[0].photo_reference}&maxwidth=200`
      : null;

    const isLiked = likedItems.some(l => l.placeId === item.place_id);
    const isAvoided = avoidItems.some(a => a.placeId === item.place_id);
    const isWishlisted =
      !isLiked &&
      !isAvoided &&
      wishlistItems.some(w => w.placeId === item.place_id);

    return (
      <TouchableOpacity
        onPress={() => navigateToRoute('HomeDetails', {placeDetails: item})}
        style={styles.placeItem}>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.placeImage} />
        ) : (
          <View style={[styles.placeImage, styles.centerGray]}>
            <Ionicons name="image-outline" size={24} color="#CCC" />
          </View>
        )}
        <View style={{marginLeft: 15, flex: 1}}>
          <AppText
            title={item.name}
            textSize={1.7}
            textFontWeight
            textColor="#47082E"
            numberOfLines={1}
          />
          <AppText
            title={item.vicinity || 'Nearby'}
            textSize={1.3}
            textColor="#666"
            numberOfLines={1}
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleHeart(item)}
            style={styles.circleActionBtn}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? '#4CAF50' : '#47082E'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAvoid(item)}
            style={styles.circleActionBtn}>
            <Ionicons
              name={isAvoided ? 'thumbs-down' : 'thumbs-down-outline'}
              size={22}
              color={isAvoided ? '#D32F2F' : '#47082E'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleWishlistToggle(item)}
            style={styles.circleActionBtn}>
            <FontAwesome
              name={isWishlisted ? 'bookmark' : 'bookmark-o'}
              size={20}
              color={isWishlisted ? '#FF9800' : '#47082E'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={{paddingBottom: 10}}>
      <AppText
        title={'Search and categorize places.\nBuild your lists quickly!'}
        textSize={1.7}
        textColor="#47082E"
        textAlignment="center"
        style={{marginTop: 10}}
      />

      <View style={styles.statsRow}>
        <TouchableOpacity
          onPress={() => navigateToRoute('MyLikes')}
          style={styles.statChip}>
          <Ionicons name="heart" size={16} color="#4CAF50" />
          <AppText
            title={`${likedItems.length} Go Again`}
            textSize={1.3}
            textColor="#4CAF50"
            textFontWeight
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToRoute('MyHates')}
          style={styles.statChip}>
          <Ionicons name="thumbs-down" size={16} color="#D32F2F" />
          <AppText
            title={`${avoidItems.length} Avoids`}
            textSize={1.3}
            textColor="#D32F2F"
            textFontWeight
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToRoute('WishList')}
          style={styles.statChip}>
          <FontAwesome name="bookmark" size={16} color="#FF9800" />
          <AppText
            title={`${wishlistItems.length} Wish List`}
            textSize={1.3}
            textColor="#FF9800"
            textFontWeight
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBarPill}>
          <Ionicons name="search-outline" size={20} color="#47082E" />
          <TextInput
            placeholder="Where to next?"
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#47082E" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={AppColors.BTNCOLOURS}
          style={{marginTop: 20}}
        />
      )}
    </View>
  );

  return (
    <BackgroundScreen>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={{padding: 5}}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={AppColors.BTNCOLOURS}
            />
          </TouchableOpacity>
          <AppText
            title={'Search For Places'}
            textSize={2.6}
            textColor={AppColors.BTNCOLOURS}
            textFontWeight
            style={{flex: 1, textAlign: 'center', marginRight: 40}}
          />
        </View>

        <FlatList
          data={places_nearby}
          renderItem={renderPlaceItem}
          ListHeaderComponent={ListHeader()}
          keyExtractor={item => item.place_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <View style={{marginTop: 50, alignItems: 'center'}}>
                <AppText title="No Search Results" textColor="#666" />
              </View>
            )
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (isListBuilt) {
                navigation.navigate('MainTabs');
              } else {
                dispatch(setIsListBuilt(true));
              }
            }}
            style={styles.continueButton}>
            <Svg
              height="58"
              width={responsiveWidth(90)}
              style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#EB864D" />
                  <Stop offset="100%" stopColor="#47082E" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="58" rx="29" fill="url(#btnGrad)" />
            </Svg>
            <AppText
              title={'Done'}
              textSize={1.8}
              textColor={AppColors.WHITE}
              textFontWeight
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listContent: {paddingHorizontal: 20, paddingBottom: 120},
  searchBarContainer: {marginTop: 20, marginBottom: 10},
  searchBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  searchInput: {flex: 1, marginLeft: 10, fontSize: 16, color: '#47082E'},
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EEE',
  },
  centerGray: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  actionButtons: {flexDirection: 'row', gap: 10},
  circleActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 15,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    elevation: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: responsiveWidth(90),
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchForPlaces;

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Image,
//   TextInput,
//   SafeAreaView,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import Svg, {Defs, LinearGradient, Stop, Rect} from 'react-native-svg';
// import AppText from '../../../components/AppTextComps/AppText';
// import AppColors from '../../../utils/AppColors';
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize,
// } from '../../../utils/Responsive_Dimensions';
// import {useCustomNavigation, useDebounce} from '../../../utils/Hooks';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import BackgroundScreen from '../../../components/AppTextComps/BackgroundScreen';
// import {setIsListBuilt} from '../../../redux/Slices';
// import FetchNearbyPlaces from '../../../ApiCalls/Main/FetchNearbyPlaces';
// import {
//   AddWishList,
//   GetWishList,
//   RemoveWishList,
// } from '../../../ApiCalls/Main/WishList_API/WishListAPI';
// import {
//   AddReviews,
//   GetReviews,
//   RemoveReview,
// } from '../../../ApiCalls/Main/Reviews/ReviewsApiCall';
// import {Google_Places_Images} from '../../../utils/api_content';
// import ShowError from '../../../utils/ShowError';

// const {width} = Dimensions.get('window');

// const SearchForPlaces = () => {
//   const {navigateToRoute, goBack} = useCustomNavigation();
//   const dispatch = useDispatch();
//   const {token, current_location, places_nearby} = useSelector(
//     state => state.user,
//   );

//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [likesCount, setLikesCount] = useState(0);
//   const [hatesCount, setHatesCount] = useState(0);
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [avoidItems, setAvoidItems] = useState([]);

//   const debouncedSearch = useDebounce(search, 500);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       if (!token) return;
//       const [wishRes, revRes] = await Promise.all([
//         GetWishList(token),
//         GetReviews(token),
//       ]);

//       if (wishRes?.success) {
//         setWishlistItems(wishRes.wishLists || []);
//         setLikesCount(wishRes.wishLists?.length || 0);
//       }
//       if (revRes?.reviews) {
//         const avoided = revRes.reviews.filter(r => r.actionType === 'Avoid');
//         setAvoidItems(avoided);
//         setHatesCount(avoided.length);
//       }
//     };

//     fetchInitialData();
//   }, [token]);

//   useEffect(() => {
//     // Initial fetch on mount
//     if (current_location?.latitude) {
//       handleSearch('');
//     }
//   }, [current_location]);

//   const handleSearch = async query => {
//     setLoading(true);
//     // Passing empty string for 'type' so it searches all categories using the keyword
//     await FetchNearbyPlaces(current_location, dispatch, '', query);
//     setLoading(false);
//   };

//   const handleContinue = () => {
//     dispatch(setIsListBuilt(true));
//   };

//   useEffect(() => {
//     if (debouncedSearch && debouncedSearch.trim().length > 2) {
//       handleSearch(debouncedSearch);
//     }
//   }, [debouncedSearch]);

//   const handleHeart = async item => {
//     const existing = wishlistItems.find(w => w.placeId === item.place_id);
//     if (existing) {
//       const res = await RemoveWishList(token, {placeId: item.place_id});

//       // Checking both standard and nested success flags/statuses
//       const status = res?.status || res?.response?.status;
//       const data = res?.data || res?.response?.data;
//       const isSuccess =
//         status === 200 ||
//         status === 204 ||
//         data?.success ||
//         data?.status === 'success';

//       console.log(
//         'RemoveWishList Final Check (Search):',
//         isSuccess,
//         status,
//         data,
//       );

//       if (isSuccess) {
//         setLikesCount(prev => prev - 1);
//         setWishlistItems(prev => prev.filter(w => w.placeId !== item.place_id));
//         ShowError('Removed from Wishlist', 2000);
//       } else {
//         console.log('Delete Wishlist failed (attempt 1):', status, data);
//         // Fallback attempt with ID if placeId fails
//         const resFallback = await RemoveWishList(token, {
//           wishListId: existing._id,
//         });
//         const fallbackStatus =
//           resFallback?.status || resFallback?.response?.status;
//         if (fallbackStatus === 200 || resFallback?.data?.success) {
//           setLikesCount(prev => prev - 1);
//           setWishlistItems(prev =>
//             prev.filter(w => w.placeId !== item.place_id),
//           );
//           ShowError('Removed from Wishlist', 2000);
//         }
//       }
//       return;
//     }

//     // Exclusivity: If it's in avoid list, remove it first
//     const existingAvoid = avoidItems.find(
//       a => a.placeId === item.place_id || a.restaurantName === item.name,
//     );
//     if (existingAvoid) {
//       const revRes = await RemoveReview({reviewId: existingAvoid._id}, token);
//       if (revRes?.success) {
//         setHatesCount(prev => prev - 1);
//         setAvoidItems(prev => prev.filter(a => a._id !== existingAvoid._id));
//       }
//     }

//     const data = {
//       placeId: item.place_id,
//       name: item.name,
//       address: item.vicinity || item.formatted_address,
//       image: item.photos?.[0]?.photo_reference || '',
//       rating: item.rating || 0,
//       userRatingsTotal: item.user_ratings_total || 0,
//       category: 'Search Result',
//       notes: '',
//       isVisited: false,
//     };
//     const res = await AddWishList(token, data);
//     if (res?.success) {
//       setLikesCount(prev => prev + 1);
//       setWishlistItems(prev => [
//         ...prev,
//         {_id: res.wishList?._id, placeId: item.place_id},
//       ]);
//       ShowError(res?.msg || 'Added to Wishlist', 2000);
//     }
//   };

//   const handleAvoid = async item => {
//     const existing = avoidItems.find(
//       a => a.placeId === item.place_id || a.restaurantName === item.name,
//     );
//     if (existing) {
//       const res = await RemoveReview({reviewId: existing._id}, token);
//       if (res?.success) {
//         setHatesCount(prev => prev - 1);
//         setAvoidItems(prev => prev.filter(a => a._id !== existing._id));
//         ShowError('Removed from Avoid List', 2000);
//       }
//       return;
//     }

//     // Exclusivity: If it's in wishlist, remove it first
//     const existingWish = wishlistItems.find(w => w.placeId === item.place_id);
//     if (existingWish) {
//       const resWish = await RemoveWishList(token, {placeId: item.place_id});
//       const status = resWish?.status || resWish?.response?.status;
//       if (status === 200 || status === 204 || resWish?.data?.success) {
//         setLikesCount(prev => prev - 1);
//         setWishlistItems(prev => prev.filter(w => w.placeId !== item.place_id));
//       }
//     }

//     const data = {
//       placeId: item.place_id,
//       restaurantName: item.name,
//       address: item.vicinity || item.formatted_address,
//       rating: item.rating || 0,
//       reviewText: 'Added from onboarding',
//       actionType: 'Avoid',
//       photos: item.photos?.[0]?.photo_reference
//         ? [`${Google_Places_Images}${item.photos[0].photo_reference}`]
//         : [],
//       category: 'Search Result',
//       latitude: item.geometry?.location?.lat,
//       longitude: item.geometry?.location?.lng,
//     };
//     const res = await AddReviews(token, data);
//     if (res?.success) {
//       setHatesCount(prev => prev + 1);
//       setAvoidItems(prev => [
//         ...prev,
//         {
//           _id: res.review?._id,
//           placeId: item.place_id,
//           restaurantName: item.name,
//         },
//       ]);
//       ShowError(res?.msg || 'Added to Avoid List', 2000);
//     }
//   };

//   const renderPlaceItem = ({item}) => {
//     const imageUrl = item.photos?.[0]?.photo_reference
//       ? `${Google_Places_Images}${item.photos[0].photo_reference}`
//       : null;

//     const isLiked = wishlistItems.some(w => w.placeId === item.place_id);
//     const isAvoided = avoidItems.some(
//       a => a.placeId === item.place_id || a.restaurantName === item.name,
//     );

//     return (
//       <View style={styles.placeItem}>
//         {imageUrl ? (
//           <Image source={{uri: imageUrl}} style={styles.placeImage} />
//         ) : (
//           <View
//             style={[
//               styles.placeImage,
//               {
//                 backgroundColor: '#F0F0F0',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               },
//             ]}>
//             <Ionicons name="image-outline" size={24} color="#CCC" />
//           </View>
//         )}
//         <View style={{marginLeft: 15, flex: 1}}>
//           <AppText
//             title={item.name}
//             textSize={1.8}
//             textFontWeight={true}
//             textColor="#47082E"
//           />
//           <AppText
//             title={item.vicinity || 'Local Place'}
//             textSize={1.4}
//             textColor="#666"
//           />
//         </View>
//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleHeart(item)}
//             style={styles.circleActionBtnGreen}>
//             <Ionicons
//               name={isLiked ? 'heart' : 'heart-outline'}
//               size={20}
//               color={'#4CAF50'}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleAvoid(item)}
//             style={styles.circleActionBtnRed}>
//             <Ionicons
//               name={isAvoided ? 'thumbs-down' : 'thumbs-down-outline'}
//               size={20}
//               color={'#D32F2F'}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <BackgroundScreen>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => goBack()}>
//             <Ionicons
//               name="arrow-back"
//               size={28}
//               color={AppColors.BTNCOLOURS}
//             />
//           </TouchableOpacity>
//           <View style={{width: 25}} />
//           <AppText
//             title={'Add Places to your Lists'}
//             textSize={2.8}
//             textColor={AppColors.BTNCOLOURS}
//             textFontWeight={true}
//             textAlignment="center"
//             style={{flex: 1, marginRight: 53}}
//           />
//         </View>

//         <AppText
//           title={'Select places you love or hate.\nYou can add notes later!'}
//           textSize={1.8}
//           textColor="#47082E"
//           textAlignment="center"
//           lineHeight={2.6}
//           style={{marginTop: 5}}
//         />

//         <View style={styles.statsRow}>
//           <TouchableOpacity
//             onPress={() => navigateToRoute('MyLikes')}
//             style={styles.statChip}>
//             <Ionicons
//               name="heart"
//               size={16}
//               color="#4CAF50"
//               style={{marginRight: 6}}
//             />
//             <AppText
//               title={`${likesCount} Go Again`}
//               textSize={1.4}
//               textColor="#4CAF50"
//               textFontWeight={true}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => navigateToRoute('MyHates')}
//             style={styles.statChip}>
//             <Ionicons
//               name="thumbs-down"
//               size={16}
//               color="#D32F2F"
//               style={{marginRight: 6}}
//             />
//             <AppText
//               title={`${hatesCount} Avoids`}
//               textSize={1.4}
//               textColor="#D32F2F"
//               textFontWeight={true}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.searchBarContainer}>
//           <View style={styles.searchBarPill}>
//             <Ionicons name="search-outline" size={20} color="#47082E" />
//             <TextInput
//               placeholder="Where we going?"
//               placeholderTextColor="#666"
//               style={styles.searchInput}
//               value={search}
//               onChangeText={text => {
//                 setSearch(text);
//                 // Removed immediate handleSearch to use debounce instead
//               }}
//               onSubmitEditing={() => handleSearch(search)}
//             />
//           </View>
//         </View>

//         {/* Custom place section removed as per user request */}

//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color={AppColors.BTNCOLOURS}
//             style={{marginTop: 20}}
//           />
//         ) : (
//           <FlatList
//             data={places_nearby}
//             renderItem={renderPlaceItem}
//             keyExtractor={item => item.place_id}
//             contentContainerStyle={{
//               paddingBottom: responsiveHeight(15),
//               paddingHorizontal: responsiveWidth(5),
//             }}
//             showsVerticalScrollIndicator={false}
//           />
//         )}

//         <View style={styles.footer}>
//           <TouchableOpacity
//             activeOpacity={0.8}
//             onPress={handleContinue}
//             style={styles.continueButton}>
//             <Svg
//               height="58"
//               width={responsiveWidth(90)}
//               style={StyleSheet.absoluteFill}>
//               <Defs>
//                 <LinearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
//                   <Stop offset="0%" stopColor="#EB864D" stopOpacity="1" />
//                   <Stop offset="100%" stopColor="#47082E" stopOpacity="1" />
//                 </LinearGradient>
//               </Defs>
//               <Rect
//                 x="0"
//                 y="0"
//                 width={responsiveWidth(90)}
//                 height="58"
//                 rx="29"
//                 fill="url(#btnGrad)"
//               />
//             </Svg>
//             <AppText
//               title={'Continue'}
//               textSize={1.8}
//               textColor={AppColors.WHITE}
//               textFontWeight={true}
//             />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </BackgroundScreen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: responsiveWidth(5),
//     paddingTop: responsiveHeight(2),
//   },
//   searchBarContainer: {
//     paddingHorizontal: responsiveWidth(5),
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   searchBarPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     borderRadius: 30,
//     paddingHorizontal: 20,
//     height: 55,
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   searchInput: {
//     flex: 1,
//     height: 45,
//     marginLeft: 12,
//     fontSize: responsiveFontSize(1.8),
//     color: '#47082E',
//     padding: 0,
//   },
//   customPlaceSection: {
//     paddingHorizontal: responsiveWidth(5),
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   customInputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     gap: 10,
//   },
//   customInputContainer: {
//     flex: 1,
//     height: 45,
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//     justifyContent: 'center',
//   },
//   customInput: {
//     flex: 1,
//     fontSize: responsiveFontSize(1.6),
//     color: '#47082E',
//     padding: 0,
//   },
//   miniActionBtnGreen: {
//     width: 45,
//     height: 45,
//     borderRadius: 12,
//     backgroundColor: '#A5D6A7',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   miniActionBtnMaroon: {
//     width: 45,
//     height: 45,
//     borderRadius: 12,
//     backgroundColor: '#47082E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     borderRadius: 20,
//     padding: 12,
//     marginBottom: 15,
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   placeImage: {
//     width: 65,
//     height: 65,
//     borderRadius: 15,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   circleActionBtnGreen: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   circleActionBtnRed: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     left: responsiveWidth(5),
//     right: responsiveWidth(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   footerContent: {
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   continueButton: {
//     width: '100%',
//     height: 58,
//     borderRadius: 29,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 15,
//     marginBottom: 10,
//     marginTop: 15,
//   },
//   statChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//   },
// });

// export default SearchForPlaces;
