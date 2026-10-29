import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './currency-modal.styles';

export interface CurrencyPreset {
  readonly code: string;
  readonly symbol: string;
  readonly name: string;
}

export const PRESET_CURRENCIES: readonly CurrencyPreset[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar • Dólar Estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound • Libra Esterlina' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno' },
  { code: 'PEN', symbol: 'S/.', name: 'Sol Peruano' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee • Rupia India' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen • Yen Japonés' },
  { code: 'CHF', symbol: 'Fr.', name: 'Swiss Franc • Franco Suizo' },
];

interface CurrencySelectorModalProps {
  readonly visible: boolean;
  readonly initialCode?: string;
  readonly initialSymbol?: string;
  readonly onClose: () => void;
  readonly onSave: (code: string, symbol: string) => void;
}

export const CurrencySelectorModal = ({
  visible,
  initialCode = 'USD',
  initialSymbol = '$',
  onClose,
  onSave,
}: CurrencySelectorModalProps) => {
  const { t } = useTranslation(['common', 'profile']);
  const [selectedPreset, setSelectedPreset] = useState<CurrencyPreset>(() => {
    const found = PRESET_CURRENCIES.find(
      (c) => c.code === initialCode && c.symbol === initialSymbol
    );
    return found || PRESET_CURRENCIES[0];
  });

  useEffect(() => {
    const found = PRESET_CURRENCIES.find(
      (c) => c.code === initialCode && c.symbol === initialSymbol
    );
    setSelectedPreset(found || PRESET_CURRENCIES[0]);
  }, [initialCode, initialSymbol, visible]);

  const handleSave = () => {
    onSave(selectedPreset.code, selectedPreset.symbol);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.iconBadge}>
                <MaterialIcons name="payments" size={22} color="#004ac6" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{t('profile:currencyModal.title')}</Text>
                <Text style={styles.subtitle}>{t('profile:currencyModal.subtitle')}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {PRESET_CURRENCIES.map((currency) => {
              const isSelected =
                selectedPreset.code === currency.code &&
                selectedPreset.symbol === currency.symbol;

              return (
                <TouchableOpacity
                  key={`${currency.code}-${currency.symbol}`}
                  style={[styles.currencyRow, isSelected && styles.currencyRowSelected]}
                  onPress={() => setSelectedPreset(currency)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.symbolCircle,
                      isSelected && styles.symbolCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.symbolText,
                        isSelected && styles.symbolTextSelected,
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                  </View>

                  <View style={styles.textContainer}>
                    <View style={styles.codeRow}>
                      <Text
                        style={[
                          styles.codeText,
                          isSelected && styles.codeTextSelected,
                        ]}
                      >
                        {currency.code}
                      </Text>
                    </View>
                    <Text style={styles.nameText} numberOfLines={1}>
                      {currency.name}
                    </Text>
                  </View>

                  <View style={styles.checkContainer}>
                    {isSelected ? (
                      <MaterialIcons name="check-circle" size={22} color="#004ac6" />
                    ) : (
                      <MaterialIcons
                        name="radio-button-unchecked"
                        size={22}
                        color="#cbd5e1"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>{t('common:actions.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <MaterialIcons name="check" size={18} color="#ffffff" />
              <Text style={styles.saveBtnText}>{t('profile:currencyModal.saveButton')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
