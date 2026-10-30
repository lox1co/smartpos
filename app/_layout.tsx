import { View, Text, LogBox, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { useEffect } from 'react';
import '@/i18n';
import { useDatabaseMigration } from '@/hooks/use-database-migration';
import { useSessionStore } from '@/stores/session-store';
import { useSyncOrchestrator } from '@/hooks/use-sync-orchestrator';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  'Android Push notifications (remote notifications) functionality provided by expo-notifications was removed',
]);

const PUBLIC_ROUTES = ['index', 'login', 'signup'];

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { success: isDbReady, error: dbError } = useDatabaseMigration();
  const { isOnline } = useSyncOrchestrator(isDbReady);

  const currentUser = useSessionStore((state) => state.currentUser);
  const isHydrated = useSessionStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated || !isDbReady) return;

    const currentRoute = segments[segments.length - 1];
    const isPublic = !currentRoute || PUBLIC_ROUTES.some((route) => route === currentRoute);
    const token = currentUser?.token;

    if (!isPublic && !token) {
      router.replace('/login');
    }
  }, [router, segments, currentUser?.token, isHydrated, isDbReady]);

  if (dbError) {
    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Error de base de datos</Text>
          <Text style={styles.errorMessage}>{dbError.message}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isDbReady) {
    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#004fe6" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Offline Mode • Transactions are saved locally & will sync when connected
          </Text>
        </View>
      )}
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

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
  offlineBanner: {
    backgroundColor: '#b91c1c',
    paddingVertical: 4,
    alignItems: 'center',
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '600',
  },
});
