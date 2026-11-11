import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/session-store';
import { useCartStore } from '@/stores/cart-store';
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner';
import {
  BOX_HEIGHT,
  ScannerTargetFrame,
  ScannedListDrawer,
  ScannedItemState,
  ManualEntryModal,
  ProductNotFoundModal,
  styles,
} from '@/components/scanner';

export default function ScannerScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'products']);
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const { lookupProduct } = useBarcodeScanner();
  const addItemToCart = useCartStore((state) => state.addItem);
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const [torch, setTorch] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItemState[]>([]);
  const [manualInputVisible, setManualInputVisible] = useState(false);
  const [notFoundSku, setNotFoundSku] = useState<string | null>(null);

  const [frameLayout, setFrameLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [cameraLayout, setCameraLayout] = useState<{ width: number; height: number } | null>(null);
  const [isSuccessScan, setIsSuccessScan] = useState(false);

  const [scanLineAnim] = useState(() => new Animated.Value(0));
  const lastScanRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: BOX_HEIGHT - 6,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 2,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [scanLineAnim]);

  useEffect(() => {
    if (permission && !permission.granted) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  const isBarcodeInsideFrame = (result: BarcodeScanningResult): boolean => {
    if (!frameLayout || !cameraLayout) {
      return true;
    }

    let barcodeCenterX: number | null = null;
    let barcodeCenterY: number | null = null;

    if (result.bounds && result.bounds.origin && result.bounds.size) {
      const { origin, size } = result.bounds;
      barcodeCenterX = origin.x + size.width / 2;
      barcodeCenterY = origin.y + size.height / 2;
    } else if (result.cornerPoints && result.cornerPoints.length > 0) {
      const sumX = result.cornerPoints.reduce((acc, p) => acc + p.x, 0);
      const sumY = result.cornerPoints.reduce((acc, p) => acc + p.y, 0);
      barcodeCenterX = sumX / result.cornerPoints.length;
      barcodeCenterY = sumY / result.cornerPoints.length;
    }

    if (barcodeCenterX === null || barcodeCenterY === null) {
      return true;
    }

    const toleranceX = 35;
    const toleranceY = 35;
    const minX = frameLayout.x - toleranceX;
    const maxX = frameLayout.x + frameLayout.width + toleranceX;
    const minY = frameLayout.y - toleranceY;
    const maxY = frameLayout.y + frameLayout.height + toleranceY;

    return barcodeCenterX >= minX && barcodeCenterX <= maxX && barcodeCenterY >= minY && barcodeCenterY <= maxY;
  };

  const triggerScanFeedback = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSuccessScan(true);
    setTimeout(() => setIsSuccessScan(false), 350);
  };

  const processBarcode = async (rawCode: string) => {
    const trimmedCode = rawCode.trim();
    if (!trimmedCode) return;

    triggerScanFeedback();

    if (mode === 'add_product') {
      router.replace({ pathname: '/add_product', params: { scannedSku: trimmedCode } });
      return;
    }

    const matchedProduct = await lookupProduct(trimmedCode);
    if (!matchedProduct) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setNotFoundSku(trimmedCode);
      return;
    }

    addItemToCart(matchedProduct, 1);

    setScannedItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === matchedProduct.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        const existing = next[existingIndex];
        if (existing) {
          next[existingIndex] = { ...existing, quantity: existing.quantity + 1 };
        }
        return next;
      }
      return [{ product: matchedProduct, quantity: 1 }, ...prev];
    });
  };

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!result.data) return;

    const now = Date.now();
    if (result.data === lastScanRef.current.code && now - lastScanRef.current.time < 1600) {
      return;
    }

    if (!isBarcodeInsideFrame(result)) {
      return;
    }

    lastScanRef.current = { code: result.data, time: now };
    void processBarcode(result.data);
  };

  const handleIncrement = (productId: string) => {
    const target = scannedItems.find((i) => i.product.id === productId);
    if (!target) return;
    addItemToCart(target.product, 1);
    setScannedItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const handleDecrement = (productId: string) => {
    const target = scannedItems.find((i) => i.product.id === productId);
    if (!target) return;
    addItemToCart(target.product, -1);
    setScannedItems((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleDone = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/billing');
    }
  };

  const onCameraContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCameraLayout({ width, height });
  };

  const onFrameLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setFrameLayout({ x, y, width, height });
  };

  const renderCameraView = () => {
    if (!permission) {
      return <View style={styles.simulatedCameraContainer} />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.simulatedCameraContainer}>
          <Text style={styles.permissionText}>{t('products:scanner.permissionRequired')}</Text>
          <TouchableOpacity style={styles.permissionRequestBtn} onPress={requestPermission}>
            <Text style={styles.permissionRequestText}>{t('products:scanner.grantPermission')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'ean13',
            'ean8',
            'code128',
            'code39',
            'code93',
            'upc_a',
            'upc_e',
            'itf14',
            'codabar',
            'pdf417',
            'aztec',
            'datamatrix',
          ],
        }}
      />
    );
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View
        style={styles.viewfinderContainer}
        pointerEvents="box-none"
        onLayout={onCameraContainerLayout}
      >
        {renderCameraView()}

        <ScannerTargetFrame
          isSuccessScan={isSuccessScan}
          scanLineAnim={scanLineAnim}
          onLayout={onFrameLayout}
        />
      </View>

      <View style={[styles.header, { height: 64 + insets.top, paddingTop: insets.top }]}>
        <TouchableOpacity
          accessibilityLabel={t('common:navigation.back')}
          style={styles.headerButton}
          onPress={handleDone}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('products:scanner.title')}</Text>
        <TouchableOpacity
          accessibilityLabel="Flashlight toggle"
          style={[styles.headerButton, torch && styles.flashlightOn]}
          onPress={() => setTorch(!torch)}
        >
          <MaterialIcons
            name={torch ? 'flashlight-on' : 'flashlight-off'}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      <ScannedListDrawer
        scannedItems={scannedItems}
        bottomInset={insets.bottom}
        currencySymbol={currencySymbol}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onOpenManualEntry={() => setManualInputVisible(true)}
        onDone={handleDone}
      />

      <ManualEntryModal
        visible={manualInputVisible}
        onClose={() => setManualInputVisible(false)}
        onSubmit={(barcode) => {
          setManualInputVisible(false);
          void processBarcode(barcode);
        }}
      />

      <ProductNotFoundModal
        sku={notFoundSku}
        onDismiss={() => setNotFoundSku(null)}
        onCreateProduct={(sku) => {
          setNotFoundSku(null);
          router.replace({ pathname: '/add_product', params: { scannedSku: sku } });
        }}
      />
    </View>
  );
}
