import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LoginInputs } from './LoginInputs';
import { styles } from './login-form.styles';

interface LoginFormProps {
  readonly email: string;
  readonly onEmailChange: (value: string) => void;
  readonly password: string;
  readonly onPasswordChange: (value: string) => void;
  readonly showPassword: boolean;
  readonly onToggleShowPassword: () => void;
  readonly onForgotPassword: () => void;
  readonly onSubmit: () => void;
  readonly isLoading: boolean;
  readonly errorMessage: string;
}

export const LoginForm = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  onForgotPassword,
  onSubmit,
  isLoading,
  errorMessage,
}: LoginFormProps) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'auth']);

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <Text style={styles.title}>{t('auth:login.title')}</Text>
        <Text style={styles.subtitle}>{t('auth:login.subtitle')}</Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer} accessibilityRole="alert">
          <MaterialIcons name="error-outline" size={20} color="#dc2626" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <LoginInputs
        email={email}
        onEmailChange={onEmailChange}
        password={password}
        onPasswordChange={onPasswordChange}
        showPassword={showPassword}
        onToggleShowPassword={onToggleShowPassword}
        onForgotPassword={onForgotPassword}
      />

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
            <Text style={styles.primaryButtonText}>{t('common:actions.signingIn')}</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" style={styles.arrowIcon} />
            <Text style={styles.primaryButtonText}>{t('common:actions.signIn')}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.footerText}>
          {t('auth:login.noAccount')}{' '}
          <Text style={styles.footerLink} onPress={() => router.push('/signup')}>
            {t('auth:login.createAccount')}
          </Text>
        </Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
};
