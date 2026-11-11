import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/use-language';
import { ProfileCardRow } from '@/components/profile/ProfileCardRow';

interface SystemSectionProps {
  readonly pushNotifications: boolean;
  readonly onToggleNotifications: (val: boolean) => void;
  readonly lastBackup: string;
  readonly onOpenBackupModal: () => void;
  readonly onOpenLanguageModal: () => void;
}

export const SystemSection = ({
  pushNotifications,
  onToggleNotifications,
  lastBackup,
  onOpenBackupModal,
  onOpenLanguageModal,
}: SystemSectionProps) => {
  const { t } = useTranslation('settings');
  const { currentLanguageOption } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('settings:sections.system')}</Text>
      <View style={styles.cardContainer}>
        <ProfileCardRow
          iconName="notifications-active"
          iconColor="#ef4444"
          iconBgColor="#fef2f2"
          label={t('settings:system.lowStockTitle')}
          subLabel={t('settings:system.lowStockSub')}
          rightElement={
            <Switch
              value={pushNotifications}
              onValueChange={onToggleNotifications}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={pushNotifications ? '#004ac6' : '#94a3b8'}
            />
          }
        />
        <ProfileCardRow
          iconName="cloud-sync"
          iconColor="#0891b2"
          iconBgColor="#cffafe"
          label={t('settings:system.backupTitle')}
          subLabel={t('settings:system.backupSub', { date: lastBackup })}
          onPress={onOpenBackupModal}
        />
        <ProfileCardRow
          iconName="language"
          iconColor="#475569"
          iconBgColor="#f8fafc"
          label={t('settings:system.languageTitle')}
          subLabel={currentLanguageOption.regionalLabel}
          onPress={onOpenLanguageModal}
          isLast
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 16,
  },
});
