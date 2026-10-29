import { useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/config';

export interface StoreVerificationResponse {
  id: string;
  name: string;
  category: string;
}

interface SignupPayload {
  owner_name: string;
  phone: string;
  email_or_username: string;
  password: string;
  shop_name?: string;
  shop_category?: string;
  gst_number?: string;
  business_address?: string;
  store_id?: string;
  role?: string;
}

export const useSignup = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [signupMode, setSignupMode] = useState<'new_store' | 'join_store'>('new_store');

  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  const [joinStoreId, setJoinStoreId] = useState('');
  const [joinRole, setJoinRole] = useState<'cashier' | 'manager'>('cashier');
  const [verifiedStore, setVerifiedStore] = useState<StoreVerificationResponse | null>(null);
  const [isVerifyingStore, setIsVerifyingStore] = useState(false);
  const [storeVerifyError, setStoreVerifyError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;

  const handleVerifyJoinCode = async (code: string) => {
    const clean = code.trim().toUpperCase();
    setJoinStoreId(clean);
    setStoreVerifyError('');
    setVerifiedStore(null);

    if (!clean || clean.length < 3) return;

    setIsVerifyingStore(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stores/verify/${encodeURIComponent(clean)}`);
      if (response.ok) {
        const data = (await response.json()) as StoreVerificationResponse;
        setVerifiedStore(data);
        setStoreVerifyError('');
      } else {
        setVerifiedStore(null);
        setStoreVerifyError('No store found with this Join Code');
      }
    } catch {
      setVerifiedStore(null);
      setStoreVerifyError('Unable to verify store code. Check your connection.');
    } finally {
      setIsVerifyingStore(false);
    }
  };

  const animateStepTransition = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: -30,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(nextStep);
      setErrorMessage('');

      contentTranslateX.setValue(30);
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const submitSignup = async () => {
    setIsLoading(true);
    try {
      const payload: SignupPayload = {
        owner_name: fullName.trim(),
        phone: `${countryCode} ${phone.trim()}`,
        email_or_username: email.trim().toLowerCase(),
        password,
      };

      if (signupMode === 'new_store') {
        payload.shop_name = shopName.trim();
        payload.shop_category = shopCategory;
        if (gstNumber.trim()) payload.gst_number = gstNumber.trim();
        if (businessAddress.trim()) payload.business_address = businessAddress.trim();
      } else {
        payload.store_id = joinStoreId.trim().toUpperCase();
        payload.role = joinRole;
      }

      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { detail?: string };
        setErrorMessage(errData.detail || 'Signup failed. Please try again.');
        return;
      }

      animateStepTransition(5);
    } catch {
      setIsLoading(false);
      setErrorMessage('Unable to reach the server. Check your connection.');
    }
  };

  const handleContinue = async () => {
    setErrorMessage('');

    if (currentStep === 1) {
      animateStepTransition(2);
      return;
    }

    if (currentStep === 2) {
      if (signupMode === 'new_store') {
        if (!shopName.trim()) {
          setErrorMessage('Please enter your Shop Name.');
          return;
        }
        if (!shopCategory) {
          setErrorMessage('Please select a Shop Category.');
          return;
        }
      } else {
        if (!joinStoreId.trim()) {
          setErrorMessage('Please enter the Store ID / Join Code.');
          return;
        }
        if (!verifiedStore) {
          setErrorMessage('Please enter a valid, verified Store ID.');
          return;
        }
      }
      animateStepTransition(3);
      return;
    }

    if (currentStep === 3) {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your Full Name.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Please enter your Email Address.');
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid Email Address.');
        return;
      }
      if (!phone.trim() || phone.trim().length !== 10) {
        setErrorMessage('Phone number must be exactly 10 digits.');
        return;
      }
      animateStepTransition(4);
      return;
    }

    if (currentStep === 4) {
      if (!password || !confirmPassword) {
        setErrorMessage('Please fill in both password fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      await submitSignup();
    }
  };

  const handleBack = () => {
    if (currentStep === 5) return;
    if (currentStep > 1) {
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: 30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        setErrorMessage('');

        contentTranslateX.setValue(-30);
        Animated.parallel([
          Animated.timing(contentFadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(contentTranslateX, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      router.back();
    }
  };

  return {
    router,
    currentStep,
    signupMode,
    setSignupMode,
    shopName,
    setShopName,
    shopCategory,
    setShopCategory,
    gstNumber,
    setGstNumber,
    businessAddress,
    setBusinessAddress,
    joinStoreId,
    joinRole,
    setJoinRole,
    verifiedStore,
    isVerifyingStore,
    storeVerifyError,
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    countryCode,
    setCountryCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showCategoryModal,
    setShowCategoryModal,
    showCountryModal,
    setShowCountryModal,
    showPassword,
    setShowPassword,
    isLoading,
    errorMessage,
    setErrorMessage,
    contentFadeAnim,
    contentTranslateX,
    handleVerifyJoinCode,
    handleContinue,
    handleBack,
  };
};
