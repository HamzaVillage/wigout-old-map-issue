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
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../../utils/Responsive_Dimensions';
import {useCustomNavigation, useDebounce} from '../../../utils/Hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BackgroundScreen from '../../../components/AppTextComps/BackgroundScreen';
import ShowError from '../../../utils/ShowError';

// Logic & API
import {setIsListBuilt} from '../../../redux/Slices';
import FetchNearbyPlaces from '../../../ApiCalls/Main/FetchNearbyPlaces';
import {
  GetReviews,
  RemoveReview,
  AddReviews,
} from '../../../ApiCalls/Main/Reviews/ReviewsApiCall';
import {Google_Places_Images} from '../../../utils/api_content';

const BrowseCategories = ({navigation}) => {
  const {navigateToRoute, goBack} = useCustomNavigation();
  const dispatch = useDispatch();

  const {token, current_location, places_nearby} = useSelector(
    state => state.user,
  );

  const [selectedCategory, setSelectedCategory] = useState('Restaurants');
  const [customPlace, setCustomPlace] = useState('');
  const [loading, setLoading] = useState(false);

  // Local state for counts and tracking
  const [likesCount, setLikesCount] = useState(0);
  const [hatesCount, setHatesCount] = useState(0);
  const [likedItems, setLikedItems] = useState([]);
  const [avoidItems, setAvoidItems] = useState([]);

  const debouncedSearch = useDebounce(customPlace, 600);

  const categories = useMemo(
    () => [
      {
        id: '1',
        name: 'Restaurants',
        icon: 'restaurant-outline',
        type: 'restaurant',
        library: 'Ionicons',
      },
      {
        id: '2',
        name: 'Hotel',
        icon: 'office-building',
        type: 'lodging',
        library: 'MaterialCommunityIcons',
      },
      {
        id: '3',
        name: 'Cafes',
        icon: 'cafe-outline',
        type: 'cafe',
        library: 'Ionicons',
      },
      {
        id: '4',
        name: 'Grocery Stores',
        icon: 'bag-handle-outline',
        type: 'grocery_or_supermarket',
        library: 'Ionicons',
      },
      {
        id: '5',
        name: 'Vacation Destinations',
        icon: 'airplane-outline',
        type: 'transit_station',
        library: 'Ionicons',
      },
      {
        id: '6',
        name: 'Other',
        icon: 'storefront-outline',
        type: 'establishment',
        library: 'Ionicons',
      },
    ],
    [],
  );

  // 1. Initial Data Load
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return;
      const revRes = await GetReviews(token);
      if (revRes?.reviews) {
        const liked = revRes.reviews.filter(r => r.actionType === 'Go Again');
        const avoided = revRes.reviews.filter(r => r.actionType === 'Avoid');
        setLikedItems(liked);
        setLikesCount(liked.length);
        setAvoidItems(avoided);
        setHatesCount(avoided.length);
      }
    };
    fetchInitialData();
  }, [token]);

  // 2. Fetch Places based on category or search
  const fetchPlaces = useCallback(
    async (query = '') => {
      if (!current_location?.latitude) return;
      setLoading(true);
      const cat = categories.find(c => c.name === selectedCategory);
      const type = query ? '' : cat?.type || 'restaurant';
      await FetchNearbyPlaces(current_location, dispatch, type, query);
      setLoading(false);
    },
    [selectedCategory, current_location, categories, dispatch],
  );

  useEffect(() => {
    fetchPlaces(debouncedSearch);
  }, [selectedCategory, debouncedSearch, fetchPlaces]);

  // 3. Action Handlers (Heart / Avoid)
  const handleAction = async (item, actionType) => {
    const isGoAgain = actionType === 'Go Again';

    // Check if it already exists in the list being toggled
    const targetList = isGoAgain ? likedItems : avoidItems;
    const existing = targetList.find(i => i.placeId === item.place_id);

    if (existing) {
      const res = await RemoveReview({reviewId: existing._id}, token);
      if (res?.success) {
        if (isGoAgain) {
          setLikesCount(p => p - 1);
          setLikedItems(p => p.filter(l => l._id !== existing._id));
        } else {
          setHatesCount(p => p - 1);
          setAvoidItems(p => p.filter(a => a._id !== existing._id));
        }
        ShowError(`Removed from ${actionType} list`);
      }
      return;
    }

    // Exclusivity: Remove from opposite list first
    const oppositeList = isGoAgain ? avoidItems : likedItems;
    const existingOpposite = oppositeList.find(
      i => i.placeId === item.place_id,
    );

    if (existingOpposite) {
      const remRes = await RemoveReview(
        {reviewId: existingOpposite._id},
        token,
      );
      if (remRes?.success) {
        if (isGoAgain) {
          setHatesCount(p => p - 1);
          setAvoidItems(p => p.filter(a => a._id !== existingOpposite._id));
        } else {
          setLikesCount(p => p - 1);
          setLikedItems(p => p.filter(l => l._id !== existingOpposite._id));
        }
      }
    }

    // Add to new list
    const data = {
      placeId: item.place_id,
      restaurantName: item.name,
      address: item.vicinity || item.formatted_address,
      rating: item.rating || 0,
      reviewText: 'Added from browsing',
      actionType: actionType,
      photos: item.photos?.[0]?.photo_reference
        ? [`${Google_Places_Images}${item.photos[0].photo_reference}`]
        : [],
      category: selectedCategory,
      latitude: item.geometry?.location?.lat,
      longitude: item.geometry?.location?.lng,
    };

    const res = await AddReviews(token, data);
    if (res?.success) {
      if (isGoAgain) {
        setLikesCount(p => p + 1);
        setLikedItems(p => [
          ...p,
          {_id: res.review?._id, placeId: item.place_id},
        ]);
      } else {
        setHatesCount(p => p + 1);
        setAvoidItems(p => [
          ...p,
          {_id: res.review?._id, placeId: item.place_id},
        ]);
      }
      ShowError(`Added to ${actionType} list`);
    }
  };

  // 4. Sub-renderers
  const renderPlaceItem = ({item}) => {
    const imageUrl = item.photos?.[0]?.photo_reference
      ? `${Google_Places_Images}${item.photos[0].photo_reference}&maxwidth=200`
      : null;

    const isLiked = likedItems.some(l => l.placeId === item.place_id);
    const isAvoided = avoidItems.some(a => a.placeId === item.place_id);

    return (
      <TouchableOpacity
        onPress={() =>
          navigateToRoute('HomeDetails', {placeDetails: item})
        }
        style={styles.placeItem}>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.placeImage} />
        ) : (
          <View style={[styles.placeImage, styles.center]}>
            <Ionicons name="image-outline" size={24} color="#CCC" />
          </View>
        )}

        <View style={{marginLeft: 12, flex: 1}}>
          <AppText
            title={item.name}
            textSize={1.7}
            textFontWeight
            textColor="#47082E"
            numberOfLines={1}
          />
          <AppText title={selectedCategory} textSize={1.3} textColor="#666" />
          <AppText
            title={item.vicinity || 'Nearby'}
            textSize={1.3}
            textColor="#666"
            numberOfLines={1}
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleAction(item, 'Go Again')}
            style={styles.circleActionBtn}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? '#4CAF50' : '#47082E'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAction(item, 'Avoid')}
            style={styles.circleActionBtn}>
            <Ionicons
              name={isAvoided ? 'thumbs-down' : 'thumbs-down-outline'}
              size={22}
              color={isAvoided ? '#D32F2F' : '#47082E'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={{paddingBottom: 10}}>
      <AppText
        title={
          'Quickly build your love/hate lists.\nTap hearts or thumbs down!'
        }
        textSize={1.7}
        textColor="#47082E"
        textAlignment="center"
        marginTop={2}
      />

      <View style={styles.statsRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyLikes')}
          style={styles.statChip}>
          <Ionicons name="heart" size={16} color="#4CAF50" />
          <AppText
            title={`${likesCount} Loved`}
            textSize={1.3}
            textColor="#4CAF50"
            textFontWeight
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('MyHates')}
          style={styles.statChip}>
          <Ionicons name="thumbs-down" size={16} color="#D32F2F" />
          <AppText
            title={`${hatesCount} Avoids`}
            textSize={1.3}
            textColor="#D32F2F"
            textFontWeight
          />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                !isSelected && styles.categoryItemUnselected,
              ]}
              onPress={() => {
                setCustomPlace('');
                setSelectedCategory(cat.name);
              }}>
              {isSelected && (
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#EB864D" />
                      <Stop offset="100%" stopColor="#47082E" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" rx="18" fill="url(#grad)" />
                </Svg>
              )}
              {cat.library === 'Ionicons' ? (
                <Ionicons
                  name={cat.icon}
                  size={28}
                  color={isSelected ? '#FFF' : '#47082E'}
                />
              ) : (
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={28}
                  color={isSelected ? '#FFF' : '#47082E'}
                />
              )}
              <AppText
                title={cat.name}
                textSize={1.2}
                textColor={isSelected ? '#FFF' : '#47082E'}
                textFontWeight
                textAlignment="center"
                paddingHorizontal={2}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBarPill}>
          <Ionicons name="search-outline" size={20} color="#47082E" />
          <TextInput
            placeholder="Search for any specific place..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={customPlace}
            onChangeText={setCustomPlace}
          />
          {loading && <ActivityIndicator size="small" color="#47082E" />}
        </View>
      </View>
    </View>
  );

  return (
    <BackgroundScreen>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={AppColors.BTNCOLOURS}
            />
          </TouchableOpacity>
          <AppText
            title={'Build Your Lists'}
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
              <View style={styles.center}>
                <AppText title="No places found nearby." textColor="#666" />
              </View>
            )
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => dispatch(setIsListBuilt(true))}
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
              title={'Continue'}
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
  center: {justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {padding: 5},
  listContent: {paddingBottom: 120},
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  categoryItem: {
    width: responsiveWidth(28),
    height: 90,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryItemUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  searchBarContainer: {paddingHorizontal: 20, marginVertical: 10},
  searchBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EEE',
  },
  actionButtons: {flexDirection: 'row', gap: 8},
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
    marginTop: 10,
    marginBottom: 10,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    elevation: 3,
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

export default BrowseCategories;

// import React, {useState, useEffect, Fragment} from 'react';
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
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

// const BrowseCategories = ({navigation}) => {
//   const {navigateToRoute, goBack} = useCustomNavigation();
//   const dispatch = useDispatch();
//   const {token, current_location, places_nearby} = useSelector(
//     state => state.user,
//   );

//   const [selectedCategory, setSelectedCategory] = useState('Restaurants');
//   const [customPlace, setCustomPlace] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [likesCount, setLikesCount] = useState(0);
//   const [hatesCount, setHatesCount] = useState(0);
//   const [likedItems, setLikedItems] = useState([]);
//   const [avoidItems, setAvoidItems] = useState([]);

//   const categoryMapping = {
//     Restaurants: 'restaurant',
//     Hotel: 'lodging',
//     Cafes: 'cafe',
//     Shops: 'shopping_mall',
//     Travel: 'transit_station',
//     Other: 'establishment',
//   };

//   const debouncedSearch = useDebounce(customPlace, 500);

//   const categories = [
//     {
//       id: '1',
//       name: 'Restaurants',
//       icon: 'restaurant-outline',
//       library: 'Ionicons',
//     },
//     {
//       id: '2',
//       name: 'Hotel',
//       icon: 'office-building',
//       library: 'MaterialCommunityIcons',
//     },
//     {id: '3', name: 'Cafes', icon: 'cafe-outline', library: 'Ionicons'},
//     {
//       id: '4',
//       name: 'Grocery Stores',
//       icon: 'bag-handle-outline',
//       library: 'Ionicons',
//     },
//     {
//       id: '5',
//       name: 'Vacation Destinations',
//       icon: 'airplane-outline',
//       library: 'Ionicons',
//     },
//     {id: '6', name: 'Other', icon: 'storefront-outline', library: 'Ionicons'},
//   ];

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       if (!token) return;
//       const [wishRes, revRes] = await Promise.all([
//         GetWishList(token),
//         GetReviews(token),
//       ]);

//       if (revRes?.reviews) {
//         const liked = revRes.reviews.filter(r => r.actionType === 'Go Again');
//         setLikedItems(liked);
//         setLikesCount(liked.length);

//         const avoided = revRes.reviews.filter(r => r.actionType === 'Avoid');
//         setAvoidItems(avoided);
//         setHatesCount(avoided.length);
//       }
//     };

//     fetchInitialData();
//   }, [token]);

//   useEffect(() => {
//     fetchPlaces();
//   }, [selectedCategory, current_location]);

//   const fetchPlaces = async () => {
//     if (!current_location?.latitude) return;
//     setLoading(true);
//     const type = categoryMapping[selectedCategory] || 'restaurant';
//     await FetchNearbyPlaces(current_location, dispatch, type);
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

//   const handleSearch = async query => {
//     setLoading(true);
//     // Passing empty string for 'type' so it searches all categories using the keyword
//     await FetchNearbyPlaces(current_location, dispatch, '', query);
//     setLoading(false);
//   };

//   const handleHeart = async item => {
//     const existing = likedItems.find(
//       l => l.placeId === item.place_id || l.restaurantName === item.name,
//     );
//     console.log('existing', existing);
//     if (existing) {
//       const res = await RemoveReview({reviewId: existing._id}, token);

//       // Checking both standard and nested success flags/statuses
//       if (res?.success) {
//         setLikesCount(prev => prev - 1);
//         setLikedItems(prev => prev.filter(l => l._id !== existing._id));
//         ShowError('Removed from Go Again List', 2000);
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
//       restaurantName: item.name,
//       address: item.vicinity || item.formatted_address,
//       rating: item.rating || 0,
//       reviewText: 'Added from onboarding',
//       actionType: 'Go Again',
//       photos: item.photos?.[0]?.photo_reference
//         ? [`${Google_Places_Images}${item.photos[0].photo_reference}`]
//         : [],
//       category: selectedCategory,
//       latitude: item.geometry?.location?.lat,
//       longitude: item.geometry?.location?.lng,
//     };
//     const res = await AddReviews(token, data);
//     if (res?.success) {
//       setLikesCount(prev => prev + 1);
//       setLikedItems(prev => [
//         ...prev,
//         {
//           _id: res.review?._id,
//           placeId: item.place_id,
//           restaurantName: item.name,
//         },
//       ]);
//       ShowError(res?.msg || 'Added to Go Again List', 2000);
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

//     // Exclusivity: If it's in liked list, remove it first
//     const existingLiked = likedItems.find(
//       l => l.placeId === item.place_id || l.restaurantName === item.name,
//     );
//     if (existingLiked) {
//       const resLiked = await RemoveReview({reviewId: existingLiked._id}, token);
//       if (resLiked?.success) {
//         setLikesCount(prev => prev - 1);
//         setLikedItems(prev => prev.filter(l => l._id !== existingLiked._id));
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
//       category: selectedCategory,
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

//   const CategoryItem = ({item}) => {
//     const isSelected = selectedCategory === item.name;
//     return (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         style={[
//           styles.categoryItem,
//           !isSelected && styles.categoryItemUnselected,
//         ]}
//         onPress={() => setSelectedCategory(item.name)}>
//         {isSelected && (
//           <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
//             <Defs>
//               <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
//                 <Stop offset="0%" stopColor="#EB864D" stopOpacity="1" />
//                 <Stop offset="100%" stopColor="#47082E" stopOpacity="1" />
//               </LinearGradient>
//             </Defs>
//             <Rect
//               x="0"
//               y="0"
//               width="100%"
//               height="100%"
//               rx="18"
//               fill="url(#grad)"
//             />
//           </Svg>
//         )}
//         {item.library === 'Ionicons' ? (
//           <Ionicons
//             name={item.icon}
//             size={32}
//             color={isSelected ? AppColors.WHITE : AppColors.BTNCOLOURS}
//           />
//         ) : (
//           <MaterialCommunityIcons
//             name={item.icon}
//             size={32}
//             color={isSelected ? AppColors.WHITE : AppColors.BTNCOLOURS}
//           />
//         )}
//         <AppText
//           title={item.name}
//           textSize={1.5}
//           textColor={isSelected ? AppColors.WHITE : AppColors.BTNCOLOURS}
//           textFontWeight={true}
//           textAlignment="center"
//           style={{marginTop: 8}}
//         />
//       </TouchableOpacity>
//     );
//   };

//   const renderPlaceItem = ({item}) => {
//     const imageUrl = item.photos?.[0]?.photo_reference
//       ? `${Google_Places_Images}${item.photos[0].photo_reference}`
//       : null;

//     const isLiked = likedItems.some(
//       l => l.placeId === item.place_id || l.restaurantName === item.name,
//     );
//     const isAvoided = avoidItems.some(
//       a => a.placeId === item.place_id || a.restaurantName === item.name,
//     );

//     return (
//       <TouchableOpacity
//         onPress={() =>
//           navigateToRoute('Main', {
//             screen: 'HomeDetails',
//             params: {placeDetails: item},
//           })
//         }
//         style={styles.placeItem}>
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
//           <AppText title={selectedCategory} textSize={1.4} textColor="#666" />
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
//       </TouchableOpacity>
//     );
//   };

//   const listHeaderComponent = () => {
//     return (
//       <Fragment>
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
//             onPress={() => navigation.navigate('MyLikes')}
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
//             onPress={() => navigation.navigate('MyHates')}
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

//         <View style={styles.categoriesContainer}>
//           {categories.map(cat => (
//             <CategoryItem key={cat.id} item={cat} />
//           ))}
//         </View>

//         <View style={styles.searchBarContainer}>
//           <View style={styles.searchBarPill}>
//             <Ionicons name="search-outline" size={20} color="#47082E" />
//             <TextInput
//               placeholder="Search for a specific place..."
//               placeholderTextColor="#666"
//               style={styles.searchInput}
//               value={customPlace}
//               onChangeText={text => {
//                 setCustomPlace(text);
//                 // Removed immediate handleSearch to use debounce instead
//               }}
//               onSubmitEditing={() => handleSearch(customPlace)}
//             />
//           </View>
//         </View>
//       </Fragment>
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
//         {/* Removed static sections to move into FlatList Header */}

//         <FlatList
//           data={places_nearby}
//           renderItem={renderPlaceItem}
//           ListHeaderComponent={listHeaderComponent()}
//           keyExtractor={item => item.place_id}
//           contentContainerStyle={styles.contentContainerStyle}
//           showsVerticalScrollIndicator={false}
//         />

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
//   contentContainerStyle: {
//     flexGrow: 1,
//     paddingBottom: responsiveHeight(15),
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: responsiveWidth(5),
//     paddingTop: responsiveHeight(2),
//   },
//   categoriesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: responsiveWidth(5),
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   categoryItem: {
//     width: responsiveWidth(28),
//     height: responsiveHeight(13),
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//     marginBottom: 15,
//   },
//   categoryItemUnselected: {
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   searchBarContainer: {
//     paddingHorizontal: responsiveWidth(5),
//     marginTop: 10,
//     marginBottom: 20,
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
//     marginHorizontal: responsiveWidth(5),
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
//     marginBottom: 20,
//     marginTop: 5,
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

// export default BrowseCategories;
