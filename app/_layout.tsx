import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { LogBox } from 'react-native';
import { useEffect } from 'react';
import '@/i18n';
import { initializeDatabase } from '@/db/init';
import { useSessionStore } from '@/stores/session-store';
import { syncCatalogFromServer, startSyncWorker, stopSyncWorker } from '@/services/sync';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  'Android Push notifications (remote notifications) functionality provided by expo-notifications was removed',
]);

const PUBLIC_ROUTES = ['index', 'login', 'signup'];

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const currentUser = useSessionStore((state) => state.currentUser);
  const isHydrated = useSessionStore((state) => state.isHydrated);

  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    const token = currentUser?.token;
    const storeId = currentUser?.storeId;

    if (token && storeId) {
      startSyncWorker(storeId, token);
      void syncCatalogFromServer(token).catch(() => {});
    } else {
      stopSyncWorker();
    }

    return () => {
      stopSyncWorker();
    };
  }, [currentUser?.token, currentUser?.storeId]);

  useEffect(() => {
    if (!isHydrated) return;

    const currentRoute = segments[segments.length - 1] ?? '';
    const isPublic = PUBLIC_ROUTES.includes(currentRoute);
    const token = currentUser?.token;

    if (!isPublic && !token) {
      router.replace('/login');
    }
  }, [router, segments, currentUser?.token, isHydrated]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scanner" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add_product" options={{ presentation: 'modal' }} />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="customers" />
        <Stack.Screen name="about" />
        <Stack.Screen name="faq" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="store_info" />
        <Stack.Screen name="shop_category" />
        <Stack.Screen name="shop_gst" />
        <Stack.Screen name="shop_address" />
        <Stack.Screen name="shop_phone" />
        <Stack.Screen name="shop_email" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
