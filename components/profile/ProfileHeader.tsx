import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export const ProfileHeader = () => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <View style={styles.topHeader}>
      <Text style={styles.topHeaderTitle}>{t('profile:header.title')}</Text>
      <TouchableOpacity
        style={styles.settingsIconBtn}
        onPress={() => router.push('/settings')}
        activeOpacity={0.7}
      >
        <MaterialIcons name="settings" size={24} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  topHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  settingsIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
