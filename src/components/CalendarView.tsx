import React from 'react';
import {Calendar} from 'react-native-calendars';
import AppColors from '../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import {StyleSheet, View} from 'react-native';

const CalendarView = ({onDayPress, markedDates}: any) => {
  return (
    <Calendar
      style={styles.calendar}
      onDayPress={onDayPress}
      markingType={'multi-dot'}
      theme={{
        calendarBackground: 'transparent',
        backgroundColor: 'transparent',
        textSectionTitleColor: AppColors.GRAY,
        selectedDayBackgroundColor: AppColors.BTNCOLOURS,
        selectedDayTextColor: AppColors.WHITE,
        todayTextColor: AppColors.BTNCOLOURS,
        dayTextColor: AppColors.BLACK,
        textDisabledColor: '#d9e1e8',
        dotColor: AppColors.BTNCOLOURS,
        selectedDotColor: AppColors.WHITE,
        arrowColor: AppColors.BTNCOLOURS,
        monthTextColor: AppColors.BLACK,
        indicatorColor: AppColors.BTNCOLOURS,
        textDayFontWeight: '400',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '500',
      }}
      markedDates={markedDates}
    />
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  calendarWrapper: {
    paddingHorizontal: responsiveWidth(5),
  },
  calendar: {
    borderRadius: 15,
    paddingBottom: 10,
    backgroundColor: AppColors.menuBg,
    overflow: 'hidden',
  },
});
