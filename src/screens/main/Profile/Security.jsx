import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import AppText from '../../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppColors from '../../../utils/AppColors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import AppButton from '../../../components/AppButton';

const data = [
  {id: 1, title: 'Remember me'},
  {id: 2, title: 'Face ID'},
  {id: 3, title: 'Biometric ID'},
  {id: 4, title: 'Google Authenticator'},
];

const Security = () => {
  const navigation = useNavigation();
  const [toggles, setToggles] = useState({});

  const handleToggle = id => {
    setToggles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <AppText title={item.title} textColor={AppColors.BLACK} textSize={2} />
      {item.id !== 4 && (
        <TouchableOpacity onPress={() => handleToggle(item.id)}>
          <FontAwesome6
            name={toggles[item.id] ? 'toggle-on' : 'toggle-off'}
            size={responsiveFontSize(4)}
            color={
              toggles[item.id] ? AppColors.BTNCOLOURS : AppColors.LIGHTGRAY
            }
          />
        </TouchableOpacity>
      )}
      {item.id === 4 && (
        <TouchableOpacity>
          <Entypo
            name="chevron-small-right"
            size={responsiveFontSize(3)}
            color={AppColors.BLACK}
          />
        </TouchableOpacity>
      )}
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onBackPress={() => navigation.goBack()} heading="Security" />
      <LineBreak space={4} />

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <LineBreak space={3} />}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <View style={{paddingHorizontal: responsiveWidth(5)}}>
            <LineBreak space={4} />
            <AppButton
              title={'Change PIN'}
              textColor={AppColors.BTNCOLOURS}
              btnBackgroundColor={AppColors.appBgColor}
              textSize={2}
              btnPadding={15}
              handlePress={() => {}}
            />
            <LineBreak space={2} />
            <AppButton
              title={'Change Password'}
              textColor={AppColors.BTNCOLOURS}
              btnBackgroundColor={AppColors.appBgColor}
              textSize={2}
              btnPadding={15}
              handlePress={() => {}}
            />
          </View>
        )}
      />
      <LineBreak space={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
});

export default Security;
