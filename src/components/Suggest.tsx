import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AppTextInput from './AppTextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';

const SuggestionInput = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState({search: false});
  const [suggestions, setSuggestions] = useState<Array>([]);
  const data = [
    'Why did my payment did not working?',
    'Why are the events prices different?',
    'Why I can not add a new payment method?',
    'Why did not I get the e-receipt after payment?',
  ];

  const handleSearch = (text: any) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = data.filter(item =>
        item.toLowerCase().includes(text.toLowerCase()),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item: any) => {
    setQuery(item);
    setSuggestions([]);
  };

  return (
    <View>
      <AppTextInput
        placeholder={'Search'}
        inputWidth={64}
        value={query}
        isFocused={isFocused.search}
        onFocus={() => setIsFocused(prev => ({...prev, search: true}))}
        onBlur={() => setIsFocused(prev => ({...prev, search: false}))}
        onChangeText={handleSearch}
        logo={
          <Ionicons
            name={'search'}
            size={responsiveFontSize(2.5)}
            color={AppColors.GRAY}
          />
        }
        rightIcon={
          <FontAwesome6
            name={'sliders'}
            size={responsiveFontSize(2.5)}
            color={AppColors.BTNCOLOURS}
          />
        }
      />
      <FlatList
        data={suggestions}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text style={styles.suggestion}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.suggestionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsList: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 15,
    maxHeight: responsiveHeight(25),
  },
  suggestion: {
    padding: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.LIGHTGRAY,
    fontSize: responsiveFontSize(1.8),
  },
});

export default SuggestionInput;
