import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import ScreenWrapper from '../../../components/ScreenWrapper';
import LineBreak from '../../../components/LineBreak';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import CalendarView from '../../../components/CalendarView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import notifee from '@notifee/react-native';
import {deleteReminder} from '../../../redux/Slices';

const Reminder = ({navigation}) => {
  const dispatch = useDispatch();
  const {reminders = []} = useSelector(state => state?.user || {});

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const onDayPress = useCallback(day => {
    setSelectedDate(day.dateString);
  }, []);

  const handleDeleteReminder = async id => {
    try {
      await notifee.cancelNotification(id);
      dispatch(deleteReminder(id));
    } catch (error) {
      console.log('Error deleting reminder:', error);
    }
  };

  const markedDates = useMemo(() => {
    const marks = {};
    reminders.forEach(reminder => {
      if (!marks[reminder.date]) {
        marks[reminder.date] = {
          dots: [],
        };
      }
      marks[reminder.date].dots.push({
        key: reminder.id,
        color: AppColors.PRIMARY,
      });
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: AppColors.BTNCOLOURS,
      };
    }
    return marks;
  }, [reminders, selectedDate]);

  const selectedDateReminders = useMemo(() => {
    return reminders.filter(r => r.date === selectedDate);
  }, [reminders, selectedDate]);

  // console.log('selectedDateReminders:-', selectedDateReminders);
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <AppHeader
          onBackPress={() => navigation.goBack()}
          heading={'Reminders'}
        />
        <LineBreak space={4} />

        <View style={{paddingHorizontal: responsiveWidth(5)}}>
          <CalendarView onDayPress={onDayPress} markedDates={markedDates} />
          <LineBreak space={2} />
        </View>

        <View style={styles.listHeader}>
          <AppText
            title={
              selectedDate ? `Reminders for ${selectedDate}` : 'Select a date'
            }
            textSize={2.2}
            textFontWeight
          />
        </View>

        <View style={styles.emptyContainer}>
          {selectedDateReminders.length > 0 ? (
            selectedDateReminders.map(reminder => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={{flex: 1}}>
                  <AppText
                    title={reminder.title}
                    textSize={1.8}
                    textFontWeight
                  />
                  <AppText
                    title={reminder.description || 'No description'}
                    textColor={AppColors.GRAY}
                    textSize={1.4}
                    lineHeight={2.5}
                  />
                  <AppText
                    title={moment(reminder.fullDate).format('h:mm a')}
                    textColor={AppColors.BTNCOLOURS}
                    textSize={1.2}
                    textFontWeight
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteReminder(reminder.id)}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={responsiveFontSize(2.5)}
                    color={AppColors.RED_COLOR}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <AppText
              title="No reminders set for this date."
              textColor={AppColors.darkBlue}
              textSize={1.8}
              textAlignment="center"
            />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateReminder')}
        activeOpacity={0.8}>
        <MaterialCommunityIcons
          name="plus"
          size={responsiveFontSize(3.5)}
          color={AppColors.WHITE}
        />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  listHeader: {
    paddingHorizontal: responsiveWidth(6),
    marginBottom: 15,
  },
  emptyContainer: {
    paddingHorizontal: responsiveWidth(6),
    marginTop: 10,
  },
  reminderCard: {
    backgroundColor: AppColors.menuBg,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: responsiveWidth(6),
    bottom: responsiveHeight(4),
    backgroundColor: AppColors.BTNCOLOURS,
    width: responsiveFontSize(6.5),
    height: responsiveFontSize(6.5),
    borderRadius: responsiveFontSize(3.25),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
