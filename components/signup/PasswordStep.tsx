import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './signup.styles';

interface PasswordStepProps {
  password: string;
  onChangePassword: (val: string) => void;
  confirmPassword: string;
  onChangeConfirmPassword: (val: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  password,
  onChangePassword,
  confirmPassword,
  onChangeConfirmPassword,
  showPassword,
  onToggleShowPassword,
}) => {
  const { t } = useTranslation(['common', 'signup']);

  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>{t('signup:password.title')}</Text>
      <Text style={styles.stepSubtitle}>{t('signup:password.subtitle')}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:password.passwordLabel')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('signup:password.passwordPlaceholder')}
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={onChangePassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={onToggleShowPassword} style={styles.eyeIcon}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#64748b"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('signup:password.confirmPasswordLabel')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('signup:password.confirmPasswordPlaceholder')}
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );
};
