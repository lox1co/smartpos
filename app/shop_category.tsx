import React, { useState } from 'react';
import {
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
import { SHOP_CATEGORIES, getShopCategoryLabel } from '@/constants/config';
import { useProfile } from '@/hooks/use-profile';
import { shopStyles } from '@/components/shop/shop-settings.styles';

export default function ShopCategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(['common', 'shop']);
  const { user, saveProfile, toastMsg, showToast } = useProfile();

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const current = user?.shopCategory || 'Retail / Apparel';
    const isPreset = SHOP_CATEGORIES.some(
      (c) =>
        c.label.toLowerCase() === current.toLowerCase() ||
        c.value.toLowerCase() === current.toLowerCase() ||
        c.code.toLowerCase() === current.toLowerCase()
    );
    return isPreset ? current : 'Other';
  });
  const [customCategory, setCustomCategory] = useState(() => {
    const current = user?.shopCategory || '';
    const isPreset = SHOP_CATEGORIES.some(
      (c) =>
        c.label.toLowerCase() === current.toLowerCase() ||
        c.value.toLowerCase() === current.toLowerCase() ||
        c.code.toLowerCase() === current.toLowerCase()
    );
    return isPreset ? '' : current;
  });
  const [isCustomMode, setIsCustomMode] = useState(() => {
    const current = user?.shopCategory || '';
    if (!current) return false;
    const isPreset = SHOP_CATEGORIES.some(
      (c) =>
        c.label.toLowerCase() === current.toLowerCase() ||
        c.value.toLowerCase() === current.toLowerCase() ||
        c.code.toLowerCase() === current.toLowerCase()
    );
    return !isPreset;
  });
  const [saving, setSaving] = useState(false);

  const handleSelectPreset = (catLabel: string) => {
    Keyboard.dismiss();
    setSelectedCategory(catLabel);
    setIsCustomMode(false);
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    const finalCategory = isCustomMode
      ? customCategory.trim()
      : selectedCategory.trim();

    if (!finalCategory) {
      Alert.alert(t('common:alerts.error'), t('shop:category.validationRequired'));
      return;
    }

    setSaving(true);
    try {
      await saveProfile({
        shopCategory: finalCategory,
      });
      showToast(t('shop:category.toastUpdated'));
      setTimeout(() => {
        router.back();
      }, 500);
    } catch {
      Alert.alert(t('common:alerts.error'), t('shop:category.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={shopStyles.container} edges={['top']}>
      {toastMsg && (
        <View style={shopStyles.floatingToast}>
          <MaterialIcons name="check-circle" size={18} color="#22c55e" />
          <Text style={shopStyles.floatingToastText}>{toastMsg}</Text>
        </View>
      )}

      <View style={shopStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={shopStyles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={shopStyles.headerTitle}>{t('shop:category.title')}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[shopStyles.headerSaveBtn, saving && { opacity: 0.6 }]}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#004ac6" />
          ) : (
            <Text style={shopStyles.headerSaveText}>{t('common:actions.save')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={shopStyles.contentWrapper}
        >
          <View style={shopStyles.body}>
            <View style={shopStyles.activeBanner}>
              <View style={shopStyles.activeIconCircle}>
                <MaterialIcons name="storefront" size={22} color="#004ac6" />
              </View>
              <View style={shopStyles.activeBannerText}>
                <Text style={shopStyles.activeBannerLabel}>{t('shop:category.currentCategory')}</Text>
                <Text style={shopStyles.activeBannerValue} numberOfLines={1}>
                  {isCustomMode && customCategory.trim()
                    ? customCategory.trim()
                    : getShopCategoryLabel(selectedCategory)}
                </Text>
              </View>
            </View>

            <Text style={shopStyles.sectionHeading}>{t('shop:category.selectBusinessType')}</Text>

            <View style={shopStyles.categoryGrid}>
              {SHOP_CATEGORIES.map((cat) => {
                const isSelected =
                  !isCustomMode &&
                  (selectedCategory.toLowerCase() === cat.label.toLowerCase() ||
                    selectedCategory.toLowerCase() === cat.value.toLowerCase() ||
                    selectedCategory.toLowerCase() === cat.code.toLowerCase());

                return (
                  <TouchableOpacity
                    key={cat.code}
                    style={[
                      shopStyles.categoryTile,
                      isSelected && shopStyles.categoryTileActive,
                    ]}
                    onPress={() => handleSelectPreset(cat.label)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        shopStyles.categoryIconCircle,
                        isSelected && shopStyles.categoryIconCircleActive,
                      ]}
                    >
                      <MaterialIcons
                        name={cat.icon as keyof typeof MaterialIcons.glyphMap}
                        size={17}
                        color={isSelected ? '#ffffff' : '#004ac6'}
                      />
                    </View>
                    <Text
                      style={[
                        shopStyles.categoryTileText,
                        isSelected && shopStyles.categoryTileTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                    {isSelected && (
                      <View style={shopStyles.selectedCheck}>
                        <MaterialIcons name="check" size={10} color="#ffffff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View
              style={[
                shopStyles.customCard,
                isCustomMode && shopStyles.customCardActive,
              ]}
            >
              <View style={shopStyles.customCardHeader}>
                <MaterialIcons
                  name="edit-note"
                  size={18}
                  color={isCustomMode ? '#004ac6' : '#64748b'}
                />
                <Text style={shopStyles.customCardTitle}>{t('shop:category.customTitle')}</Text>
              </View>
              <TextInput
                style={shopStyles.textInput}
                placeholder={t('shop:category.customPlaceholder')}
                placeholderTextColor="#94a3b8"
                value={customCategory}
                onChangeText={(text) => {
                  setCustomCategory(text);
                  if (text.trim()) {
                    setIsCustomMode(true);
                  }
                }}
                onFocus={() => {
                  if (customCategory.trim()) {
                    setIsCustomMode(true);
                  }
                }}
              />
            </View>
          </View>

          <View style={[shopStyles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TouchableOpacity
              style={[shopStyles.saveButton, saving && { opacity: 0.75 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color="#ffffff" />
                  <Text style={shopStyles.saveButtonText}>{t('shop:category.saveButton')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
