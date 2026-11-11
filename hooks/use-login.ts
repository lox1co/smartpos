import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/constants/config';
import { syncUserSession } from '@/services/auth-session';

const extractDetail = (data: unknown, fallback: string): string =>
  typeof data === 'object' && data !== null && 'detail' in data
    ? String((data as { detail: unknown }).detail)
    : fallback;

export const useLogin = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'auth']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleShowPassword = useCallback(() => setShowPassword((p) => !p), []);

  const handleForgotPassword = useCallback(() => {
    Alert.alert(t('auth:login.forgotPasswordTitle'), t('auth:login.forgotPasswordMessage'), [
      { text: t('common:actions.ok') },
    ]);
  }, [t]);

  const validate = (): boolean => {
    if (!email || !password) {
      setErrorMessage(t('common:validation.required'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email) && email.length < 3) {
      setErrorMessage(t('common:validation.invalidEmail'));
      return false;
    }
    if (password.length < 6) {
      setErrorMessage(t('common:validation.passwordTooShort'));
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setErrorMessage('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_or_username: email.trim().toLowerCase(), password }),
      });
      setIsLoading(false);
      if (!res.ok) {
        setErrorMessage(extractDetail(await res.json(), t('auth:login.errorCredentials')));
        return;
      }
      const data: unknown = await res.json();
      await syncUserSession(data);
      setIsSuccess(true);
      setTimeout(() => router.replace('/(tabs)/dashboard'), 500);
    } catch {
      setIsLoading(false);
      setErrorMessage(t('auth:login.errorConnection'));
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    isSuccess,
    errorMessage,
    setErrorMessage,
    toggleShowPassword,
    handleForgotPassword,
    handleLogin,
  };
};
