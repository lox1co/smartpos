import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

const FAQ_KEYS = [
  { q: 'support:faq.items.addProductQ', a: 'support:faq.items.addProductA' },
  { q: 'support:faq.items.offlineBillingQ', a: 'support:faq.items.offlineBillingA' },
  { q: 'support:faq.items.storeIdQ', a: 'support:faq.items.storeIdA' },
  { q: 'support:faq.items.khataQ', a: 'support:faq.items.khataA' },
  { q: 'support:faq.items.printQ', a: 'support:faq.items.printA' },
  { q: 'support:faq.items.bulkImportQ', a: 'support:faq.items.bulkImportA' },
  { q: 'support:faq.items.barcodesQ', a: 'support:faq.items.barcodesA' },
  { q: 'support:faq.items.multiStaffQ', a: 'support:faq.items.multiStaffA' },
  { q: 'support:faq.items.gstCalcQ', a: 'support:faq.items.gstCalcA' },
  { q: 'support:faq.items.restockQ', a: 'support:faq.items.restockA' },
  { q: 'support:faq.items.wrongDataQ', a: 'support:faq.items.wrongDataA' },
] as const;

export default function FaqScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'support']);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support:faq.title')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroIconCircle}>
            <MaterialIcons name="help-outline" size={30} color="#16a34a" />
          </View>
          <Text style={styles.heroText}>{t('support:faq.banner')}</Text>
        </View>

        {FAQ_KEYS.map((item) => (
          <View key={item.q} style={styles.faqItem}>
            <View style={styles.faqQuestion}>
              <View style={styles.qBadge}><Text style={styles.qBadgeText}>Q</Text></View>
              <Text style={styles.questionText}>
                {t(item.q)}
              </Text>
            </View>
            <View style={styles.faqAnswer}>
              <Text style={styles.answerText}>
                {t(item.a)}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => router.push('/contact')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="headset-mic" size={18} color="#ea580c" />
          <Text style={styles.contactBtnText}>{t('support:faq.stillQuestions')}</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#ea580c" />
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
    backgroundColor: '#ecfdf5', borderRadius: 14, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  heroIconCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#dcfce7',
    alignItems: 'center', justifyContent: 'center',
  },
  heroText: { flex: 1, fontSize: 13.5, color: '#166534', lineHeight: 20, fontWeight: '500' },
  faqItem: {
    backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(195,198,215,0.3)',
  },
  faqQuestion: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#f8fafc', paddingHorizontal: 14, paddingVertical: 12,
  },
  qBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#004ac6',
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  qBadgeText: { fontSize: 11, fontWeight: '800', color: '#ffffff' },
  questionText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0f172a', lineHeight: 20 },
  faqAnswer: { paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  answerText: { fontSize: 13.5, color: '#475569', lineHeight: 21 },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, backgroundColor: '#fff7ed', borderRadius: 14,
    borderWidth: 1, borderColor: '#fed7aa', marginTop: 4,
  },
  contactBtnText: { fontSize: 14, fontWeight: '600', color: '#ea580c' },
});
