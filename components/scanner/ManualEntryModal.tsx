import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { modalStyles } from './scanner-modals.styles';

interface ManualEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (barcode: string) => void;
}

export const ManualEntryModal = ({
  visible,
  onClose,
  onSubmit,
}: ManualEntryModalProps) => {
  const [barcode, setBarcode] = useState('');

  const handleClose = () => {
    setBarcode('');
    onClose();
  };

  const handleSubmit = () => {
    const clean = barcode.trim();
    if (clean) {
      setBarcode('');
      onSubmit(clean);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalHeader}>
            <MaterialIcons name="keyboard" size={24} color="#004ac6" />
            <Text style={modalStyles.modalTitle}>Manual Entry</Text>
          </View>
          <Text style={modalStyles.modalDescription}>
            Enter the product barcode or SKU code below to add it.
          </Text>

          <TextInput
            style={modalStyles.modalInput}
            placeholder="e.g. 8901030383921"
            placeholderTextColor="#737686"
            value={barcode}
            onChangeText={setBarcode}
            autoCapitalize="characters"
            autoFocus
          />

          <View style={modalStyles.modalActionRow}>
            <TouchableOpacity
              style={modalStyles.modalCancelBtn}
              onPress={handleClose}
            >
              <Text style={modalStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modalStyles.modalSubmitBtn,
                !barcode.trim() && { opacity: 0.5 },
              ]}
              onPress={handleSubmit}
              disabled={!barcode.trim()}
            >
              <Text style={modalStyles.modalSubmitText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
