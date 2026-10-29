import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ScannedNotFoundModalProps {
  visible: boolean;
  sku: string | null;
  onClose: () => void;
  onCreateProduct: (sku: string) => void;
}

export const ScannedNotFoundModal = ({
  visible,
  sku,
  onClose,
  onCreateProduct,
}: ScannedNotFoundModalProps) => {
  if (!visible || !sku) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.container}>
              <View style={modalStyles.iconWrap}>
                <MaterialIcons name="help-outline" size={36} color="#ba1a1a" />
              </View>
              <Text style={modalStyles.title}>Product Not Found</Text>
              <Text style={modalStyles.desc}>
                No product matches barcode <Text style={{ fontWeight: '700' }}>{sku}</Text> in your local inventory.
              </Text>

              <View style={modalStyles.btnRow}>
                <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
                  <Text style={modalStyles.cancelBtnText}>Dismiss</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.createBtn}
                  onPress={() => {
                    onClose();
                    onCreateProduct(sku);
                  }}
                >
                  <Text style={modalStyles.createBtnText}>Create Product</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  desc: {
    fontSize: 14,
    color: '#737686',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eef0fa',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434655',
  },
  createBtn: {
    flex: 1,
    backgroundColor: '#004fe6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
