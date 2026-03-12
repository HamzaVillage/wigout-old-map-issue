import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import AppImages from '../assets/images/AppImages';

/**
 * ScreenWrapper provides a consistent background image across the application.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be wrapped.
 * @param {Object} [props.style] - Optional styles for the internal container.
 */
const ScreenWrapper = ({children, style}) => {
  return (
    <ImageBackground
      source={AppImages.imageBg}
      style={styles.background}
      resizeMode="cover">
      <View style={[styles.container, style]}>{children}</View>
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
