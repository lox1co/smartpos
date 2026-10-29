import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { ProductSelect } from '@/db/schema/products';

interface StockRestockModalProps {
  visible: boolean;
  product: ProductSelect | null;
  onClose: () => void;
  onConfirmRestock: (qty: number) => Promise<void>;
}

const PRESETS = [5, 10, 25, 50, 100];

export const StockRestockModal = ({
  visible,
  product,
  onClose,
  onConfirmRestock,
}: StockRestockModalProps) => {
  const [qty, setQty] = useState('10');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setQty('10');
      setLoading(false);
    }
  }, [visible]);

  if (!visible || !product) return null;

  const numericQty = parseFloat(qty) || 0;

  const handleConfirm = async () => {
    if (numericQty <= 0) return;
    setLoading(true);
    try {
      await onConfirmRestock(numericQty);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.container}>
              <Text style={modalStyles.title}>Restock Inventory</Text>
              <Text style={modalStyles.subtitle}>{product.name}</Text>
              <Text style={modalStyles.currentStock}>
                Current Stock: {product.stock} {product.unit}
              </Text>

              <View style={modalStyles.presetsRow}>
                {PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[modalStyles.presetChip, numericQty === preset && modalStyles.presetChipActive]}
                    onPress={() => setQty(String(preset))}
                  >
                    <Text
                      style={[
                        modalStyles.presetText,
                        numericQty === preset && modalStyles.presetTextActive,
                      ]}
                    >
                      +{preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={modalStyles.inputWrap}>
                <TextInput
                  style={modalStyles.input}
                  keyboardType="numeric"
                  value={qty}
                  onChangeText={setQty}
                />
                <Text style={modalStyles.unitText}>{product.unit}</Text>
              </View>

              <View style={modalStyles.actionsRow}>
                <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
                  <Text style={modalStyles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modalStyles.confirmBtn, loading && { opacity: 0.6 }]}
                  disabled={loading}
                  onPress={handleConfirm}
                >
                  <Text style={modalStyles.confirmBtnText}>
                    {loading ? 'Updating...' : `Add +${numericQty}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 380,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  subtitle: {
    fontSize: 14,
    color: '#434655',
    marginTop: 2,
  },
  currentStock: {
    fontSize: 12,
    color: '#737686',
    marginTop: 6,
    marginBottom: 16,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#f0f3ff',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: '#004fe6',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#004fe6',
  },
  presetTextActive: {
    color: '#ffffff',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderWidth: 1.5,
    borderColor: '#c3c6d7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737686',
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eef0fa',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434655',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#004fe6',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
