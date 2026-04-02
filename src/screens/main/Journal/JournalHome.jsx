import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';

// Components
import ScreenWrapper from '../../../components/ScreenWrapper';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import LineBreak from '../../../components/LineBreak';
import AppButton from '../../../components/AppButton';
import SVGXml from '../../../components/SVGXML';
import WheelSpinner, {WheelRef} from '../../../components/WheelSpinner';

// Utils & Helpers
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import {baseUrl} from '../../../utils/api_content';
import {useCustomNavigation} from '../../../utils/Hooks';
import {AppIcons} from '../../../assets/icons';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// API Calls
import {GetReviews} from '../../../ApiCalls/Main/Reviews/ReviewsApiCall';
import {GetWishList} from '../../../ApiCalls/Main/WishList_API/WishListAPI';
import {useIsFocused} from '@react-navigation/native';

const JournalHome = ({navigation}) => {
  const {navigateToRoute} = useCustomNavigation();
  const userData = useSelector(state => state.user.userData);
  const token = useSelector(state => state.user.token);

  const [likesData, setLikesData] = useState([]);
  const [hatesData, setHatesData] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);
  const isFocused = useIsFocused();

  const handleSpinEnd = selectedWinner => {
    setWinner(selectedWinner);
  };

  const triggerSpin = () => {
    setWinner(null);
    wheelRef.current?.spin();
  };

  // Use useCallback to prevent unnecessary function recreation
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoader(true);
    try {
      // Running both API calls in parallel for faster loading
      const [reviewsRes, wishlistRes] = await Promise.all([
        GetReviews(token),
        GetWishList(token),
      ]);

      if (reviewsRes?.reviews) {
        setLikesData(
          reviewsRes.reviews.filter(res => res.actionType === 'Go Again'),
        );
        setHatesData(
          reviewsRes.reviews.filter(res => res.actionType === 'Avoid'),
        );
      }

      if (wishlistRes?.success) {
        setWishlistItems(wishlistRes?.wishLists || []);
      }
    } catch (error) {
      console.error('Error fetching Journal data:', error);
    } finally {
      setLoader(false);
    }
  }, [token]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  // useEffect(() => {
  //   setWinner(null);
  // }, [isFocused]);

  return (
    <ScreenWrapper>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          // Added RefreshControl here if you want pull-to-refresh later
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                source={{uri: `${baseUrl}/${userData?.profileImage}`}}
                style={styles.profileImage}
              />
              <View>
                <AppText
                  title={'Greeting 👋'}
                  textColor={AppColors.GRAY}
                  textSize={1.6}
                />
                <AppText
                  title={userData?.fullName || 'User'}
                  textColor={AppColors.BLACK}
                  textSize={2.2}
                  textFontWeight
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigateToRoute('Notifications')}
              style={styles.notificationBtn}>
              <SVGXml
                width="25"
                height="25"
                icon={AppIcons.notification_black}
              />
            </TouchableOpacity>
          </View>

          <LineBreak space={4} />

          {/* Like/Hate Cards */}
          <View style={styles.cardsRow}>
            <TouchableOpacity
              style={[styles.card, {backgroundColor: '#E8F5E9'}]}
              onPress={() => navigateToRoute('MyLikes', {likesData})}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="heart-outline" size={24} color="#4CAF50" />
              </View>
              <AppText
                title={'My Likes'}
                textColor={AppColors.BLACK}
                textSize={1.8}
                textFontWeight
              />
              <AppText
                title={`${likesData.length} places`}
                textColor={AppColors.GRAY}
                textSize={1.4}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, {backgroundColor: '#FFEBEE'}]}
              onPress={() => navigateToRoute('MyHates', {hatesData})}>
              <View style={styles.cardIconContainer}>
                <Ionicons
                  name="thumbs-down-outline"
                  size={24}
                  color="#F44336"
                />
              </View>
              <AppText
                title={'My Hates'}
                textColor={AppColors.BLACK}
                textSize={1.8}
                textFontWeight
              />
              <AppText
                title={`${hatesData.length} places`}
                textColor={AppColors.GRAY}
                textSize={1.4}
              />
            </TouchableOpacity>
          </View>

          {/* Wish List Card - Fixed Count Bug */}
          <TouchableOpacity
            style={[styles.wishListCard, {backgroundColor: '#E3F2FD'}]}
            onPress={() => navigateToRoute('WishList')}>
            <View style={styles.wishListCardIconContainer}>
              <FontAwesome name={'bookmark-o'} size={24} color={'#2196F3'} />
            </View>
            <View>
              <AppText
                title={'Wish List'}
                textColor={AppColors.BLACK}
                textSize={1.8}
                textFontWeight
              />
              <AppText
                title={`${wishlistItems.length} places`}
                textColor={AppColors.GRAY}
                textSize={1.4}
              />
            </View>
          </TouchableOpacity>

          <LineBreak space={2} />

          {/* Wheel Spinner */}
          {wishlistItems.length > 0 && (
            <View style={styles.wheelSection}>
              <AppText
                title={"Can't decide? Spin the wheel!"}
                textColor={AppColors.BLACK}
                textSize={1.8}
                textFontWeight
                textAlignment="center"
              />
              <LineBreak space={2} />
              <View style={styles.wheelWrapper}>
                <WheelSpinner
                  ref={wheelRef}
                  data={wishlistItems.map(item => ({
                    id: item._id,
                    name: item.name,
                    fullData: item,
                  }))}
                  onSpinEnd={handleSpinEnd}
                  size={responsiveWidth(70)}
                />
              </View>
              <LineBreak space={2} />
              {winner ? (
                <View style={styles.winnerContainer}>
                  <TouchableOpacity
                    style={styles.winnerCard}
                    onPress={() =>
                      navigateToRoute('HomeDetails', {
                        placeDetails: winner.fullData,
                      })
                    }>
                    <AppText
                      title={`${winner.name}`}
                      textColor={AppColors.BTNCOLOURS}
                      textSize={1.8}
                      textFontWeight
                      textAlignment={'center'}
                    />
                    <AppText
                      title="Tap to view details"
                      textColor={AppColors.GRAY}
                      textSize={1.2}
                    />
                  </TouchableOpacity>

                  <AppButton
                    title="Spin Again"
                    handlePress={() => {
                      setWinner(null);
                      triggerSpin();
                    }}
                    btnWidth={40}
                    btnHeight={40}
                    btnBackgroundColor={AppColors.BTNCOLOURS}
                  />
                </View>
              ) : (
                <AppButton
                  title="Spin"
                  handlePress={triggerSpin}
                  btnWidth={40}
                  btnHeight={40}
                  btnBackgroundColor={AppColors.BTNCOLOURS}
                />
              )}
              <LineBreak space={4} />
            </View>
          )}

          {/* Help Me Decide Button */}
          <AppButton
            title={'Help Me Decide'}
            handlePress={() => navigateToRoute('HelpMeDecide')}
            btnBackgroundColor={AppColors.BTNCOLOURS}
            btnWidth={90}
            leftIcon={
              <Ionicons
                name="color-wand-outline"
                size={20}
                color={AppColors.WHITE}
                style={{marginRight: 10}}
              />
            }
          />

          {/* Optional: Show loader while refreshing */}
          {loader && (
            <ActivityIndicator
              style={{marginTop: 20}}
              size="small"
              color={AppColors.BTNCOLOURS}
            />
          )}

          <LineBreak space={4} />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default JournalHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppColors.LIGHTGRAY,
  },
  notificationBtn: {
    padding: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: AppColors.LIGHTGRAY,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: responsiveWidth(43),
    padding: 15,
    borderRadius: 20,
    gap: 8,
  },
  wishListCard: {
    width: responsiveWidth(90),
    padding: 15,
    borderRadius: 20,
    marginTop: responsiveHeight(2),
    flexDirection: 'row', // Changed to row for a sleeker horizontal look
    alignItems: 'center',
    gap: 15,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishListCardIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: AppColors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelSection: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 25,
    paddingTop: 20,
    marginBottom: responsiveHeight(2),
    // padding: 20,
    // marginTop: responsiveHeight(2),
  },
  wheelWrapper: {
    padding: 10,
    backgroundColor: AppColors.WHITE,
    borderRadius: responsiveWidth(40),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  winnerCard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    width: responsiveWidth(60),
    borderWidth: 1,
    borderColor: AppColors.BTNCOLOURS,
    justifyContent: 'center',
  },
  winnerContainer: {
    alignItems: 'center',
    gap: 10,
    // backgroundColor: 'red',
  },
});

// /* eslint-disable react-native/no-inline-styles */
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import ScreenWrapper from '../../../components/ScreenWrapper';
// import AppColors from '../../../utils/AppColors';
// import AppText from '../../../components/AppTextComps/AppText';
// import AppTextInput from '../../../components/AppTextInput';
// import LineBreak from '../../../components/LineBreak';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../utils/Responsive_Dimensions';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {useSelector} from 'react-redux';
// import {baseUrl} from '../../../utils/api_content';
// import {GetReviews} from '../../../ApiCalls/Main/Reviews/ReviewsApiCall';
// import {useCustomNavigation} from '../../../utils/Hooks';
// import AppButton from '../../../components/AppButton';
// import SVGXml from '../../../components/SVGXML';
// import {AppIcons} from '../../../assets/icons';
// import {GetWishList} from '../../../ApiCalls/Main/WishList_API/WishListAPI';

// const JournalHome = ({navigation}) => {
//   const {navigateToRoute} = useCustomNavigation();
//   const userData = useSelector(state => state.user.userData);
//   const token = useSelector(state => state.user.token);
//   const [counts, setCounts] = useState({likes: 0, hates: 0});
//   const [likesData, setLikesData] = useState([]);
//   const [hatesData, setHatesData] = useState([]);
//   const [loader, setLoader] = useState(false);
//   const [wishlistItems, setWishlistItems] = useState([]);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       fetchListDetails();
//       fetchWishList();
//     });
//     return unsubscribe;
//   }, [navigation]);

//   const fetchListDetails = async () => {
//     setLoader(true);
//     const response = await GetReviews(token);
//     if (response?.reviews) {
//       const likedPlaces = response.reviews.filter(
//         res => res.actionType === 'Go Again',
//       );
//       const hatedPlaces = response.reviews.filter(
//         res => res.actionType === 'Avoid',
//       );
//       setLikesData(likedPlaces);
//       setHatesData(hatedPlaces);
//       setCounts({likes: likedPlaces.length, hates: hatedPlaces.length});
//     }
//     setLoader(false);
//   };

//   const fetchWishList = async () => {
//     if (!token) return;
//     // setIsLoading(true);
//     try {
//       const res = await GetWishList(token);
//       if (res?.success) {
//         setWishlistItems(res?.wishLists || []);
//       }
//     } catch (error) {
//       console.log('Error fetching wishlist:', error);
//     } finally {
//       // setIsLoading(false);
//     }
//   };

//   // if (loader) {
//   //   return (
//   //     <ScreenWrapper>
//   //       <View style={styles.center}>
//   //         <ActivityIndicator size="large" color={AppColors.BTNCOLOURS} />
//   //       </View>
//   //     </ScreenWrapper>
//   //   );
//   // }

//   return (
//     <ScreenWrapper>
//       <SafeAreaView style={{flex: 1}}>
//         <ScrollView
//           style={styles.container}
//           showsVerticalScrollIndicator={false}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
//               <Image
//                 source={{uri: `${baseUrl}/${userData?.profileImage}`}}
//                 style={styles.profileImage}
//               />
//               <View>
//                 <AppText
//                   title={'Greeting 👋'}
//                   textColor={AppColors.GRAY}
//                   textSize={1.6}
//                 />
//                 <AppText
//                   title={userData?.fullName || 'User'}
//                   textColor={AppColors.BLACK}
//                   textSize={2.2}
//                   textFontWeight
//                 />
//               </View>
//             </View>

//             <TouchableOpacity
//               onPress={() => navigateToRoute('Notifications')}
//               style={styles.notificationBtn}>
//               <SVGXml
//                 width="25"
//                 height="25"
//                 icon={AppIcons.notification_black}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* <LineBreak space={3} /> */}

//           {/* Search Bar */}
//           {/* <AppTextInput
//             inputPlaceHolder={'Track your experiences'}
//             inputWidth={80}
//             logo={<Ionicons name="search" size={20} color={AppColors.GRAY} />}
//             rightIcon={
//               <MaterialIcons
//                 name="tune"
//                 size={20}
//                 color={AppColors.BTNCOLOURS}
//               />
//             }
//           /> */}

//           <LineBreak space={4} />

//           {/* Like/Hate Cards */}
//           <View style={styles.cardsRow}>
//             <TouchableOpacity
//               style={[styles.card, {backgroundColor: '#E8F5E9'}]}
//               onPress={() =>
//                 navigateToRoute('MyLikes', {likesData: likesData})
//               }>
//               <View style={styles.cardIconContainer}>
//                 <Ionicons name="heart-outline" size={24} color="#4CAF50" />
//               </View>
//               <AppText
//                 title={'My Likes'}
//                 textColor={AppColors.BLACK}
//                 textSize={1.8}
//                 textFontWeight
//               />
//               <AppText
//                 title={`${counts.likes} places`}
//                 textColor={AppColors.GRAY}
//                 textSize={1.4}
//               />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.card, {backgroundColor: '#FFEBEE'}]}
//               onPress={() =>
//                 navigateToRoute('MyHates', {hatesData: hatesData})
//               }>
//               <View style={styles.cardIconContainer}>
//                 <Ionicons
//                   name="thumbs-down-outline"
//                   size={24}
//                   color="#F44336"
//                 />
//               </View>
//               <AppText
//                 title={'My Hates'}
//                 textColor={AppColors.BLACK}
//                 textSize={1.8}
//                 textFontWeight
//               />
//               <AppText
//                 title={`${counts.hates} places`}
//                 textColor={AppColors.GRAY}
//                 textSize={1.4}
//               />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.wishListCard, {backgroundColor: '#E3F2FD'}]}
//             onPress={() => navigateToRoute('WishList')}>
//             <View style={styles.wishListCardIconContainer}>
//               <FontAwesome name={'bookmark-o'} size={24} color={'#2196F3'} />
//             </View>
//             <AppText
//               title={'Wish List'}
//               textColor={AppColors.BLACK}
//               textSize={1.8}
//               textFontWeight
//             />
//             <AppText
//               title={`${counts.wishList} places`}
//               textColor={AppColors.GRAY}
//               textSize={1.4}
//             />
//           </TouchableOpacity>

//           <LineBreak space={4} />

//           {/* Help Me Decide Button */}
//           <AppButton
//             title={'Help Me Decide'}
//             handlePress={() => navigateToRoute('HelpMeDecide')}
//             btnBackgroundColor={AppColors.BTNCOLOURS}
//             btnWidth={90}
//             leftIcon={
//               <Ionicons
//                 name="color-wand-outline"
//                 size={20}
//                 color={AppColors.WHITE}
//                 style={{marginRight: 10}}
//               />
//             }
//           />

//           <LineBreak space={4} />

//           {/* Reminder Card */}
//           {/* <View style={styles.reminderCard}>
//             <View style={styles.reminderIconContainer}>
//               <Ionicons name="time-outline" size={24} color="#E57373" />
//             </View>
//             <View style={{flex: 1, marginLeft: 12}}>
//               <AppText
//                 title={'Reminder'}
//                 textColor={AppColors.BLACK}
//                 textSize={1.8}
//                 textFontWeight
//               />
//               <AppText
//                 title={'Did you visit somewhere new recently?'}
//                 textColor={AppColors.GRAY}
//                 textSize={1.4}
//               />
//             </View>
//           </View> */}

//           <LineBreak space={4} />
//         </ScrollView>
//       </SafeAreaView>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: responsiveWidth(5),
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: responsiveHeight(2),
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: AppColors.LIGHTGRAY,
//   },
//   notificationBtn: {
//     padding: 8,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: AppColors.LIGHTGRAY,
//   },
//   cardsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   card: {
//     width: responsiveWidth(43),
//     padding: 15,
//     borderRadius: 20,
//     gap: 8,
//   },
//   wishListCard: {
//     width: responsiveWidth(90),
//     padding: 15,
//     borderRadius: 20,
//     marginTop: responsiveHeight(2),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: AppColors.WHITE,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   wishListCardIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: AppColors.WHITE,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: responsiveHeight(1.5),
//   },
//   reminderCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF5F5',
//     padding: 20,
//     borderRadius: 20,
//   },
//   reminderIconContainer: {
//     width: 45,
//     height: 45,
//     borderRadius: 22.5,
//     backgroundColor: '#FFCDD2',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default JournalHome;
