import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PRODUCT_CATEGORIES } from '@/constants/config';
import { FormField } from './FormField';
import { styles } from './add-product.styles';

interface BasicInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  sku: string;
  setSku: (sku: string) => void;
  category: string;
  setCategory: (category: string) => void;
  onScanPress: () => void;
}

export const BasicInfoSection = ({
  name,
  setName,
  sku,
  setSku,
  category,
  setCategory,
  onScanPress,
}: BasicInfoSectionProps) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionHeader}>Basic Info</Text>

      <FormField
        label="Product Name *"
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
      />

      <FormField
        label="SKU / Barcode *"
        value={sku}
        onChangeText={setSku}
        placeholder="Enter or scan SKU"
        iconRight="qr-code-scanner"
        onIconRightPress={onScanPress}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Category *</Text>
        <TouchableOpacity
          style={[styles.inputWrapper, styles.selectTrigger]}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          activeOpacity={0.8}
        >
          <Text style={[styles.selectText, !category && { color: '#94a3b8' }]} numberOfLines={1}>
            {category || 'Select category'}
          </Text>
          <MaterialIcons
            name={showCategoryDropdown ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={22}
            color="#64748b"
          />
        </TouchableOpacity>
      </View>

      {showCategoryDropdown && (
        <View style={styles.categoryDropdown}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryOption}
              onPress={() => {
                setCategory(cat);
                setShowCategoryDropdown(false);
              }}
            >
              <Text style={styles.categoryOptionText}>{cat}</Text>
              {category === cat && (
                <MaterialIcons name="check" size={18} color="#004ac6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
