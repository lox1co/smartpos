import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './signup.styles';

interface RoleStepProps {
  signupMode: 'new_store' | 'join_store';
  onSelectMode: (mode: 'new_store' | 'join_store') => void;
}

export const RoleStep: React.FC<RoleStepProps> = ({ signupMode, onSelectMode }) => {
  const { t } = useTranslation(['common', 'signup']);

  return (
    <View style={styles.stepBlock}>
      <Text style={styles.stepTitle}>{t('signup:role.title')}</Text>
      <Text style={styles.stepSubtitle}>{t('signup:role.subtitle')}</Text>

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
            {t('signup:role.newStoreTitle')}
          </Text>
          <Text style={styles.radioDescription}>{t('signup:role.newStoreDesc')}</Text>
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
            {t('signup:role.joinStoreTitle')}
          </Text>
          <Text style={styles.radioDescription}>{t('signup:role.joinStoreDesc')}</Text>
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
