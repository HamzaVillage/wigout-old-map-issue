module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    'react-native-reanimated/plugin', // 👈 Back to 'reanimated' for version 3.x
  ],
};
