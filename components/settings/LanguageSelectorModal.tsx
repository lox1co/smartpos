import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/use-language';
import type { LanguageCode } from '@/schemas/language';
import { styles } from './language-selector-modal.styles';

interface LanguageSelectorModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

export const LanguageSelectorModal = ({ visible, onClose }: LanguageSelectorModalProps) => {
  const { t } = useTranslation(['common', 'profile']);
  const { availableLanguages, currentLanguage, setLanguage } = useLanguage();

  const handleSelect = async (code: LanguageCode) => {
    await setLanguage(code);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile:header.language')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {availableLanguages.map((item) => {
              const isSelected = item.code === currentLanguage;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                  onPress={() => void handleSelect(item.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {item.regionalLabel}
                    </Text>
                    <Text style={styles.optionCode}>{item.code}</Text>
                  </View>
                  {isSelected ? (
                    <MaterialIcons name="check-circle" size={20} color="#2563eb" />
                  ) : (
                    <MaterialIcons name="radio-button-unchecked" size={20} color="#cbd5e1" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
