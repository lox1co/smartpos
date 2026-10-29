import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
  if (signupMode === 'new_store') {
    return (
      <View style={styles.stepBlock}>
        <Text style={styles.stepTitle}>Shop Information</Text>
        <Text style={styles.stepSubtitle}>Enter details of the shop you want to register</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Shop Name *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter business / shop name"
              placeholderTextColor="#94a3b8"
              value={shopName}
              onChangeText={onChangeShopName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category *</Text>
          <TouchableOpacity
            style={[styles.inputWrapper, styles.dropdownTrigger]}
            onPress={onOpenCategoryModal}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, { color: shopCategory ? THEME.textPrimary : '#94a3b8' }]}>
              {shopCategory
                ? SHOP_CATEGORIES.find((c) => c.value === shopCategory)?.label
                : 'Select Shop Category'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>GST Number (Optional)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter GSTIN (optional)"
              placeholderTextColor="#94a3b8"
              value={gstNumber}
              onChangeText={onChangeGstNumber}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Business Address (Optional)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter street, area, city"
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
      <Text style={styles.stepTitle}>Enter Store ID</Text>
      <Text style={styles.stepSubtitle}>Provide the join code issued by your store owner</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Store ID / Join Code *</Text>
        <View style={[styles.inputWrapper, verifiedStore && styles.inputWrapperSuccess]}>
          <TextInput
            style={[styles.input, { letterSpacing: 1.5, fontWeight: '700' }]}
            placeholder="Enter store ID / join code"
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
              Verified: <Text style={{ fontWeight: '700' }}>{verifiedStore.name}</Text>
            </Text>
          </View>
        ) : storeVerifyError && joinStoreId.length >= 3 ? (
          <Text style={styles.verifyErrorText}>⚠️ {storeVerifyError}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Select Your Role</Text>
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
              Cashier
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
              Manager
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
