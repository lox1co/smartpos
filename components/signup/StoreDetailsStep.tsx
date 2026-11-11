import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { SHOP_CATEGORIES } from '@/constants/config';
import { styles, THEME } from './signup.styles';

interface StoreDetailsStepProps {
  signupMode: 'new_store' | 'join_store';
  shopName: string;
  onChangeShopName: (val: string) => void;
  shopCategory: string;
  onOpenCategoryModal: () => void;
  gstNumber: string;
  onChangeGstNumber: (val: string) => void;
  businessAddress: string;
  onChangeBusinessAddress: (val: string) => void;
  joinStoreId: string;
  onVerifyJoinCode: (val: string) => void;
  joinRole: 'cashier' | 'manager';
  onSelectJoinRole: (role: 'cashier' | 'manager') => void;
  verifiedStore: { id: string; name: string; category: string } | null;
  isVerifyingStore: boolean;
  storeVerifyError: string;
}

export const StoreDetailsStep: React.FC<StoreDetailsStepProps> = ({
  signupMode,
  shopName,
  onChangeShopName,
  shopCategory,
  onOpenCategoryModal,
  gstNumber,
  onChangeGstNumber,
  businessAddress,
  onChangeBusinessAddress,
  joinStoreId,
  onVerifyJoinCode,
  joinRole,
  onSelectJoinRole,
  verifiedStore,
  isVerifyingStore,
  storeVerifyError,
}) => {
  const { t } = useTranslation(['common', 'signup']);

  if (signupMode === 'new_store') {
    return (
      <View style={styles.stepBlock}>
        <Text style={styles.stepTitle}>{t('signup:store.newStoreTitle')}</Text>
        <Text style={styles.stepSubtitle}>{t('signup:store.newStoreSubtitle')}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('signup:store.shopNameLabel')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t('signup:store.shopNamePlaceholder')}
              placeholderTextColor="#94a3b8"
              value={shopName}
              onChangeText={onChangeShopName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('signup:store.categoryLabel')}</Text>
          <TouchableOpacity
            style={[styles.inputWrapper, styles.dropdownTrigger]}
            onPress={onOpenCategoryModal}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, { color: shopCategory ? THEME.textPrimary : '#94a3b8' }]}>
              {shopCategory
                ? SHOP_CATEGORIES.find((c) => c.value === shopCategory)?.label
                : t('signup:store.selectCategory')}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('signup:store.gstLabel')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t('signup:store.gstPlaceholder')}
              placeholderTextColor="#94a3b8"
              value={gstNumber}
              onChangeText={onChangeGstNumber}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('signup:store.addressLabel')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t('signup:store.addressPlaceholder')}
              placeholderTextColor="#94a3b8"
              value={businessAddress}
              onChangeText={onChangeBusinessAddress}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>{t('signup:store.joinStoreTitle')}</Text>
      <Text style={styles.stepSubtitle}>{t('signup:store.joinStoreSubtitle')}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:store.joinCodeLabel')}</Text>
        <View style={[styles.inputWrapper, verifiedStore && styles.inputWrapperSuccess]}>
          <TextInput
            style={[styles.input, { letterSpacing: 1.5, fontWeight: '700' }]}
            placeholder={t('signup:store.joinCodePlaceholder')}
            placeholderTextColor="#94a3b8"
            value={joinStoreId}
            onChangeText={onVerifyJoinCode}
            autoCapitalize="characters"
          />
          {isVerifyingStore ? (
            <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 8 }} />
          ) : verifiedStore ? (
            <MaterialIcons name="check-circle" size={22} color="#16a34a" style={{ marginRight: 8 }} />
          ) : null}
        </View>

        {verifiedStore ? (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="store" size={16} color="#16a34a" />
            <Text style={styles.verifiedBadgeText}>
              {t('signup:store.verified', { name: verifiedStore.name })}
            </Text>
          </View>
        ) : storeVerifyError && joinStoreId.length >= 3 ? (
          <Text style={styles.verifyErrorText}>⚠️ {storeVerifyError}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:store.roleLabel')}</Text>
        <View style={styles.rolePickerRow}>
          <TouchableOpacity
            style={[styles.roleChip, joinRole === 'cashier' && styles.roleChipActive]}
            onPress={() => onSelectJoinRole('cashier')}
          >
            <MaterialIcons
              name="point-of-sale"
              size={16}
              color={joinRole === 'cashier' ? '#2563eb' : '#64748b'}
            />
            <Text style={[styles.roleChipText, joinRole === 'cashier' && styles.roleChipTextActive]}>
              {t('signup:store.cashier')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, joinRole === 'manager' && styles.roleChipActive]}
            onPress={() => onSelectJoinRole('manager')}
          >
            <MaterialIcons
              name="manage-accounts"
              size={16}
              color={joinRole === 'manager' ? '#2563eb' : '#64748b'}
            />
            <Text style={[styles.roleChipText, joinRole === 'manager' && styles.roleChipTextActive]}>
              {t('signup:store.manager')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
