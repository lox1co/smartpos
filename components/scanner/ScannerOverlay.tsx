import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './scanner.styles';

interface ScannerOverlayProps {
  torch: boolean;
  isSuccess: boolean;
  scanAnim: Animated.Value;
  itemCount: number;
  onToggleTorch: () => void;
  onClose: () => void;
  onDone: () => void;
}

export const ScannerOverlay = ({
  torch,
  isSuccess,
  scanAnim,
  itemCount,
  onToggleTorch,
  onClose,
  onDone,
}: ScannerOverlayProps) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Barcode Scanner</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={onToggleTorch}>
          <MaterialIcons
            name={torch ? 'flash-on' : 'flash-off'}
            size={24}
            color={torch ? '#ffd600' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.viewfinderWrap}>
        <View style={[styles.viewfinderBox, isSuccess && styles.boxSuccess]}>
          <Animated.View
            style={[
              styles.laserLine,
              {
                transform: [{ translateY: scanAnim }],
              },
            ]}
          />
        </View>
        <Text style={styles.hintText}>Point camera at product barcode</Text>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomCountText}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in order
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
          <Text style={styles.doneBtnText}>View Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
