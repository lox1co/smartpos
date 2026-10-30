import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './signup.styles';

interface UserDetailsStepProps {
  fullName: string;
  onChangeFullName: (val: string) => void;
  email: string;
  onChangeEmail: (val: string) => void;
  phone: string;
  onChangePhone: (val: string) => void;
  countryCode: string;
  onOpenCountryModal: () => void;
}

export const UserDetailsStep: React.FC<UserDetailsStepProps> = ({
  fullName,
  onChangeFullName,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  countryCode,
  onOpenCountryModal,
}) => {
  const { t } = useTranslation(['common', 'signup']);

  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>{t('signup:user.title')}</Text>
      <Text style={styles.stepSubtitle}>{t('signup:user.subtitle')}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:user.nameLabel')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('signup:user.namePlaceholder')}
            placeholderTextColor="#94a3b8"
            value={fullName}
            onChangeText={onChangeFullName}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:user.emailLabel')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('signup:user.emailPlaceholder')}
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={onChangeEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:user.phoneLabel')}</Text>
        <View style={[styles.inputWrapper, { paddingHorizontal: 0 }]}>
          <TouchableOpacity
            style={styles.countryCodeSelector}
            onPress={onOpenCountryModal}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="#64748b" />
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TextInput
            style={[styles.input, { paddingHorizontal: 12 }]}
            placeholder={t('signup:user.phonePlaceholder')}
            placeholderTextColor="#94a3b8"
            value={phone}
            onChangeText={onChangePhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
};
