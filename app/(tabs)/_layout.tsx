import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Palette } from '@/constants/theme';
import { useSessionStore } from '@/stores/session-store';

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');
  const currentUser = useSessionStore((state) => state.currentUser);

  useEffect(() => {
    const token = currentUser?.token;
    if (!token) {
      router.replace('/login');
    }
  }, [router, currentUser?.token]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.textTertiary,
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          backgroundColor: Palette.surface,
          borderTopWidth: 1,
          borderTopColor: Palette.surfaceMuted,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('common:navigation.dashboard'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="billing"
        options={{
          title: t('common:navigation.billing'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="point-of-sale" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('common:navigation.products'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="inventory" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: t('common:navigation.inventory'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="reorder" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('common:navigation.profile'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
