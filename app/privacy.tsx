import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

const PRIVACY_SECTION_KEYS = [
  { title: 'support:privacy.sections.s1Title', body: 'support:privacy.sections.s1Body' },
  { title: 'support:privacy.sections.s2Title', body: 'support:privacy.sections.s2Body' },
  { title: 'support:privacy.sections.s3Title', body: 'support:privacy.sections.s3Body' },
  { title: 'support:privacy.sections.s4Title', body: 'support:privacy.sections.s4Body' },
  { title: 'support:privacy.sections.s5Title', body: 'support:privacy.sections.s5Body' },
  { title: 'support:privacy.sections.s6Title', body: 'support:privacy.sections.s6Body' },
  { title: 'support:privacy.sections.s7Title', body: 'support:privacy.sections.s7Body' },
  { title: 'support:privacy.sections.s8Title', body: 'support:privacy.sections.s8Body' },
] as const;

export default function PrivacyScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'support']);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support:privacy.title')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroIconCircle}>
            <MaterialIcons name="privacy-tip" size={30} color="#15803d" />
          </View>
          <View style={styles.heroBannerText}>
            <Text style={styles.heroBannerTitle}>{t('support:privacy.bannerTitle')}</Text>
            <Text style={styles.heroBannerDate}>{t('support:privacy.lastUpdated')}</Text>
          </View>
        </View>

        {PRIVACY_SECTION_KEYS.map((section, i) => (
          <View
            key={section.title}
            style={[styles.sectionCard, i === PRIVACY_SECTION_KEYS.length - 1 && { marginBottom: 0 }]}
          >
            <Text style={styles.sectionTitle}>{t(section.title)}</Text>
            <Text style={styles.sectionBody}>{t(section.body)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, backgroundColor: '#ffffff',
    borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,215,0.25)',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  scroll: { padding: 16, paddingBottom: 48, gap: 10 },
  heroBanner: {
    backgroundColor: '#f0fdf4', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  heroIconCircle: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: '#dcfce7',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBannerText: { flex: 1 },
  heroBannerTitle: { fontSize: 16, fontWeight: '700', color: '#166534' },
  heroBannerDate: { fontSize: 12, color: '#4ade80', marginTop: 3 },
  sectionCard: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(195,198,215,0.3)',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  sectionBody: { fontSize: 13.5, color: '#475569', lineHeight: 21 },
});
