import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { ShopInfoTab } from '@/components/profile/ShopInfoTab';
import { BusinessTab } from '@/components/profile/BusinessTab';
import { SupportTab } from '@/components/profile/SupportTab';
import { TaxRateModal } from '@/components/profile/TaxRateModal';
import { CurrencySelectorModal } from '@/components/profile/CurrencySelectorModal';
import { useProfile } from '@/hooks/use-profile';
import { styles } from '@/components/profile/profile-screen.styles';

export default function ProfileScreen() {
  const { t } = useTranslation(['common', 'profile']);
  const profile = useProfile();

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top']}>
      {profile.toastMsg && (
        <View style={styles.floatingToast}>
          <MaterialIcons name="check-circle" size={18} color="#22c55e" />
          <Text style={styles.floatingToastText}>{profile.toastMsg}</Text>
        </View>
      )}

      <ProfileHeader />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <ProfileHero
            ownerName={profile.user?.userName}
            shopName={profile.user?.shopName}
            email={profile.user?.email}
            phone={profile.user?.phone}
            avatarImage={profile.user?.image}
          />

          <ProfileTabs activeTab={profile.activeTab} onTabChange={profile.setActiveTab} />

          {profile.activeTab === 'shop_info' && (
            <ShopInfoTab
              storeId={profile.user?.storeId}
              shopCategory={profile.user?.shopCategory}
              gstNumber={profile.user?.gstNumber}
              phone={profile.user?.phone}
              email={profile.user?.email}
              businessAddress={profile.user?.businessAddress}
              copiedStoreId={profile.copiedStoreId}
              onCopyStoreId={profile.handleCopyStoreId}
            />
          )}

          {profile.activeTab === 'business' && (
            <BusinessTab
              taxEnabled={profile.taxEnabled}
              taxRate={profile.taxRate}
              currencyCode={profile.currencyCode}
              currencySymbol={profile.currencySymbol}
              onToggleTax={(value) => void profile.handleToggleTax(value)}
              onOpenTaxModal={() => profile.setTaxModalVisible(true)}
              onOpenCurrencyModal={() => profile.setCurrencyModalVisible(true)}
            />
          )}

          {profile.activeTab === 'support' && <SupportTab />}

          <TouchableOpacity style={styles.logoutBtn} onPress={profile.handleLogout} activeOpacity={0.85}>
            <MaterialIcons name="logout" size={18} color="#ba1a1a" />
            <Text style={styles.logoutBtnText}>{t('common:actions.signOut')}</Text>
          </TouchableOpacity>

          <Text style={styles.footerVersionText}>{t('profile:header.version')}</Text>
        </View>
      </ScrollView>

      <TaxRateModal
        visible={profile.taxModalVisible}
        initialRate={profile.taxRate}
        onClose={() => profile.setTaxModalVisible(false)}
        onSave={(rate) => void profile.handleSaveTaxRate(rate)}
      />

      <CurrencySelectorModal
        visible={profile.currencyModalVisible}
        initialCode={profile.currencyCode}
        initialSymbol={profile.currencySymbol}
        onClose={() => profile.setCurrencyModalVisible(false)}
        onSave={(code, symbol) => void profile.handleSaveCurrency(code, symbol)}
      />
    </SafeAreaView>
  );
}
