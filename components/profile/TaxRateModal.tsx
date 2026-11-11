import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './tax-rate-modal.styles';

interface TaxRateModalProps {
  readonly visible: boolean;
  readonly initialRate: number;
  readonly onClose: () => void;
  readonly onSave: (rate: number) => void;
}

const PRESETS = [0, 5, 8, 12, 18, 28] as const;

export const TaxRateModal = ({ visible, initialRate, onClose, onSave }: TaxRateModalProps) => {
  const { t } = useTranslation(['common', 'profile']);
  const [tempRate, setTempRate] = useState(initialRate.toString());

  const handleSave = () => {
    const val = parseFloat(tempRate);
    if (isNaN(val) || val < 0 || val > 100) {
      Alert.alert(t('profile:taxModal.invalidTitle'), t('profile:taxModal.invalidError'));
      return;
    }
    onSave(val);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('profile:taxModal.title')}</Text>
          <Text style={styles.subtitle}>{t('profile:taxModal.subtitle')}</Text>

          <Text style={styles.fieldLabel}>{t('profile:taxModal.presets')}</Text>
          <View style={styles.presetsRow}>
            {PRESETS.map((pct) => (
              <TouchableOpacity
                key={pct}
                style={[styles.presetChip, tempRate === pct.toString() && styles.presetChipActive]}
                onPress={() => setTempRate(pct.toString())}
              >
                <Text style={[styles.presetChipText, tempRate === pct.toString() && styles.presetChipTextActive]}>
                  {pct}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>{t('profile:taxModal.percentageLabel')}</Text>
          <TextInput
            style={styles.inputField}
            placeholder={t('profile:taxModal.placeholder')}
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={tempRate}
            onChangeText={setTempRate}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>{t('common:actions.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{t('profile:taxModal.saveButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
