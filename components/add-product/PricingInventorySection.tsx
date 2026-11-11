import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormField } from './FormField';
import { styles } from './add-product.styles';

const UNIT_OPTIONS: {
  label: string;
  value: string;
  type: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { label: 'Piece (pcs)', value: 'pcs', type: 'count', icon: 'check-box-outline-blank' },
  { label: 'Kilogram (kg)', value: 'kg', type: 'weight', icon: 'scale' },
  { label: 'Gram (g)', value: 'g', type: 'weight', icon: 'scale' },
  { label: 'Packet (pkt)', value: 'pack', type: 'count', icon: 'inventory' },
  { label: 'Box (box)', value: 'box', type: 'count', icon: 'all-inbox' },
  { label: 'Litre (L)', value: 'l', type: 'volume', icon: 'water-drop' },
  { label: 'MilliLitre (ml)', value: 'ml', type: 'volume', icon: 'opacity' },
];

interface PricingInventorySectionProps {
  unit: string;
  setUnit: (unit: string) => void;
  costPrice: string;
  setCostPrice: (val: string) => void;
  sellingPrice: string;
  setSellingPrice: (val: string) => void;
  taxRate: string;
  setTaxRate: (val: string) => void;
  stock: string;
  setStock: (val: string) => void;
  lowStock: string;
  setLowStock: (val: string) => void;
  currencySymbol: string;
}

export const PricingInventorySection = ({
  unit,
  setUnit,
  costPrice,
  setCostPrice,
  sellingPrice,
  setSellingPrice,
  taxRate,
  setTaxRate,
  stock,
  setStock,
  lowStock,
  setLowStock,
  currencySymbol,
}: PricingInventorySectionProps) => {
  const isWeightOrVolume = ['kg', 'g', 'l', 'ml'].includes(unit);

  return (
    <>
      <View style={styles.sectionCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.sectionHeader}>Pricing & Unit Type</Text>
          <View style={styles.unitTypeBadge}>
            <MaterialIcons
              name={isWeightOrVolume ? 'scale' : 'check-box-outline-blank'}
              size={14}
              color="#004ac6"
            />
            <Text style={styles.unitTypeBadgeText}>
              {isWeightOrVolume ? 'Sold by Weight / Volume' : 'Sold by Piece'}
            </Text>
          </View>
        </View>

        <Text style={styles.subLabel}>Select Measurement Unit *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.unitChipsContainer}
        >
          {UNIT_OPTIONS.map((opt) => {
            const isSelected = unit === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.unitChip, isSelected && styles.unitChipSelected]}
                onPress={() => setUnit(opt.value)}
              >
                <MaterialIcons
                  name={opt.icon}
                  size={16}
                  color={isSelected ? '#ffffff' : '#434655'}
                />
                <Text style={[styles.unitChipText, isSelected && styles.unitChipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[styles.rowInputs, { marginTop: 16 }]}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <FormField
              label={`Cost (${unit})`}
              value={costPrice}
              onChangeText={setCostPrice}
              placeholder={`Cost (${currencySymbol})`}
              keyboardType="decimal-pad"
              iconLeft={currencySymbol}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormField
              label={`Price (${unit}) *`}
              value={sellingPrice}
              onChangeText={setSellingPrice}
              placeholder={`Price (${currencySymbol})`}
              keyboardType="decimal-pad"
              iconLeft={currencySymbol}
            />
          </View>
        </View>

        <FormField
          label="GST / Tax Rate (%)"
          value={taxRate}
          onChangeText={setTaxRate}
          placeholder="Tax % (e.g. 8)"
          keyboardType="decimal-pad"
          iconRight="percent"
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Inventory</Text>
        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <FormField
              label={`Stock (${unit}) *`}
              value={stock}
              onChangeText={setStock}
              placeholder="Quantity"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormField
              label="Low Stock Alert"
              value={lowStock}
              onChangeText={setLowStock}
              placeholder="Alert qty"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>
    </>
  );
};
