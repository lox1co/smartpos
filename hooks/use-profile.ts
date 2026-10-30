import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/session-store';
import { updateUserProfile } from '@/services/profile-service';
import { UserSession } from '@/schemas/session';

export type ProfileTab = 'shop_info' | 'business' | 'support';

export const useProfile = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'profile']);
  const currentUser = useSessionStore((state) => state.currentUser);
  const updateProfile = useSessionStore((state) => state.updateProfile);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [activeTab, setActiveTab] = useState<ProfileTab>('shop_info');
  const [copiedStoreId, setCopiedStoreId] = useState(false);
  const [taxModalVisible, setTaxModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const taxEnabled = currentUser?.taxEnabled !== false;
  const taxRate = currentUser?.taxRate ?? 8;
  const currencyCode = currentUser?.currencyCode ?? 'USD';
  const currencySymbol = currentUser?.currencySymbol ?? '$';

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const handleCopyStoreId = useCallback(() => {
    const code = currentUser?.storeId || '';
    if (!code) return;
    void Clipboard.setStringAsync(code);
    setCopiedStoreId(true);
    showToast(t('profile:toasts.storeIdCopied'));
    setTimeout(() => setCopiedStoreId(false), 2500);
  }, [currentUser?.storeId, showToast, t]);

  const handleToggleTax = (value: boolean) => {
    updateProfile({ taxEnabled: value });
    void updateUserProfile({ taxEnabled: value });
    showToast(value ? t('profile:toasts.taxEnabled', { rate: taxRate }) : t('profile:toasts.taxDisabled'));
  };

  const handleSaveTaxRate = (rate: number) => {
    setTaxModalVisible(false);
    updateProfile({ taxRate: rate, taxEnabled: true });
    void updateUserProfile({ taxRate: rate, taxEnabled: true });
    showToast(t('profile:toasts.taxRateSaved', { rate }));
  };

  const handleSaveCurrency = (code: string, symbol: string) => {
    setCurrencyModalVisible(false);
    updateProfile({ currencyCode: code, currencySymbol: symbol });
    void updateUserProfile({ currencyCode: code, currencySymbol: symbol });
    showToast(t('profile:toasts.currencySaved', { code, symbol }));
  };

  const saveProfile = useCallback(async (partial: Partial<UserSession>): Promise<void> => {
    await updateUserProfile(partial);
  }, []);

  const handleLogout = () => {
    Alert.alert(t('profile:logout.confirmTitle'), t('profile:logout.confirmMessage'), [
      { text: t('common:actions.cancel'), style: 'cancel' },
      {
        text: t('common:actions.signOut'),
        style: 'destructive',
        onPress: () => {
          clearSession();
          router.replace('/login');
        },
      },
    ]);
  };

  return {
    user: currentUser,
    activeTab,
    setActiveTab,
    copiedStoreId,
    taxEnabled,
    taxRate,
    currencyCode,
    currencySymbol,
    taxModalVisible,
    setTaxModalVisible,
    currencyModalVisible,
    setCurrencyModalVisible,
    toastMsg,
    showToast,
    handleCopyStoreId,
    handleToggleTax,
    handleSaveTaxRate,
    handleSaveCurrency,
    saveProfile,
    handleLogout,
  };
};
