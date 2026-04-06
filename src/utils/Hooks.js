import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export const useCustomNavigation = () => {
  const navigation = useNavigation();

  const navigateToRoute = (routeName, params) => {
    navigation.navigate(routeName, params);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    navigateToRoute,
    goBack,
    navigation,
  };
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
