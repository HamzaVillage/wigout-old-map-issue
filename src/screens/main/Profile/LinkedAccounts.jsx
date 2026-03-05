import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import AppText from '../../../components/AppTextComps/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {AppIcons} from '../../../assets/icons';
import SVGXml from '../../../components/SVGXML';

const data = [
  {id: 1, icon: AppIcons.google_pay, title: 'Google'},
  {id: 2, icon: AppIcons.black_apple, title: 'Apple'},
  {id: 3, icon: AppIcons.facebook, title: 'Facebook'},
];

const LinkedAccounts = () => {
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
      <View style={[styles.row, {gap: 15}]}>
        <SVGXml icon={item.icon} width={'25'} height={'25'} />
        <AppText title={item.title} textColor={AppColors.BLACK} textSize={2} />
      </View>
      <TouchableOpacity onPress={() => handleToggle(item.id)}>
        <FontAwesome6
          name={toggles[item.id] ? 'toggle-on' : 'toggle-off'}
          size={responsiveFontSize(4)}
          color={toggles[item.id] ? AppColors.BTNCOLOURS : AppColors.LIGHTGRAY}
        />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onBackPress={() => navigation.goBack()}
        heading="Linked Accounts"
      />
      <LineBreak space={4} />
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <LineBreak space={3} />}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2.5),
  },
});

export default LinkedAccounts;
