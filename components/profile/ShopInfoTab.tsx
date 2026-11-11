import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getShopCategoryLabel } from '@/constants/config';
import { ProfileCardRow } from './ProfileCardRow';
import { styles } from './shop-info-tab.styles';

interface ShopInfoTabProps {
  readonly storeId?: string;
  readonly shopCategory?: string;
  readonly gstNumber?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly businessAddress?: string;
  readonly copiedStoreId: boolean;
  readonly onCopyStoreId: () => void;
}

export const ShopInfoTab = ({
  storeId,
  shopCategory,
  gstNumber,
  phone,
  email,
  businessAddress,
  copiedStoreId,
  onCopyStoreId,
}: ShopInfoTabProps) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'profile']);

  return (
    <View style={styles.cardContainer}>
      <ProfileCardRow
        iconName={copiedStoreId ? 'check' : 'vpn-key'}
        iconColor={copiedStoreId ? '#16a34a' : '#004ac6'}
        iconBgColor="#eff6ff"
        label={t('profile:shopInfo.storeIdLabel')}
        subLabel={copiedStoreId ? t('common:actions.copied') : `${storeId || '-'} • ${t('profile:shopInfo.storeIdTapToCopy')}`}
        onPress={onCopyStoreId}
        rightElement={
          <View style={styles.badge}>
            <Text style={[styles.badgeText, copiedStoreId && styles.copiedText]}>
              {copiedStoreId ? t('common:actions.copied') : t('common:actions.copy')}
            </Text>
          </View>
        }
      />
      <ProfileCardRow
        iconName="category"
        iconColor="#7c3aed"
        iconBgColor="#f3e8ff"
        label={t('profile:shopInfo.categoryLabel')}
        subLabel={getShopCategoryLabel(shopCategory || 'Retail')}
        onPress={() => router.push('/shop_category')}
      />
      <ProfileCardRow
        iconName="receipt-long"
        iconColor="#4f46e5"
        iconBgColor="#e0e7ff"
        label={t('profile:shopInfo.gstLabel')}
        subLabel={gstNumber || t('profile:shopInfo.gstPlaceholder')}
        onPress={() => router.push('/shop_gst')}
      />
      <ProfileCardRow
        iconName="phone"
        iconColor="#0d9488"
        iconBgColor="#ccfbf1"
        label={t('profile:shopInfo.phoneLabel')}
        subLabel={phone || t('profile:shopInfo.phonePlaceholder')}
        onPress={() => router.push('/shop_phone')}
      />
      <ProfileCardRow
        iconName="email"
        iconColor="#0284c7"
        iconBgColor="#e0f2fe"
        label={t('profile:shopInfo.emailLabel')}
        subLabel={email || t('profile:shopInfo.emailPlaceholder')}
        onPress={() => router.push('/shop_email')}
      />
      <ProfileCardRow
        iconName="location-on"
        iconColor="#e11d48"
        iconBgColor="#ffe4e6"
        label={t('profile:shopInfo.addressLabel')}
        subLabel={businessAddress || t('profile:shopInfo.addressPlaceholder')}
        onPress={() => router.push('/shop_address')}
        isLast
      />
    </View>
  );
};
