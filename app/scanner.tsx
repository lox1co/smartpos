import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSessionStore } from '@/stores/session-store';
import { useCartStore } from '@/stores/cart-store';
import { getProductBySku } from '@/db/repositories/product-repository';
import {
  ScannerOverlay,
  ScannedNotFoundModal,
  styles,
  BOX_HEIGHT,
} from '@/components/scanner';

export default function ScannerScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');
  const cartItemCount = useCartStore((state) => state.items.length);
  const addItem = useCartStore((state) => state.addItem);

  const [torch, setTorch] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFoundSku, setNotFoundSku] = useState<string | null>(null);

  const scanAnim = useRef(new Animated.Value(0)).current;
  const lastScanRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: BOX_HEIGHT - 6,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 2,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    const rawData = result?.data?.trim();
    if (!rawData) return;

    const now = Date.now();
    if (rawData === lastScanRef.current.code && now - lastScanRef.current.time < 1600) {
      return;
    }
    lastScanRef.current = { code: rawData, time: now };

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    if (mode === 'add_product') {
      router.replace({ pathname: '/add_product', params: { scannedSku: rawData } });
      return;
    }

    const product = await getProductBySku(storeId, rawData);
    if (product) {
      addItem(product, 1);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 700);
    } else {
      setNotFoundSku(rawData);
    }
  };

  if (!permission || !permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={48} color="#004fe6" />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionDesc}>
          SmartPOS needs access to your device camera to scan product barcodes and QR codes.
        </Text>
        <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
          <Text style={styles.grantBtnText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <ScannerOverlay
          torch={torch}
          isSuccess={isSuccess}
          scanAnim={scanAnim}
          itemCount={cartItemCount}
          onToggleTorch={() => setTorch((t) => !t)}
          onClose={() => router.back()}
          onDone={() => {
            useCartStore.getState().setIsCartOpen(true);
            router.back();
          }}
        />
      </CameraView>

      <ScannedNotFoundModal
        visible={Boolean(notFoundSku)}
        sku={notFoundSku}
        onClose={() => setNotFoundSku(null)}
        onCreateProduct={(sku) => {
          router.replace({ pathname: '/add_product', params: { scannedSku: sku } });
        }}
      />
    </View>
  );
}
