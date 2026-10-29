import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './profile-hero.styles';

interface ProfileHeroProps {
  readonly ownerName?: string;
  readonly shopName?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly avatarImage?: string;
}

export const ProfileHero = ({
  ownerName,
  shopName,
  email,
  phone,
  avatarImage,
}: ProfileHeroProps) => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <View style={styles.heroSection}>
      <TouchableOpacity
        style={styles.heroAvatarWrapper}
        onPress={() => router.push('/store_info')}
        activeOpacity={0.85}
      >
        <View style={styles.heroAvatarCircle}>
          {avatarImage ? (
            <Image style={styles.heroAvatarImage} source={avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.defaultAvatarContainer}>
              <Text style={styles.defaultAvatarText}>
                {ownerName ? ownerName.trim().substring(0, 2).toUpperCase() : 'SP'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.heroNameText} numberOfLines={1}>
        {ownerName || shopName || 'Store User'}
      </Text>

      <View style={styles.heroEmailRow}>
        <Text style={styles.heroEmailText} numberOfLines={1}>
          {email || phone || shopName || '-'}
        </Text>
        <MaterialIcons name="check-circle" size={16} color="#16a34a" />
      </View>

      <TouchableOpacity
        style={styles.editProfileOutlineBtn}
        onPress={() => router.push('/store_info')}
        activeOpacity={0.7}
      >
        <Text style={styles.editProfileOutlineBtnText}>{t('profile:header.editProfile')}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={18} color="#475569" />
      </TouchableOpacity>
    </View>
  );
};
