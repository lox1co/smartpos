import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from '@/constants/config';
import { styles } from './add-product.styles';

interface ProductFormInputsProps {
  name: string;
  setName: (v: string) => void;
  sku: string;
  setSku: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  costPrice: string;
  setCostPrice: (v: string) => void;
  stock: string;
  setStock: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
  taxRate: string;
  setTaxRate: (v: string) => void;
}

export const ProductFormInputs = ({
  name,
  setName,
  sku,
  setSku,
  price,
  setPrice,
  costPrice,
  setCostPrice,
  stock,
  setStock,
  category,
  setCategory,
  unit,
  setUnit,
  taxRate,
  setTaxRate,
}: ProductFormInputsProps) => {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Organic Almond Milk"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, styles.halfInput]}>
          <Text style={styles.label}>SKU / Barcode *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. MILK-001"
            value={sku}
            onChangeText={setSku}
            autoCapitalize="characters"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfInput]}>
          <Text style={styles.label}>Tax Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="8"
            keyboardType="numeric"
            value={taxRate}
            onChangeText={setTaxRate}
          />
        </View>
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, styles.halfInput]}>
          <Text style={styles.label}>Selling Price *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfInput]}>
          <Text style={styles.label}>Cost Price</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={costPrice}
            onChangeText={setCostPrice}
          />
        </View>
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, styles.halfInput]}>
          <Text style={styles.label}>Stock Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfInput]}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={styles.input}
            placeholder="pcs"
            value={unit}
            onChangeText={setUnit}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quick Units</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {PRODUCT_UNITS.map((u) => {
            const active = unit === u;
            return (
              <TouchableOpacity
                key={u}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setUnit(u)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{u}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};
