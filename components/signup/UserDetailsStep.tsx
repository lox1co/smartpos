import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>Owner Details</Text>
      <Text style={styles.stepSubtitle}>Provide personal details to secure your profile</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#94a3b8"
            value={fullName}
            onChangeText={onChangeFullName}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={onChangeEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
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
            placeholder="Enter 10-digit mobile number"
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
