import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/session-store';

export const useSettings = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'settings']);
  const clearSession = useSessionStore((state) => state.clearSession);

  const [printerType, setPrinterType] = useState('Bluetooth');
  const [paperSize, setPaperSize] = useState('80mm');
  const [autoPrint, setAutoPrint] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [lastBackup, setLastBackup] = useState('Never');
  const [printerModalVisible, setPrinterModalVisible] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const executeBackup = useCallback(() => {
    try {
      const timeStr = new Date().toLocaleString();
      setLastBackup(timeStr);
      Alert.alert(
        t('settings:backup.successTitle'),
        t('settings:backup.successMessage', { timestamp: timeStr, count: 0 })
      );
    } catch {
      Alert.alert(t('settings:backup.failedTitle'), t('settings:backup.failedMessage'));
    }
  }, [t]);

  const executeRestore = useCallback(() => {
    Alert.alert(t('settings:backup.restoreSuccessTitle'), t('settings:backup.restoreSuccessMessage'));
  }, [t]);

  const handleLogout = useCallback(() => {
    Alert.alert(t('common:actions.signOut'), t('common:status.error'), [
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
  }, [clearSession, router, t]);

  return {
    printerType,
    paperSize,
    autoPrint,
    setAutoPrint,
    pushNotifications,
    setPushNotifications,
    lastBackup,
    printerModalVisible,
    setPrinterModalVisible,
    backupModalVisible,
    setBackupModalVisible,
    languageModalVisible,
    setLanguageModalVisible,
    setPrinterType,
    setPaperSize,
    executeBackup,
    executeRestore,
    handleLogout,
  };
};
