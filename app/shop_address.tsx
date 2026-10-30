import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useProfile } from '@/hooks/use-profile';

export default function ShopAddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(['common', 'shop']);
  const { user, saveProfile, toastMsg, showToast } = useProfile();

  const [businessAddress, setBusinessAddress] = useState(user?.businessAddress || '');
  const [shopName] = useState(user?.shopName || 'SmartPOS Store');
  const [phone] = useState(user?.phone || '');
  const [gstNumber] = useState(user?.gstNumber || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    Keyboard.dismiss();
    setSaving(true);
    try {
      await saveProfile({
        businessAddress: businessAddress.trim(),
      });
      showToast(t('shop:address.toastUpdated'));
      setTimeout(() => {
        router.back();
      }, 500);
    } catch {
      Alert.alert(t('common:alerts.error'), t('shop:address.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {toastMsg && (
        <View style={styles.floatingToast}>
          <MaterialIcons name="check-circle" size={18} color="#22c55e" />
          <Text style={styles.floatingToastText}>{toastMsg}</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('shop:address.title')}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[styles.headerSaveBtn, saving && { opacity: 0.6 }]}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#004ac6" />
          ) : (
            <Text style={styles.headerSaveText}>{t('common:actions.save')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentWrapper}
        >
          <View style={styles.body}>
            <View style={styles.banner}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="location-on" size={26} color="#e11d48" />
              </View>
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle}>{t('shop:address.bannerTitle')}</Text>
                <Text style={styles.bannerSub}>
                  {t('shop:address.bannerSub')}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeading}>{t('shop:address.sectionHeading')}</Text>
            <View style={styles.card}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons name="business" size={16} color="#004ac6" />
                <Text style={styles.fieldLabel}>{t('shop:address.fieldLabel')}</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder={t('shop:address.placeholder')}
                placeholderTextColor="#94a3b8"
                value={businessAddress}
                onChangeText={setBusinessAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <Text style={styles.sectionHeading}>{t('shop:address.receiptPreview')}</Text>
            <View style={styles.receiptPreviewCard}>
              <Text style={styles.receiptStoreName}>{shopName.toUpperCase()}</Text>
              <Text style={styles.receiptAddressText} numberOfLines={2}>
                {businessAddress.trim() || t('shop:address.defaultAddressPreview')}
              </Text>
              <View style={styles.receiptMetaRow}>
                {phone ? <Text style={styles.receiptMetaText}>Ph: {phone}</Text> : null}
                {gstNumber ? <Text style={styles.receiptMetaText}>GSTIN: {gstNumber}</Text> : null}
              </View>
            </View>
          </View>

          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.75 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color="#ffffff" />
                  <Text style={styles.saveButtonText}>{t('shop:address.saveButton')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSaveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004ac6',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  body: {
    padding: 16,
    flex: 1,
  },
  floatingToast: {
    position: 'absolute',
    top: 64,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 8,
    gap: 10,
  },
  floatingToastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#881337',
  },
  bannerSub: {
    fontSize: 12,
    color: '#9f1239',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    lineHeight: 20,
  },
  receiptPreviewCard: {
    backgroundColor: '#fdfbf7',
    borderWidth: 1.5,
    borderColor: '#e2d9cc',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptStoreName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1c1917',
    letterSpacing: 1.2,
    marginBottom: 4,
    textAlign: 'center',
  },
  receiptAddressText: {
    fontSize: 12,
    color: '#57534e',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 6,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  receiptMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716c',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#004ac6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#004ac6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
