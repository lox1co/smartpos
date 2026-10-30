import React, { useState } from 'react';
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
import { formatCents } from '@/utils/money';

interface WeightPickerModalProps {
  visible: boolean;
  product: ProductSelect | null;
  initialQuantity: number;
  currencySymbol: string;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

interface WeightPickerContentProps {
  product: ProductSelect;
  initialQuantity: number;
  currencySymbol: string;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

const WeightPickerContent = ({
  product,
  initialQuantity,
  currencySymbol,
  onClose,
  onConfirm,
}: WeightPickerContentProps) => {
  const [val, setVal] = useState(
    initialQuantity > 0 ? String(initialQuantity) : product.unit === 'g' ? '250' : '0.5'
  );

  const parsedQty = parseFloat(val) || 0;
  const estimatedCents = Math.round(product.priceCents * parsedQty);

  const handleSave = () => {
    if (parsedQty > 0) {
      onConfirm(parsedQty);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.subtitle}>
                Price: {formatCents(product.priceCents, currencySymbol)} / {product.unit}
              </Text>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={val}
                  onChangeText={setVal}
                  autoFocus
                />
                <Text style={styles.unitText}>{product.unit}</Text>
              </View>

              <Text style={styles.estimatedText}>
                Estimated line total: {formatCents(estimatedCents, currencySymbol)}
              </Text>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
                  <Text style={styles.confirmBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const WeightPickerModal = ({
  visible,
  product,
  initialQuantity,
  currencySymbol,
  onClose,
  onConfirm,
}: WeightPickerModalProps) => {
  if (!visible || !product) return null;

  return (
    <WeightPickerContent
      key={`${product.id}-${initialQuantity}`}
      product={product}
      initialQuantity={initialQuantity}
      currencySymbol={currencySymbol}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

const styles = StyleSheet.create({
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
    fontSize: 17,
    fontWeight: '700',
    color: '#131b2e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#737686',
    marginBottom: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderWidth: 1.5,
    borderColor: '#004fe6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#131b2e',
  },
  unitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#737686',
    marginLeft: 8,
  },
  estimatedText: {
    fontSize: 13,
    color: '#004fe6',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
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
