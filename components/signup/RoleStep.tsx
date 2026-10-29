import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './signup.styles';

interface RoleStepProps {
  signupMode: 'new_store' | 'join_store';
  onSelectMode: (mode: 'new_store' | 'join_store') => void;
}

export const RoleStep: React.FC<RoleStepProps> = ({ signupMode, onSelectMode }) => {
  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>Choose Account Type</Text>
      <Text style={styles.stepSubtitle}>Select how you want to start with SmartPOS</Text>

      <TouchableOpacity
        style={[styles.radioCard, signupMode === 'new_store' && styles.radioCardActive]}
        onPress={() => onSelectMode('new_store')}
        activeOpacity={0.8}
      >
        <View style={[styles.radioIconBox, signupMode === 'new_store' && styles.radioIconBoxActive]}>
          <MaterialIcons
            name="storefront"
            size={24}
            color={signupMode === 'new_store' ? '#2563eb' : '#64748b'}
          />
        </View>
        <View style={styles.radioTextBox}>
          <Text style={[styles.radioTitle, signupMode === 'new_store' && styles.radioTitleActive]}>
            Register New Store
          </Text>
          <Text style={styles.radioDescription}>Create a new store and start managing your business</Text>
        </View>
        <MaterialIcons
          name={signupMode === 'new_store' ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={signupMode === 'new_store' ? '#2563eb' : '#cbd5e1'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.radioCard, signupMode === 'join_store' && styles.radioCardActive]}
        onPress={() => onSelectMode('join_store')}
        activeOpacity={0.8}
      >
        <View style={[styles.radioIconBox, signupMode === 'join_store' && styles.radioIconBoxActive]}>
          <MaterialIcons
            name="people-outline"
            size={24}
            color={signupMode === 'join_store' ? '#2563eb' : '#64748b'}
          />
        </View>
        <View style={styles.radioTextBox}>
          <Text style={[styles.radioTitle, signupMode === 'join_store' && styles.radioTitleActive]}>
            Join with Store ID
          </Text>
          <Text style={styles.radioDescription}>Already have a store? Join with your store ID</Text>
        </View>
        <MaterialIcons
          name={signupMode === 'join_store' ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={signupMode === 'join_store' ? '#2563eb' : '#cbd5e1'}
        />
      </TouchableOpacity>
    </View>
  );
};
