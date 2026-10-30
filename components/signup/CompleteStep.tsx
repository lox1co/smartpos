import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './signup.styles';
import { stepStyles } from './step-card.styles';

interface CompleteStepProps {
  signupMode: 'new_store' | 'join_store';
  shopName: string;
  joinRole: string;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({
  signupMode,
  shopName,
  joinRole,
}) => {
  const { t } = useTranslation(['common', 'signup']);

  return (
    <View style={[styles.stepBlock, stepStyles.successBlock]}>
      <View style={stepStyles.successIconOuter}>
        <View style={stepStyles.successIconInner}>
          <MaterialIcons name="check" size={48} color="#ffffff" />
        </View>
      </View>
      <Text style={stepStyles.successTitle}>{t('signup:complete.title')}</Text>
      <Text style={stepStyles.successSubtitle}>
        {signupMode === 'new_store'
          ? t('signup:complete.newStoreSubtitle', { name: shopName })
          : t('signup:complete.joinStoreSubtitle', { role: joinRole.toUpperCase() })}
      </Text>
      <Text style={stepStyles.successMeta}>
        {t('signup:complete.meta')}
      </Text>
    </View>
  );
};
