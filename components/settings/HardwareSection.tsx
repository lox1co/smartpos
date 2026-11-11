import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ProfileCardRow } from '@/components/profile/ProfileCardRow';

interface HardwareSectionProps {
  readonly printerType: string;
  readonly paperSize: string;
  readonly autoPrint: boolean;
  readonly onToggleAutoPrint: (val: boolean) => void;
  readonly onOpenPrinterModal: () => void;
}

export const HardwareSection = ({
  printerType,
  paperSize,
  autoPrint,
  onToggleAutoPrint,
  onOpenPrinterModal,
}: HardwareSectionProps) => {
  const { t } = useTranslation('settings');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('settings:sections.hardware')}</Text>
      <View style={styles.cardContainer}>
        <ProfileCardRow
          iconName="print"
          iconColor="#6366f1"
          iconBgColor="#ede9fe"
          label={t('settings:hardware.printerTitle')}
          subLabel={`${printerType} • ${paperSize} roll`}
          onPress={onOpenPrinterModal}
        />
        <ProfileCardRow
          iconName="receipt"
          iconColor="#0284c7"
          iconBgColor="#e0f2fe"
          label={t('settings:hardware.autoPrintTitle')}
          subLabel={t('settings:hardware.autoPrintSub')}
          rightElement={
            <Switch
              value={autoPrint}
              onValueChange={onToggleAutoPrint}
              trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
              thumbColor={autoPrint ? '#004ac6' : '#94a3b8'}
            />
          }
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
