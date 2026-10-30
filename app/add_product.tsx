import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProductMutation } from '@/hooks/use-product-mutation';
import { fromCents } from '@/utils/money';
import {
  ProductFormInputs,
  styles,
} from '@/components/add-product';

export default function AddProductScreen() {
  const router = useRouter();
  const { id, scannedSku } = useLocalSearchParams<{ id?: string; scannedSku?: string }>();
  const { isSubmitting, fetchProduct, saveProduct, deleteProduct } = useProductMutation();

  const [name, setName] = useState('');
  const [sku, setSku] = useState(scannedSku || '');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('Grocery');
  const [unit, setUnit] = useState('pcs');
  const [taxRate, setTaxRate] = useState('8');

  useEffect(() => {
    if (id) {
      void fetchProduct(id).then((p) => {
        if (p) {
          setName(p.name);
          setSku(p.sku);
          setPrice(String(fromCents(p.priceCents)));
          setCostPrice(String(fromCents(p.costPriceCents)));
          setStock(String(p.stock));
          setCategory(p.category);
          setUnit(p.unit);
          setTaxRate(String(p.taxRate));
        }
      });
    }
  }, [id, fetchProduct]);

  const handleSave = async () => {
    if (!name.trim() || !sku.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Name, SKU, and Selling Price are required.');
      return;
    }

    const numericPrice = parseFloat(price);
    const numericStock = parseFloat(stock) || 0;
    const numericCostPrice = parseFloat(costPrice) || 0;
    const numericTaxRate = parseFloat(taxRate) || 0;

    if (isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Validation Error', 'Selling price must be a valid positive number.');
      return;
    }

    try {
      await saveProduct({
        id,
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        price: numericPrice,
        costPrice: numericCostPrice,
        stock: numericStock,
        category,
        unit: unit.trim() || 'pcs',
        taxRate: numericTaxRate,
      });

      Alert.alert('Success', `Product ${name} saved successfully.`);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save product in local database.');
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert('Delete Product', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#131b2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{id ? 'Edit Product' : 'New Product'}</Text>
        {id ? (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <MaterialIcons name="delete-outline" size={24} color="#ba1a1a" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProductFormInputs
          name={name}
          setName={setName}
          sku={sku}
          setSku={setSku}
          price={price}
          setPrice={setPrice}
          costPrice={costPrice}
          setCostPrice={setCostPrice}
          stock={stock}
          setStock={setStock}
          category={category}
          setCategory={setCategory}
          unit={unit}
          setUnit={setUnit}
          taxRate={taxRate}
          setTaxRate={setTaxRate}
        />

        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
          disabled={isSubmitting}
          onPress={handleSave}
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
