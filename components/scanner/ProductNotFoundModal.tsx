import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { modalStyles } from './scanner-modals.styles';

interface ProductNotFoundModalProps {
  sku: string | null;
  onDismiss: () => void;
  onCreateProduct: (sku: string) => void;
}

export const ProductNotFoundModal = ({
  sku,
  onDismiss,
  onCreateProduct,
}: ProductNotFoundModalProps) => {
  if (!sku) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!sku}
      onRequestClose={onDismiss}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalHeader}>
            <MaterialIcons name="inventory-2" size={24} color="#ba1a1a" />
            <Text style={[modalStyles.modalTitle, { color: '#ba1a1a' }]}>Product Not Found</Text>
          </View>
          <Text style={modalStyles.modalDescription}>
            No product found with barcode / SKU:
          </Text>
          <View style={modalStyles.skuHighlightBox}>
            <Text style={modalStyles.skuHighlightText}>{sku}</Text>
          </View>
          <Text style={[modalStyles.modalDescription, { fontSize: 12, color: '#64748b' }]}>
            Would you like to register this as a new product in your inventory?
          </Text>

          <View style={modalStyles.modalActionRow}>
            <TouchableOpacity style={modalStyles.modalCancelBtn} onPress={onDismiss}>
              <Text style={modalStyles.modalCancelText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.modalSubmitBtn, { backgroundColor: '#004ac6' }]}
              onPress={() => onCreateProduct(sku)}
            >
              <Text style={modalStyles.modalSubmitText}>Create Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
