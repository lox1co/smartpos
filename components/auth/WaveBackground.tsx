import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export const WaveBackground = () => (
  <View style={styles.waveBackground} pointerEvents="none">
    <Svg width="100%" height={240} viewBox="0 0 375 240" fill="none" style={styles.topWave} preserveAspectRatio="none">
      <Path d="M 0 0 H 375 V 170 Q 250 240 120 180 T 0 160 Z" fill="url(#top-grad)" opacity={0.8} />
      <Defs>
        <LinearGradient id="top-grad" x1="0.5" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#dbeafe" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#eff6ff" stopOpacity="0.9" />
        </LinearGradient>
      </Defs>
    </Svg>
    <Svg width="100%" height={140} viewBox="0 0 375 240" fill="none" style={styles.bottomWave} preserveAspectRatio="none">
      <Path d="M 0 240 H 375 V 70 Q 250 0 120 60 T 0 80 Z" fill="url(#bottom-grad)" opacity={0.8} />
      <Defs>
        <LinearGradient id="bottom-grad" x1="0.5" y1="1" x2="0.5" y2="0">
          <Stop offset="0%" stopColor="#dbeafe" stopOpacity="0.65" />
          <Stop offset="100%" stopColor="#eff6ff" stopOpacity="0.85" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  topWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
