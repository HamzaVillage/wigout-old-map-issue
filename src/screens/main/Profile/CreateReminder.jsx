import {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';

import AppColors from '../../../utils/AppColors';
import AppHeader from '../../../components/AppHeader';
import LineBreak from '../../../components/LineBreak';
import AppText from '../../../components/AppTextComps/AppText';

import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import {useCustomNavigation, ShowToast} from '../../../utils/Hooks';
import AppTextInput from '../../../components/AppTextInput';
import AppButton from '../../../components/AppButton';
import {addReminder} from '../../../redux/Slices';
import ScreenWrapper from '../../../components/ScreenWrapper';

const CreateReminder = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state?.user || {});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = date => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleCreateReminder = async () => {
    if (!title.trim()) {
      ShowToast('Please enter a title');
      return;
    }

    if (selectedDate <= new Date()) {
      ShowToast('Please select a future time');
      return;
    }

    setLoading(true);
    try {
      // Request permissions (required for iOS)
      await notifee.requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'reminders',
        name: 'Reminders Channel',
        importance: AndroidImportance.HIGH,
      });

      const reminderId = Date.now().toString();
      const triggerTime = selectedDate.getTime();

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTime,
      };

      // Create a trigger notification
      await notifee.createTriggerNotification(
        {
          id: reminderId,
          title: `Reminder: ${title}`,
          body: description,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_launcher', // Status bar icon (requires transparency)
            largeIcon: 'ic_launcher', // Body icon (full color)
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
            },
          },
        },
        trigger,
      );

      // Save to Redux
      const reminderData = {
        id: reminderId,
        title,
        description,
        date: moment(selectedDate).format('YYYY-MM-DD'),
        fullDate: selectedDate.toISOString(),
      };

      dispatch(addReminder(reminderData));
      ShowToast('Reminder scheduled successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error scheduling notification:', error);
      ShowToast('Failed to schedule reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader onBackPress={true} heading={'Create Reminder'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <LineBreak space={2} />

        <View style={styles.inputWrapper}>
          <AppText title="Title" textSize={1.8} textFontWeight />
          <LineBreak space={1} />
          <AppTextInput
            inputPlaceHolder="Reminder Title"
            value={title}
            onChangeText={setTitle}
            inputWidth={90}
          />
        </View>

        <LineBreak space={2} />

        <View style={styles.inputWrapper}>
          <AppText title="Description" textSize={1.8} textFontWeight />
          <LineBreak space={1} />
          <AppTextInput
            inputPlaceHolder="Reminder Description (Optional)"
            value={description}
            onChangeText={setDescription}
            inputWidth={90}
            multiline
            textAlignVertical="top"
            height={responsiveHeight(12)}
          />
        </View>

        <LineBreak space={2} />

        <View style={styles.inputWrapper}>
          <AppText title="Select Date & Time" textSize={1.8} textFontWeight />
          <LineBreak space={1} />
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={showDatePicker}>
            <AppText
              title={moment(selectedDate).format('MMMM Do YYYY, h:mm a')}
              textColor={AppColors.BLACK}
            />
          </TouchableOpacity>
        </View>

        <LineBreak space={4} />

        <View style={{alignItems: 'center'}}>
          <AppButton
            title="Schedule Reminder"
            handlePress={handleCreateReminder}
            loading={loading}
          />
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: responsiveWidth(5),
  },
  inputWrapper: {
    width: '100%',
  },
  datePickerBtn: {
    width: '100%',
    height: 55,
    borderRadius: 10,
    backgroundColor: AppColors.menuBg,
    justifyContent: 'center',
    paddingHorizontal: 15,
    // borderWidth: 1,
    // borderColor: '#E8E8E8',
  },
});

export default CreateReminder;
