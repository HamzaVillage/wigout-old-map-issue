import React, {useState, useMemo} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AppHeader from '../../../components/AppHeader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import LineBreak from '../../../components/LineBreak';
import LogoutModal from '../../../components/LogoutModal';
import {clearToken} from '../../../redux/Slices';
import {baseUrl} from '../../../utils/api_content';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userData = useSelector(state => state.user.userData);

  const iconSize = responsiveFontSize(2.2);
  const arrowSize = responsiveFontSize(2.5);

  const menuItems = useMemo(
    () => [
      {
        id: 1,
        title: 'Update Profile',
        navTo: 'EditProfile',
        icon: (
          <AntDesign name="user" size={iconSize} color={AppColors.BTNCOLOURS} />
        ),
      },
      {
        id: 2,
        title: 'Notification',
        navTo: 'NotificationsSettings',
        icon: (
          <AntDesign
            name="bells"
            size={iconSize}
            color={AppColors.BTNCOLOURS}
          />
        ),
      },
      {
        id: 3,
        title: 'Payments',
        navTo: 'Payments',
        icon: (
          <AntDesign
            name="wallet"
            size={iconSize}
            color={AppColors.BTNCOLOURS}
          />
        ),
      },
      {
        id: 4,
        title: 'Linked Accounts',
        navTo: 'LinkedAccounts',
        icon: (
          <Ionicons
            name="swap-vertical"
            size={iconSize}
            color={AppColors.BTNCOLOURS}
          />
        ),
      },
      {
        id: 9,
        title: 'Help Center',
        navTo: 'HelpCenter',
        icon: (
          <Feather
            name="alert-circle"
            size={iconSize}
            color={AppColors.BTNCOLOURS}
          />
        ),
      },
      {
        id: 10,
        title: 'Invite Friends',
        navTo: 'InviteFriends',
        icon: (
          <Ionicons
            name="people-outline"
            size={iconSize}
            color={AppColors.BTNCOLOURS}
          />
        ),
      },
      {
        id: 11,
        title: 'Visit History',
        navTo: 'VisitHistory',
        icon: (
          <FontAwesome5
            name="star"
            size={responsiveFontSize(2)}
            color={AppColors.BTNCOLOURS}
          />
        ),
      },
      {
        id: 12,
        title: 'Logout',
        isLogout: true,
        icon: (
          <MaterialIcons
            name="logout"
            size={iconSize}
            color={AppColors.RED_COLOR}
          />
        ),
      },
    ],
    [iconSize],
  );

  const handleMenuPress = item => {
    if (item.isLogout) {
      setShowLogoutModal(true);
    } else if (item.navTo) {
      navigation.navigate(item.navTo);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <AppHeader heading="Profile" />
        <LineBreak space={2} />

        {/* User Info Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: `${baseUrl}/${userData?.profileImage}`}}
              style={styles.avatar}
            />
          </View>
          <LineBreak space={1} />
          <AppText
            title={userData?.fullName || 'User Name'}
            textColor={AppColors.BLACK}
            textSize={2.8}
            textFontWeight
          />
          {userData?.nickName && (
            <AppText
              title={`@${userData.nickName}`}
              textColor={AppColors.GRAY}
              textSize={1.6}
            />
          )}
        </View>

        <LineBreak space={3} />

        {/* Settings Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item)}>
                <View style={styles.menuLeft}>
                  <View style={styles.iconWrapper}>{item.icon}</View>
                  <AppText
                    title={item.title}
                    textColor={
                      item.isLogout ? AppColors.RED_COLOR : AppColors.BLACK
                    }
                    textSize={1.8}
                  />
                </View>
                {!item.isLogout && (
                  <Entypo
                    name="chevron-small-right"
                    size={arrowSize}
                    color={AppColors.GRAY}
                  />
                )}
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>

        <LineBreak space={5} />
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        handleResetOnPress={() => setShowLogoutModal(false)}
        handleApplyOnPress={() => dispatch(clearToken())}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: AppColors.WHITE,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: AppColors.BTNCOLOURS,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.WHITE,
  },
  menuContainer: {
    marginHorizontal: responsiveWidth(5),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    paddingVertical: 10,
    overflow: 'hidden',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.05,
    //     shadowRadius: 10,
    //   },
    //   android: {
    //     elevation: 3,
    //   },
    // }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconWrapper: {
    width: 35,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 15,
  },
});

export default Profile;
