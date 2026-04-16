/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Alert,
  TouchableOpacity,
} from 'react-native';
import ScreenWrapper from '../../../components/ScreenWrapper';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import {useCustomNavigation} from '../../../utils/Hooks';
import BackIcon from '../../../components/AppTextComps/BackIcon';
import Svg, {Path, G, Text as SvgText} from 'react-native-svg';
import LineBreak from '../../../components/LineBreak';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppButton from '../../../components/AppButton';
import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');
const WHEEL_SIZE = width * 0.9;
const RADIUS = WHEEL_SIZE / 2;
const DURATION = 6000; // 6 seconds

const SPINNER_COLORS = [
  AppColors.BTNCOLOURS,
  AppColors.LIGHT_BTNCOLOURS,
  AppColors.THEME_COLOR,
  AppColors.PRIMARY,
  AppColors.Yellow,
  AppColors.hotPink,
  AppColors.royalBlue,
  AppColors.darkYellow,
  AppColors.lowGreen,
];

const SpinTheWheel = ({route}) => {
  const {options} = route.params || {options: []};
  const {goBack, navigateToRoute} = useCustomNavigation();
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Colors from the mockup (Dark Burgundy / Reddish Pink)

  useEffect(() => {
    startSpin();
  }, []);

  const startSpin = () => {
    setSpinning(true);
    setWinner(null);
    spinValue.setValue(0);

    // Random rotations (min 10 full spins) + random extra angle
    const randomAngle = Math.random() * 360;
    const finalAngle = 360 * 10 + randomAngle;

    Animated.timing(spinValue, {
      toValue: finalAngle,
      duration: DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setSpinning(false);
        calculateWinner(finalAngle);
      }
    });
  };

  const calculateWinner = finalAngle => {
    const numberOfSegments = options.length;
    const segmentAngle = 360 / numberOfSegments;
    const normalizedAngle = finalAngle % 360;

    // The pointer is at 90 degrees (right side) or 270 (top)?
    // Usually 0 is right. In SVG, 0 is typically 3 o'clock.
    // Let's assume the pointer is at the RIGHT (0 degrees) for now or adjust logic.
    // Actually, rotation rotates the whole group.
    // If we rotate CLOCKWISE, the segment at 0 moves to +angle.
    // To find which segment is at the pointer (say, at 0 degrees), we check:
    // (360 - (normalizedAngle % 360)) % 360 / segmentAngle

    // Let's assume pointer is at 0 (Right).
    // The wheel rotates clockwise.
    // The index of the item at 0 degrees is determined by how much we backed up.

    const indexAtPointer = Math.floor(
      ((360 - normalizedAngle) % 360) / segmentAngle,
    );

    const winningOption = options[indexAtPointer];
    setWinner(winningOption);
  };

  const handleWinnerAccept = () => {
    setCelebrating(true);
    // Let confetti run for a bit before navigating
    setTimeout(() => {
      if (winner?.fullData) {
        navigateToRoute('HomeDetails', {placeDetails: winner.fullData});
      } else {
        Alert.alert('Info', 'This is a custom option with no details.');
      }
      setCelebrating(false);
    }, 2500);
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      x,
      y,
      'L',
      start.x,
      start.y,
    ].join(' ');
    return d;
  };

  const renderWheel = () => {
    const numberOfSegments = options.length;
    const anglePerSegment = 360 / numberOfSegments;

    return options.map((option, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;
      const color = SPINNER_COLORS[index % SPINNER_COLORS.length];

      // Calculate text position (mid-angle)
      const midAngle = startAngle + anglePerSegment / 2;
      // Position text closer to outer edge but centered
      // We need to rotate text to match the segment

      // We will rotate the text group

      return (
        <G key={option.id}>
          <Path
            d={describeArc(RADIUS, RADIUS, RADIUS, startAngle, endAngle)}
            fill={color}
          />
          <G rotation={midAngle} origin={`${RADIUS}, ${RADIUS}`}>
            {/* Text placed at a certain radius, rotated -90 to be perpendicular or 0 to be radial? */}
            {/* Let's try radial text placement */}
            <SvgText
              x={RADIUS}
              y={RADIUS - RADIUS * 0.65} // Distance from center
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="14"
              fontWeight="bold"
              transform={`rotate(-90, ${RADIUS}, ${RADIUS - RADIUS * 0.65})`} // Maybe adjust rotation for readability
            >
              {option.name.length > 15
                ? option.name.substring(0, 15) + '...'
                : option.name}
            </SvgText>
          </G>
        </G>
      );
    });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScreenWrapper>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <BackIcon
              onBackPress={() => goBack()}
              iconColor={AppColors.BLACK}
            />
            <AppText
              title={'Spin the Wheel'}
              textColor={AppColors.BLACK}
              textSize={2.5}
              textFontWeight
            />
            <View style={{width: 40}} />
          </View>

          {/* <LineBreak space={5} /> */}

          <View style={styles.wheelContainer}>
            <TouchableOpacity
              onPress={winner && !spinning ? handleWinnerAccept : null}
              activeOpacity={0.7}
              disabled={!winner || spinning}>
              <AppText
                title={
                  spinning
                    ? 'Spinning...'
                    : winner
                    ? `Selected: ${winner.name}`
                    : 'Ready?'
                }
                textColor={AppColors.BTNCOLOURS}
                textSize={3}
                textFontWeight
                textAlignment={'center'}
                paddingBottom={10}
              />
              {/* {winner && !spinning && winner.fullData && (
                <AppText
                  title={'(Tap to view details)'}
                  textColor={AppColors.GRAY}
                  textSize={1.5}
                  textAlignment={'center'}
                  paddingBottom={10}
                />
              )} */}
            </TouchableOpacity>

            <View style={styles.wheelWrapper}>
              {/* The Wheel */}
              <Animated.View
                style={{
                  transform: [{rotate: spin}],
                  width: WHEEL_SIZE,
                  height: WHEEL_SIZE,
                }}>
                <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                  {renderWheel()}
                  {/* Center Circle (White Hole) */}
                  <Path
                    d={`M ${RADIUS} ${RADIUS} m -30, 0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0`}
                    fill="white"
                  />
                </Svg>
              </Animated.View>

              {/* Pointer / Indicator */}
              {/* Placing a pointer at the top (0 degrees in polar calculation logic is -90 usually, but let's stick to visual) */}
              {/* If we start Arc from -90 (Top), then pointer at Top is index 0 */}

              {/* Let's add a visual pointer overlay */}
              <View style={styles.pointer} />
            </View>

            {/* Bottom Actions */}
            {!spinning && winner && (
              <View style={styles.actionContainer}>
                <AppButton
                  title={`Let's Go to ${
                    winner.name.length > 20
                      ? winner.name.substring(0, 20) + '...'
                      : winner.name
                  }!`}
                  handlePress={handleWinnerAccept}
                  btnBackgroundColor={AppColors.BTNCOLOURS}
                  btnWidth={85}
                />
                <TouchableOpacity
                  onPress={startSpin}
                  style={styles.spinAgainBtn}>
                  <AppText
                    title={'Spin Again'}
                    textColor={AppColors.GRAY}
                    textSize={1.6}
                    textFontWeight
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Confetti Overlay */}
        {celebrating && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({length: 30}).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const ConfettiParticle = ({index}) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(1);

  const colors = [
    AppColors.BTNCOLOURS,
    AppColors.Yellow,
    AppColors.hotPink,
    AppColors.royalBlue,
    AppColors.THEME_COLOR,
  ];
  const color = colors[index % colors.length];

  useEffect(() => {
    const delay = Math.random() * 1000;
    const duration = 1500 + Math.random() * 1000;

    translateY.value = withDelay(
      delay,
      withTiming(responsiveHeight(100), {duration}),
    );
    rotate.value = withDelay(delay, withTiming(rotate.value + 720, {duration}));
    opacity.value = withDelay(
      delay + duration - 500,
      withTiming(0, {duration: 500}),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: translateY.value},
      {translateX: translateX.value},
      {rotate: `${rotate.value}deg`},
    ],
    opacity: opacity.value,
  }));

  return (
    <AnimatedReanimated.View
      style={[
        {
          position: 'absolute',
          width: 8 + Math.random() * 6,
          height: 8 + Math.random() * 6,
          backgroundColor: color,
          borderRadius: index % 2 === 0 ? 0 : 5,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: responsiveHeight(2),
  },
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pointer: {
    position: 'absolute',
    top: -20, // Adjust based on expectation
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.BTNCOLOURS, // Pointer color
    transform: [{rotate: '180deg'}], // Pointing down
  },
  actionContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  spinAgainBtn: {
    paddingVertical: 10,
  },
});

export default SpinTheWheel;
