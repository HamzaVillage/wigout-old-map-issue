import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import AppImages from '../assets/images/AppImages';
import {SafeAreaView} from 'react-native-safe-area-context';

/**
 * ScreenWrapper provides a consistent background image across the application.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be wrapped.
 * @param {Object} [props.style] - Optional styles for the internal container.
 */
const ScreenWrapper = ({children, style}) => {
  return (
    <ImageBackground
      source={AppImages.imageBG2}
      style={styles.background}
      resizeMode="cover">
      <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
