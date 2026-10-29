import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './login-inputs.styles';

interface LoginInputsProps {
  readonly email: string;
  readonly onEmailChange: (value: string) => void;
  readonly password: string;
  readonly onPasswordChange: (value: string) => void;
  readonly showPassword: boolean;
  readonly onToggleShowPassword: () => void;
  readonly onForgotPassword: () => void;
}

export const LoginInputs = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  onForgotPassword,
}: LoginInputsProps) => {
  const { t } = useTranslation('auth');

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('auth:login.emailOrUsername')}</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth:login.emailPlaceholder')}
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={onEmailChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          {email.length > 0 && (
            <TouchableOpacity onPress={() => onEmailChange('')} accessibilityLabel={t('auth:login.clearInput')}>
              <MaterialIcons name="cancel" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.passwordRow}>
          <Text style={styles.inputLabel}>{t('auth:login.password')}</Text>
          <Pressable onPress={onForgotPassword}>
            <Text style={styles.forgotPassword}>{t('auth:login.forgotPassword')}</Text>
          </Pressable>
        </View>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('auth:login.passwordPlaceholder')}
            placeholderTextColor="#64748b"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={onPasswordChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={onToggleShowPassword}
            accessibilityLabel={t(showPassword ? 'auth:login.hidePassword' : 'auth:login.showPassword')}
          >
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
