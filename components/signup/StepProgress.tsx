import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { stepStyles } from './step-card.styles';

interface StepProgressProps {
  currentStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Account\nType' },
    { num: 2, label: 'Shop\nInformation' },
    { num: 3, label: 'Owner\nDetails' },
    { num: 4, label: 'Password\nSetup' },
    { num: 5, label: 'Complete' },
  ];

  return (
    <View style={stepStyles.stepProgressContainer}>
      <View style={stepStyles.stepLinesRow}>
        <View style={stepStyles.stepLineBg} />
        <View style={[stepStyles.stepLineActive, { width: `${((Math.min(5, currentStep) - 1) / 4) * 88 + 6}%` }]} />
        {steps.map((s) => {
          const isActive = s.num === currentStep;
          const isCompleted = s.num < currentStep;
          return (
            <View key={s.num} style={stepStyles.stepCircleWrapper}>
              <View
                style={[
                  stepStyles.stepCircle,
                  isActive && stepStyles.stepCircleActive,
                  isCompleted && stepStyles.stepCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <MaterialIcons name="check" size={14} color="#ffffff" />
                ) : (
                  <Text
                    style={[
                      stepStyles.stepCircleText,
                      isActive && stepStyles.stepCircleTextActive,
                      isCompleted && stepStyles.stepCircleTextCompleted,
                    ]}
                  >
                    {s.num}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  stepStyles.stepLabel,
                  isActive && stepStyles.stepLabelActive,
                  isCompleted && stepStyles.stepLabelCompleted,
                ]}
              >
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
