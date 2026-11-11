import React from 'react';
import { View, Text, Animated, LayoutChangeEvent } from 'react-native';
import { styles } from './scanner.styles';

interface ScannerTargetFrameProps {
  isSuccessScan: boolean;
  scanLineAnim: Animated.Value;
  onLayout: (e: LayoutChangeEvent) => void;
}

export const ScannerTargetFrame = ({
  isSuccessScan,
  scanLineAnim,
  onLayout,
}: ScannerTargetFrameProps) => {
  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      <View
        style={[styles.targetFrame, isSuccessScan && styles.targetFrameSuccess]}
        onLayout={onLayout}
      >
        <View style={[styles.cornerBracket, styles.topLeftCorner, isSuccessScan && styles.cornerSuccess]} />
        <View style={[styles.cornerBracket, styles.topRightCorner, isSuccessScan && styles.cornerSuccess]} />
        <View style={[styles.cornerBracket, styles.bottomLeftCorner, isSuccessScan && styles.cornerSuccess]} />
        <View style={[styles.cornerBracket, styles.bottomRightCorner, isSuccessScan && styles.cornerSuccess]} />

        <Animated.View
          style={[
            styles.scanLine,
            isSuccessScan && styles.scanLineSuccess,
            { top: scanLineAnim },
          ]}
        />
      </View>
      <Text style={[styles.alignmentLabel, isSuccessScan && { color: '#4ade80', fontWeight: '700' }]}>
        {isSuccessScan ? '✓ Barcode Scanned!' : 'Place barcode inside the box to scan'}
      </Text>
    </View>
  );
};
