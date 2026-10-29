import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ProfileTab } from '@/hooks/use-profile';

interface ProfileTabsProps {
  readonly activeTab: ProfileTab;
  readonly onTabChange: (tab: ProfileTab) => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  const { t } = useTranslation('profile');

  return (
    <View style={styles.segmentedTabContainer}>
      <TouchableOpacity
        style={[styles.segmentedTabBtn, activeTab === 'shop_info' && styles.segmentedTabBtnActive]}
        onPress={() => onTabChange('shop_info')}
        activeOpacity={0.75}
      >
        <Text
          style={[styles.segmentedTabText, activeTab === 'shop_info' && styles.segmentedTabTextActive]}
          numberOfLines={1}
        >
          {t('profile:tabs.shopInfo')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segmentedTabBtn, activeTab === 'business' && styles.segmentedTabBtnActive]}
        onPress={() => onTabChange('business')}
        activeOpacity={0.75}
      >
        <Text
          style={[styles.segmentedTabText, activeTab === 'business' && styles.segmentedTabTextActive]}
          numberOfLines={1}
        >
          {t('profile:tabs.business')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segmentedTabBtn, activeTab === 'support' && styles.segmentedTabBtnActive]}
        onPress={() => onTabChange('support')}
        activeOpacity={0.75}
      >
        <Text
          style={[styles.segmentedTabText, activeTab === 'support' && styles.segmentedTabTextActive]}
          numberOfLines={1}
        >
          {t('profile:tabs.support')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segmentedTabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedTabBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentedTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentedTabTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
