import React from 'react';
import { Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { HardwareSection } from '@/components/settings/HardwareSection';
import { SystemSection } from '@/components/settings/SystemSection';
import { PrinterModal } from '@/components/settings/PrinterModal';
import { BackupModal } from '@/components/settings/BackupModal';
import { LanguageSelectorModal } from '@/components/settings/LanguageSelectorModal';
import { useSettings } from '@/hooks/use-settings';
import { styles } from '@/components/settings/settings-screen.styles';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('settings');
  const settings = useSettings();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SettingsHeader />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <HardwareSection
          printerType={settings.printerType}
          paperSize={settings.paperSize}
          autoPrint={settings.autoPrint}
          onToggleAutoPrint={settings.setAutoPrint}
          onOpenPrinterModal={() => settings.setPrinterModalVisible(true)}
        />

        <SystemSection
          pushNotifications={settings.pushNotifications}
          onToggleNotifications={settings.setPushNotifications}
          lastBackup={settings.lastBackup}
          onOpenBackupModal={() => settings.setBackupModalVisible(true)}
          onOpenLanguageModal={() => settings.setLanguageModalVisible(true)}
        />

        <Text style={styles.sectionTitle}>{t('settings:sections.account')}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={settings.handleLogout} activeOpacity={0.85}>
          <MaterialIcons name="logout" size={18} color="#ba1a1a" />
          <Text style={styles.logoutBtnText}>{t('settings:account.signOut')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>{t('settings:account.version')}</Text>
      </ScrollView>

      <PrinterModal
        visible={settings.printerModalVisible}
        printerType={settings.printerType}
        paperSize={settings.paperSize}
        onSelectType={settings.setPrinterType}
        onSelectSize={settings.setPaperSize}
        onClose={() => settings.setPrinterModalVisible(false)}
      />

      <BackupModal
        visible={settings.backupModalVisible}
        lastBackup={settings.lastBackup}
        onBackup={settings.executeBackup}
        onRestore={settings.executeRestore}
        onClose={() => settings.setBackupModalVisible(false)}
      />

      <LanguageSelectorModal
        visible={settings.languageModalVisible}
        onClose={() => settings.setLanguageModalVisible(false)}
      />
    </SafeAreaView>
  );
}
