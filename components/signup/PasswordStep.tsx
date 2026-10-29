import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>Password Setup</Text>
      <Text style={styles.stepSubtitle}>Create a secure password for logging in</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Create a secure password"
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
        <Text style={styles.inputLabel}>Confirm Password *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
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
