import {useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LineBreak from '../../../components/LineBreak';
import AppHeader from '../../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  responsiveFontSize,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';

const data = [
  {id: 1, title: 'Enable Sound & Vibrate'},
  {id: 6, title: 'Payments'},
  {id: 7, title: 'Reminders'},
  {id: 8, title: 'Recommendations'},
  {id: 9, title: 'App Updates'},
  {id: 10, title: 'New Service Available'},
  {id: 11, title: 'New Tips Available'},
];

const NotificationsSettings = () => {
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
      <AppText
        title={item.title}
        textColor={AppColors.BLACK}
        textSize={2}
        textFontWeight
      />
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
    <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <LineBreak space={1} />
      <AppHeader
        onBackPress={() => navigation.goBack()}
        heading="Notifications"
      />
      <LineBreak space={4} />
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <LineBreak space={3} />}
        renderItem={renderItem}
      />
    </ScrollView>
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

export default NotificationsSettings;
