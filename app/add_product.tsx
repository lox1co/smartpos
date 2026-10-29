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
import { useSessionStore } from '@/stores/session-store';
import {
  getProductById,
  upsertProducts,
  deleteProductById,
} from '@/db/repositories/product-repository';
import { toCents, fromCents } from '@/utils/money';
import {
  ProductFormInputs,
  styles,
} from '@/components/add-product';

export default function AddProductScreen() {
  const router = useRouter();
  const { id, scannedSku } = useLocalSearchParams<{ id?: string; scannedSku?: string }>();
  const storeId = useSessionStore((state) => state.currentUser?.storeId ?? 'DEMO-1001');

  const [name, setName] = useState('');
  const [sku, setSku] = useState(scannedSku || '');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('Grocery');
  const [unit, setUnit] = useState('pcs');
  const [taxRate, setTaxRate] = useState('8');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      void getProductById(id).then((p) => {
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
  }, [id]);

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

    setIsSubmitting(true);
    try {
      const now = Date.now();
      const productId = id || `prod-${now}-${Math.floor(1000 + Math.random() * 9000)}`;

      await upsertProducts([
        {
          id: productId,
          storeId,
          sku: sku.trim().toUpperCase(),
          name: name.trim(),
          priceCents: toCents(numericPrice),
          costPriceCents: toCents(numericCostPrice),
          stock: numericStock,
          lowStockAlert: 5,
          category,
          unit: unit.trim() || 'pcs',
          taxRate: numericTaxRate,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ]);

      Alert.alert('Success', `Product ${name} saved successfully.`);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save product in local database.');
    } finally {
      setIsSubmitting(false);
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
          await deleteProductById(id);
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
