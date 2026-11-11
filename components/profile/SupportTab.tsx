import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ProfileCardRow } from './ProfileCardRow';

export const SupportTab = () => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <View style={styles.cardContainer}>
      <ProfileCardRow
        iconName="info"
        iconColor="#004ac6"
        iconBgColor="#eff6ff"
        label={t('profile:support.aboutTitle')}
        subLabel={t('profile:support.aboutSub')}
        onPress={() => router.push('/about')}
      />
      <ProfileCardRow
        iconName="help-outline"
        iconColor="#16a34a"
        iconBgColor="#ecfdf5"
        label={t('profile:support.faqTitle')}
        subLabel={t('profile:support.faqSub')}
        onPress={() => router.push('/faq')}
      />
      <ProfileCardRow
        iconName="headset-mic"
        iconColor="#ea580c"
        iconBgColor="#fff7ed"
        label={t('profile:support.contactTitle')}
        subLabel={t('profile:support.contactSub')}
        onPress={() => router.push('/contact')}
      />
      <ProfileCardRow
        iconName="privacy-tip"
        iconColor="#15803d"
        iconBgColor="#f0fdf4"
        label={t('profile:support.privacyTitle')}
        subLabel={t('profile:support.privacySub')}
        onPress={() => router.push('/privacy')}
      />
      <ProfileCardRow
        iconName="gavel"
        iconColor="#7c3aed"
        iconBgColor="#faf5ff"
        label={t('profile:support.termsTitle')}
        subLabel={t('profile:support.termsSub')}
        onPress={() => router.push('/terms')}
        isLast
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
});
