import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './add-product.styles';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  iconLeft?: string;
  iconRight?: string;
  onIconRightPress?: () => void;
  editable?: boolean;
}

export const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  iconLeft,
  iconRight,
  onIconRightPress,
  editable = true,
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel} numberOfLines={1}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !editable && styles.inputWrapperDisabled,
        ]}
      >
        {iconLeft && <Text style={styles.iconLeftText}>{iconLeft}</Text>}
        <TextInput
          style={[styles.input, !editable && { color: '#737686' }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || ''}
          placeholderTextColor="#94a3b8"
          editable={editable}
          numberOfLines={1}
        />
        {iconRight && (
          <TouchableOpacity
            style={styles.iconRightButton}
            onPress={onIconRightPress}
            disabled={!onIconRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name={iconRight as keyof typeof MaterialIcons.glyphMap} size={20} color="#434655" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
