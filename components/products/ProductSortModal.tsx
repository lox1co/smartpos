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

interface SortOption {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: 'name_asc', label: 'Name (A to Z)', icon: 'sort-by-alpha' },
  { id: 'name_desc', label: 'Name (Z to A)', icon: 'sort-by-alpha' },
  { id: 'price_asc', label: 'Price (Low to High)', icon: 'trending-up' },
  { id: 'price_desc', label: 'Price (High to Low)', icon: 'trending-down' },
  { id: 'stock_asc', label: 'Stock (Low to High)', icon: 'inventory-2' },
  { id: 'stock_desc', label: 'Stock (High to Low)', icon: 'inventory' },
];

interface ProductSortModalProps {
  visible: boolean;
  selectedSort: string;
  onSelect: (sortId: string) => void;
  onClose: () => void;
}

export const ProductSortModal = ({
  visible,
  selectedSort,
  onSelect,
  onClose,
}: ProductSortModalProps) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={sortStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={sortStyles.container}>
              <Text style={sortStyles.title}>Sort Catalog</Text>
              <View style={sortStyles.optionsList}>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = selectedSort === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[sortStyles.optionRow, isSelected && sortStyles.optionSelected]}
                      onPress={() => {
                        onSelect(opt.id);
                        onClose();
                      }}
                    >
                      <MaterialIcons
                        name={opt.icon}
                        size={22}
                        color={isSelected ? '#004fe6' : '#737686'}
                      />
                      <Text style={[sortStyles.optionText, isSelected && sortStyles.optionTextSelected]}>
                        {opt.label}
                      </Text>
                      {isSelected && (
                        <MaterialIcons name="check" size={20} color="#004fe6" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const sortStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
    marginBottom: 16,
  },
  optionsList: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 12,
  },
  optionSelected: {
    backgroundColor: '#f0f5ff',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#434655',
  },
  optionTextSelected: {
    color: '#004fe6',
  },
});
