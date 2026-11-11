import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ProfileCardRow } from './ProfileCardRow';
import { styles } from './business-tab.styles';

interface BusinessTabProps {
  readonly taxEnabled: boolean;
  readonly taxRate: number;
  readonly currencyCode?: string;
  readonly currencySymbol?: string;
  readonly onToggleTax: (value: boolean) => void;
  readonly onOpenTaxModal: () => void;
  readonly onOpenCurrencyModal: () => void;
}

export const BusinessTab = ({
  taxEnabled,
  taxRate,
  currencyCode = 'USD',
  currencySymbol = '$',
  onToggleTax,
  onOpenTaxModal,
  onOpenCurrencyModal,
}: BusinessTabProps) => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <View style={styles.cardContainer}>
      <ProfileCardRow
        iconName="people-alt"
        iconColor="#16a34a"
        iconBgColor="#dcfce7"
        label={t('profile:business.customersTitle')}
        subLabel={t('profile:business.customersSub')}
        onPress={() => router.push('/customers')}
      />
      <ProfileCardRow
        iconName="analytics"
        iconColor="#2563eb"
        iconBgColor="#dbeafe"
        label={t('profile:business.reportsTitle')}
        subLabel={t('profile:business.reportsSub')}
        onPress={() => router.push('/reports')}
      />
      <ProfileCardRow
        iconName="receipt"
        iconColor="#d97706"
        iconBgColor="#fef3c7"
        label={t('profile:business.transactionsTitle')}
        subLabel={t('profile:business.transactionsSub')}
        onPress={() => router.push('/transactions')}
      />
      <ProfileCardRow
        iconName="request-quote"
        iconColor="#d97706"
        iconBgColor="#fef3c7"
        label={t('profile:business.taxTitle')}
        subLabel={
          taxEnabled
            ? t('profile:business.taxActiveSub', { rate: taxRate })
            : t('profile:business.taxDisabledSub')
        }
        rightElement={
          <Switch
            value={taxEnabled}
            onValueChange={onToggleTax}
            trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }}
            thumbColor={taxEnabled ? '#004ac6' : '#94a3b8'}
          />
        }
        isLast={false}
      />
      {taxEnabled && (
        <ProfileCardRow
          iconName="percent"
          iconColor="#0284c7"
          iconBgColor="#e0f2fe"
          label={t('profile:business.taxRateTitle')}
          subLabel={t('profile:business.taxRateSub', { rate: taxRate })}
          onPress={onOpenTaxModal}
          rightElement={
            <View style={styles.taxBadge}>
              <Text style={styles.taxBadgeText}>{taxRate}%</Text>
            </View>
          }
          isLast={false}
        />
      )}
      <ProfileCardRow
        iconName="payments"
        iconColor="#0d9488"
        iconBgColor="#ccfbf1"
        label={t('profile:business.currencyTitle')}
        subLabel={t('profile:business.currencySub', {
          code: currencyCode,
          symbol: currencySymbol,
        })}
        onPress={onOpenCurrencyModal}
        rightElement={
          <View style={styles.taxBadge}>
            <Text style={styles.taxBadgeText}>{currencySymbol} {currencyCode}</Text>
          </View>
        }
        isLast
      />
    </View>
  );
};
