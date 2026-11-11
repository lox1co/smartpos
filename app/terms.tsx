import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

const TERMS_SECTION_KEYS = [
  { title: 'support:terms.sections.s1Title', body: 'support:terms.sections.s1Body' },
  { title: 'support:terms.sections.s2Title', body: 'support:terms.sections.s2Body' },
  { title: 'support:terms.sections.s3Title', body: 'support:terms.sections.s3Body' },
  { title: 'support:terms.sections.s4Title', body: 'support:terms.sections.s4Body' },
  { title: 'support:terms.sections.s5Title', body: 'support:terms.sections.s5Body' },
  { title: 'support:terms.sections.s6Title', body: 'support:terms.sections.s6Body' },
  { title: 'support:terms.sections.s7Title', body: 'support:terms.sections.s7Body' },
  { title: 'support:terms.sections.s8Title', body: 'support:terms.sections.s8Body' },
  { title: 'support:terms.sections.s9Title', body: 'support:terms.sections.s9Body' },
  { title: 'support:terms.sections.s10Title', body: 'support:terms.sections.s10Body' },
  { title: 'support:terms.sections.s11Title', body: 'support:terms.sections.s11Body' },
] as const;

export default function TermsScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'support']);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support:terms.title')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroIconCircle}>
            <MaterialIcons name="gavel" size={30} color="#7c3aed" />
          </View>
          <View style={styles.heroBannerText}>
            <Text style={styles.heroBannerTitle}>{t('support:terms.bannerTitle')}</Text>
            <Text style={styles.heroBannerDate}>{t('support:terms.lastUpdated')}</Text>
          </View>
        </View>

        {TERMS_SECTION_KEYS.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
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
    backgroundColor: '#faf5ff', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: '#e9d5ff',
  },
  heroIconCircle: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: '#ede9fe',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBannerText: { flex: 1 },
  heroBannerTitle: { fontSize: 16, fontWeight: '700', color: '#5b21b6' },
  heroBannerDate: { fontSize: 12, color: '#a78bfa', marginTop: 3 },
  sectionCard: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(195,198,215,0.3)',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  sectionBody: { fontSize: 13.5, color: '#475569', lineHeight: 21 },
});
