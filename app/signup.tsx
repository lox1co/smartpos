import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  styles,
  THEME,
  StepProgress,
  RoleStep,
  StoreDetailsStep,
  UserDetailsStep,
  PasswordStep,
  CompleteStep,
  CategoryModal,
  CountryModal,
} from '@/components/signup';
import { useSignup } from '@/hooks/use-signup';

export default function SignupScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const {
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
  } = useSignup();

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'bottom']}>
      <View style={styles.waveBackground} pointerEvents="none">
        <Svg width="100%" height={240} viewBox="0 0 375 240" fill="none" style={styles.topWave} preserveAspectRatio="none">
          <Path d="M 0 0 H 375 V 170 Q 250 240 120 180 T 0 160 Z" fill="url(#top-grad)" opacity={0.8} />
          <Defs>
            <LinearGradient id="top-grad" x1="0.5" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#dbeafe" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#eff6ff" stopOpacity="0.9" />
            </LinearGradient>
          </Defs>
        </Svg>
        <Svg width="100%" height={140} viewBox="0 0 375 240" fill="none" style={styles.bottomWave} preserveAspectRatio="none">
          <Path d="M 0 240 H 375 V 70 Q 250 0 120 60 T 0 80 Z" fill="url(#bottom-grad)" opacity={0.8} />
          <Defs>
            <LinearGradient id="bottom-grad" x1="0.5" y1="1" x2="0.5" y2="0">
              <Stop offset="0%" stopColor="#dbeafe" stopOpacity="0.65" />
              <Stop offset="100%" stopColor="#eff6ff" stopOpacity="0.85" />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          <View style={styles.formContainer}>
            <View style={styles.topBarContainer}>
              {currentStep < 5 && (
                <TouchableOpacity
                  style={styles.backArrowButton}
                  onPress={handleBack}
                  accessibilityLabel="Go back"
                >
                  <MaterialIcons name="chevron-left" size={32} color={THEME.textPrimary} />
                </TouchableOpacity>
              )}

              {currentStep < 5 && (
                <View style={styles.brandingHeader}>
                  <View style={styles.logoRow}>
                    <Svg width={28} height={28} viewBox="0 0 28 28" style={{ marginRight: 6 }}>
                      <Path
                        d="M 3 6 H 7.5 L 9.8 17.5 H 21.5 L 23.5 9 H 8.5"
                        stroke="#2563eb"
                        strokeWidth={2.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <Circle cx={11.5} cy={22.5} r={2.2} fill="#2563eb" />
                      <Circle cx={19.5} cy={22.5} r={2.2} fill="#2563eb" />
                    </Svg>
                    <Text style={styles.logoText}>Smart<Text style={{ color: '#1e293b', fontWeight: '800' }}>POS</Text></Text>
                  </View>
                  <Text style={styles.brandPrompt}>Create your account to get started</Text>
                </View>
              )}
            </View>

            <StepProgress currentStep={currentStep} />

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Animated.View
              style={[
                styles.wizardCard,
                {
                  opacity: contentFadeAnim,
                  transform: [{ translateX: contentTranslateX }],
                },
              ]}
            >
              {currentStep === 1 && (
                <RoleStep
                  signupMode={signupMode}
                  onSelectMode={(mode) => setSignupMode(mode)}
                />
              )}

              {currentStep === 2 && (
                <StoreDetailsStep
                  signupMode={signupMode}
                  shopName={shopName}
                  onChangeShopName={(val) => {
                    setShopName(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  shopCategory={shopCategory}
                  onOpenCategoryModal={() => setShowCategoryModal(true)}
                  gstNumber={gstNumber}
                  onChangeGstNumber={setGstNumber}
                  businessAddress={businessAddress}
                  onChangeBusinessAddress={setBusinessAddress}
                  joinStoreId={joinStoreId}
                  onVerifyJoinCode={handleVerifyJoinCode}
                  joinRole={joinRole}
                  onSelectJoinRole={setJoinRole}
                  verifiedStore={verifiedStore}
                  isVerifyingStore={isVerifyingStore}
                  storeVerifyError={storeVerifyError}
                />
              )}

              {currentStep === 3 && (
                <UserDetailsStep
                  fullName={fullName}
                  onChangeFullName={(val) => {
                    setFullName(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  email={email}
                  onChangeEmail={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  phone={phone}
                  onChangePhone={(val) => {
                    const clean = val.replace(/[^0-9]/g, '').slice(0, 10);
                    setPhone(clean);
                    if (errorMessage) setErrorMessage('');
                  }}
                  countryCode={countryCode}
                  onOpenCountryModal={() => setShowCountryModal(true)}
                />
              )}

              {currentStep === 4 && (
                <PasswordStep
                  password={password}
                  onChangePassword={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  confirmPassword={confirmPassword}
                  onChangeConfirmPassword={(val) => {
                    setConfirmPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  showPassword={showPassword}
                  onToggleShowPassword={() => setShowPassword(!showPassword)}
                />
              )}

              {currentStep === 5 && (
                <CompleteStep
                  signupMode={signupMode}
                  shopName={shopName}
                  joinRole={joinRole}
                />
              )}

              <View style={styles.actionAreaInside}>
                {currentStep < 5 ? (
                  <TouchableOpacity
                    style={[styles.primaryButton, isLoading && { opacity: 0.8 }]}
                    onPress={() => void handleContinue()}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <View style={styles.btnContent}>
                        <Text style={styles.primaryButtonText}>
                          {currentStep === 4 ? 'Submit Details' : 'Continue'}
                        </Text>
                        <MaterialIcons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.replace('/login')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.btnContent}>
                      <Text style={styles.primaryButtonText}>Go to Sign In</Text>
                      <MaterialIcons name="login" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CategoryModal
        visible={showCategoryModal}
        selectedCategory={shopCategory}
        onSelect={(cat) => setShopCategory(cat)}
        onClose={() => setShowCategoryModal(false)}
      />

      <CountryModal
        visible={showCountryModal}
        selectedCode={countryCode}
        onSelect={(code) => setCountryCode(code)}
        onClose={() => setShowCountryModal(false)}
      />
    </SafeAreaView>
  );
}
