import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SHOP_CATEGORIES } from '@/constants/config';
import { modalStyles } from './modal.styles';

export const COUNTRY_CODES = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
];

interface CategoryModalProps {
  visible: boolean;
  selectedCategory: string;
  onSelect: (category: string) => void;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  selectedCategory,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={modalStyles.modalOverlay} onPress={onClose}>
        <Pressable style={modalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={modalStyles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="category" size={22} color="#2563eb" />
              <Text style={modalStyles.modalTitle}>Select Shop Category</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.modalCloseBtn}>
              <MaterialIcons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
            {SHOP_CATEGORIES.map((item) => {
              const isSelected = selectedCategory === item.value;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[modalStyles.modalOption, isSelected && modalStyles.modalOptionSelected]}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={[
                        modalStyles.modalOptionIconBox,
                        isSelected && modalStyles.modalOptionIconBoxSelected,
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon as keyof typeof MaterialIcons.glyphMap}
                        size={18}
                        color={isSelected ? '#2563eb' : '#64748b'}
                      />
                    </View>
                    <Text style={[modalStyles.modalOptionText, isSelected && modalStyles.modalOptionTextSelected]}>
                      {item.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={20} color="#2563eb" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

interface CountryModalProps {
  visible: boolean;
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export const CountryModal: React.FC<CountryModalProps> = ({
  visible,
  selectedCode,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={modalStyles.modalOverlay} onPress={onClose}>
        <Pressable style={modalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={modalStyles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="flag" size={22} color="#2563eb" />
              <Text style={modalStyles.modalTitle}>Select Country Code</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.modalCloseBtn}>
              <MaterialIcons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
            {COUNTRY_CODES.map((item) => {
              const isSelected = selectedCode === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[modalStyles.modalOption, isSelected && modalStyles.modalOptionSelected]}
                  onPress={() => {
                    onSelect(item.code);
                    onClose();
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>{item.flag}</Text>
                    <Text style={[modalStyles.modalOptionText, isSelected && modalStyles.modalOptionTextSelected]}>
                      {item.name} ({item.code})
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={20} color="#2563eb" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
