<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
=======
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
>>>>>>> 0431885dfe71bbbb64d73637331fc1697e59834b
import { SafeAreaView } from 'react-native-safe-area-context';
import { WaveBackground } from '@/components/auth/WaveBackground';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { SecureFooter } from '@/components/auth/SecureFooter';
import { useLogin } from '@/hooks/use-login';

export default function LoginScreen() {
<<<<<<< HEAD
  const router = useRouter();
  const scrollViewRef = useRef<ScrollViewInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
=======
>>>>>>> 0431885dfe71bbbb64d73637331fc1697e59834b
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const loginState = useLogin();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'bottom']}>
      <WaveBackground />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <LoginHeader isKeyboardVisible={isKeyboardVisible} />
          <LoginForm
            email={loginState.email}
            onEmailChange={loginState.setEmail}
            password={loginState.password}
            onPasswordChange={loginState.setPassword}
            showPassword={loginState.showPassword}
            onToggleShowPassword={loginState.toggleShowPassword}
            onForgotPassword={loginState.handleForgotPassword}
            onSubmit={loginState.handleLogin}
            isLoading={loginState.isLoading}
            errorMessage={loginState.errorMessage}
          />
          {!isKeyboardVisible && <SecureFooter />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  avoidingContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
});
