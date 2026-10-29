import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './printer-modal.styles';

interface PrinterModalProps {
  readonly visible: boolean;
  readonly printerType: string;
  readonly paperSize: string;
  readonly onSelectType: (type: string) => void;
  readonly onSelectSize: (size: string) => void;
  readonly onClose: () => void;
}

const PRINTER_TYPES = ['Bluetooth', 'USB', 'Network (LAN / Wi-Fi)'];
const PAPER_SIZES = ['58mm (2-inch)', '80mm (3-inch)'];

export const PrinterModal = ({
  visible,
  printerType,
  paperSize,
  onSelectType,
  onSelectSize,
  onClose,
}: PrinterModalProps) => {
  const { t } = useTranslation('common');

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Printer Configuration</Text>
          <Text style={styles.label}>Connection Interface</Text>
          {PRINTER_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.row, printerType === type && styles.rowActive]}
              onPress={() => onSelectType(type)}
            >
              <Text style={[styles.text, printerType === type && styles.textActive]}>{type}</Text>
              {printerType === type && <MaterialIcons name="check" size={18} color="#004ac6" />}
            </TouchableOpacity>
          ))}
          <Text style={[styles.label, { marginTop: 14 }]}>Paper Roll Width</Text>
          {PAPER_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.row, paperSize.startsWith(size.substring(0, 4)) && styles.rowActive]}
              onPress={() => onSelectSize(size.split(' ')[0] ?? size)}
            >
              <Text style={[styles.text, paperSize.startsWith(size.substring(0, 4)) && styles.textActive]}>
                {size}
              </Text>
              {paperSize.startsWith(size.substring(0, 4)) && (
                <MaterialIcons name="check" size={18} color="#004ac6" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>{t('common:actions.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
