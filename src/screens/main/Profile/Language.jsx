import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import AppHeader from '../../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import LineBreak from '../../../components/LineBreak';
import AppText from '../../../components/AppTextComps/AppText';
import ScreenWrapper from '../../../components/ScreenWrapper';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

const languageSecOne = [
  {id: 'sec1-1', title: 'Suggested'},
  {id: 'sec1-2', title: 'English (US)'},
  {id: 'sec1-3', title: 'English (UK)'},
];

const languageSecTwo = [
  {id: 'sec2-1', title: 'Language'},
  {id: 'sec2-2', title: 'Mandarin'},
  {id: 'sec2-3', title: 'Hindi'},
  {id: 'sec2-4', title: 'Spanish'},
  {id: 'sec2-5', title: 'French'},
  {id: 'sec2-6', title: 'Arabic'},
  {id: 'sec2-7', title: 'Bengali'},
  {id: 'sec2-8', title: 'Russian'},
  {id: 'sec2-9', title: 'Indonesia'},
];

const Language = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState('');

  const renderItem = useCallback(
    ({item}) => (
      <View style={styles.row}>
        <AppText
          title={item.title}
          textColor={AppColors.BLACK}
          textSize={2}
          textFontWeight={
            item.title.toLowerCase().includes('suggested') ||
            item.title.toLowerCase().includes('language')
              ? true
              : false
          }
        />
        {!item.title.toLowerCase().includes('suggested') &&
          item.title.toLowerCase() !== 'language' && (
            <TouchableOpacity onPress={() => setSelectedId(item.id)}>
              <Ionicons
                name={
                  selectedId === item.id
                    ? 'radio-button-on-sharp'
                    : 'radio-button-off-sharp'
                }
                size={responsiveFontSize(2.5)}
                color={AppColors.BTNCOLOURS}
              />
            </TouchableOpacity>
          )}
      </View>
    ),
    [selectedId],
  );

  return (
    <ScreenWrapper>
      <View style={{flex: 1}}>
      <AppHeader onBackPress={() => navigation.goBack()} heading="Language" />
      <LineBreak space={3} />

      <View>
        <FlatList
          data={languageSecOne}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <LineBreak space={4} />}
          renderItem={renderItem}
          ListFooterComponent={() => (
            <View>
              <LineBreak space={3} />
              <View
                style={{
                  width: responsiveWidth(100),
                  height: responsiveHeight(0.1),
                  backgroundColor: AppColors.DARKGRAY,
                }}
              />
            </View>
          )}
        />
      </View>
      <LineBreak space={2.5} />
      <View>
        <FlatList
          data={languageSecTwo}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <LineBreak space={4} />}
          renderItem={renderItem}
        />
      </View>
      </View>
    </ScreenWrapper>
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

export default Language;
