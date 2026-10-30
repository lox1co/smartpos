import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useSessionStore } from '@/stores/session-store';

export default function ContactScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'support']);
  const storeId = useSessionStore((state) => state.currentUser?.storeId) || '—';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support:contact.title')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroIconCircle}>
            <MaterialIcons name="headset-mic" size={32} color="#ea580c" />
          </View>
          <View style={styles.heroBannerText}>
            <Text style={styles.heroBannerTitle}>{t('support:contact.bannerTitle')}</Text>
            <Text style={styles.heroBannerSub}>{t('support:contact.bannerSub')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('support:contact.reachUs')}</Text>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('mailto:zynocraftx@gmail.com?subject=SmartPOS%20Support%20Request')}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconCircle, { backgroundColor: '#dbeafe' }]}>
            <MaterialIcons name="email" size={24} color="#2563eb" />
          </View>
          <View style={styles.contactCardText}>
            <Text style={styles.contactCardTitle}>{t('support:contact.emailTitle')}</Text>
            <Text style={styles.contactCardSub}>zynocraftx@gmail.com</Text>
            <Text style={styles.contactCardHint}>{t('support:contact.emailHint')}</Text>
          </View>
          <MaterialIcons name="open-in-new" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('tel:+15550192834')}
          activeOpacity={0.8}
        >
          <View style={[styles.contactIconCircle, { backgroundColor: '#dcfce7' }]}>
            <MaterialIcons name="phone" size={24} color="#16a34a" />
          </View>
          <View style={styles.contactCardText}>
            <Text style={styles.contactCardTitle}>{t('support:contact.phoneTitle')}</Text>
            <Text style={styles.contactCardSub}>+1 (555) 019-2834</Text>
            <Text style={styles.contactCardHint}>{t('support:contact.phoneHint')}</Text>
          </View>
          <MaterialIcons name="open-in-new" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('support:contact.beforeContact')}</Text>

        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color="#64748b" style={{ marginTop: 1 }} />
          <View style={styles.infoBoxText}>
            <Text style={styles.infoBoxTitle}>{t('support:contact.storeIdReady')}</Text>
            <Text style={styles.infoBoxBody}>
              {t('support:contact.storeIdBody', { id: storeId })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.faqLink}
          onPress={() => router.push('/faq')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="help" size={20} color="#7c3aed" />
          <Text style={styles.faqLinkText}>{t('support:contact.checkFaq')}</Text>
          <MaterialIcons name="chevron-right" size={20} color="#7c3aed" />
        </TouchableOpacity>
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
  scroll: { padding: 16, paddingBottom: 48, gap: 12 },
  heroBanner: {
    backgroundColor: '#fff7ed', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: '#fed7aa',
  },
  heroIconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#fde8d0',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBannerText: { flex: 1 },
  heroBannerTitle: { fontSize: 16, fontWeight: '700', color: '#9a3412' },
  heroBannerSub: { fontSize: 12.5, color: '#c2410c', marginTop: 3, lineHeight: 18 },
  sectionTitle: {
    fontSize: 11.5, fontWeight: '700', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  contactCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: 'rgba(195,198,215,0.3)',
  },
  contactIconCircle: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
  },
  contactCardText: { flex: 1 },
  contactCardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  contactCardSub: { fontSize: 13, color: '#334155', marginTop: 2 },
  contactCardHint: { fontSize: 11.5, color: '#94a3b8', marginTop: 2 },
  infoBox: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderWidth: 1, borderColor: 'rgba(195,198,215,0.3)',
  },
  infoBoxText: { flex: 1 },
  infoBoxTitle: { fontSize: 13.5, fontWeight: '700', color: '#0f172a', marginBottom: 3 },
  infoBoxBody: { fontSize: 13, color: '#475569', lineHeight: 19 },
  faqLink: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#faf5ff', padding: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#e9d5ff',
  },
  faqLinkText: { flex: 1, fontSize: 13.5, fontWeight: '600', color: '#7c3aed' },
});
