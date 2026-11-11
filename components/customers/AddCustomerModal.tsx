import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, phone?: string) => Promise<void>;
}

export const AddCustomerModal = ({
  visible,
  onClose,
  onAdd,
}: AddCustomerModalProps) => {
  const { t } = useTranslation(['common', 'customers']);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(
        t('customers:addModal.validationErrorTitle'),
        t('customers:addModal.validationErrorMessage')
      );
      return;
    }
    setLoading(true);
    try {
      await onAdd(name.trim(), phone.trim() || undefined);
      setName('');
      setPhone('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={addStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={addStyles.container}>
              <View style={addStyles.header}>
                <Text style={addStyles.title}>{t('customers:addModal.title')}</Text>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#737686" />
                </TouchableOpacity>
              </View>

              <View style={addStyles.inputGroup}>
                <Text style={addStyles.label}>{t('customers:addModal.nameLabel')}</Text>
                <TextInput
                  style={addStyles.input}
                  placeholder={t('customers:addModal.namePlaceholder')}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>

              <View style={addStyles.inputGroup}>
                <Text style={addStyles.label}>{t('customers:addModal.phoneLabel')}</Text>
                <TextInput
                  style={addStyles.input}
                  placeholder={t('customers:addModal.phonePlaceholder')}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={addStyles.btnRow}>
                <TouchableOpacity style={addStyles.cancelBtn} onPress={onClose}>
                  <Text style={addStyles.cancelText}>{t('common:actions.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[addStyles.submitBtn, loading && { opacity: 0.6 }]}
                  disabled={loading}
                  onPress={handleSubmit}
                >
                  <Text style={addStyles.submitText}>
                    {loading
                      ? t('customers:addModal.submitting')
                      : t('customers:addModal.submit')}
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

const addStyles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  inputGroup: {
    marginBottom: 14,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#434655',
  },
  input: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#c3c6d7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: '#131b2e',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eef0fa',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434655',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#004fe6',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
