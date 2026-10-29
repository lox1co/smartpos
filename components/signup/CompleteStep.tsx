import React from 'react';
import { View, Text } from 'react-native';
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
  return (
    <View style={[styles.stepBlock, stepStyles.successBlock]}>
      <View style={stepStyles.successIconOuter}>
        <View style={stepStyles.successIconInner}>
          <MaterialIcons name="check" size={48} color="#ffffff" />
        </View>
      </View>
      <Text style={stepStyles.successTitle}>Account Created!</Text>
      <Text style={stepStyles.successSubtitle}>
        {signupMode === 'new_store'
          ? `Your store "${shopName}" is registered. You are logged as Owner.`
          : `You joined store successfully. Profile role: ${joinRole.toUpperCase()}`}
      </Text>
      <Text style={stepStyles.successMeta}>
        Please return to the login screen and log in with your email or username to start.
      </Text>
    </View>
  );
};
