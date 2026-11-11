import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/session-store';
import { useProductMutation } from '@/hooks/use-product-mutation';
import { fromCents } from '@/utils/money';
import {
  ProductImageSection,
  BasicInfoSection,
  PricingInventorySection,
  styles,
} from '@/components/add-product';

export default function AddProductScreen() {
  const router = useRouter();
  const { t } = useTranslation(['common', 'products']);
  const { id, scannedSku } = useLocalSearchParams<{ id?: string; scannedSku?: string }>();
  const isEdit = Boolean(id);
  const insets = useSafeAreaInsets();
  const currencySymbol = useSessionStore((state) => state.currentUser?.currencySymbol ?? '$');

  const { isSubmitting, fetchProduct, checkSkuAvailable, saveProduct, deleteProduct } =
    useProductMutation();

  const [name, setName] = useState('');
  const [sku, setSku] = useState(scannedSku || '');
  const [category, setCategory] = useState('Grocery');
  const [unit, setUnit] = useState('pcs');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [taxRate, setTaxRate] = useState('8');
  const [stock, setStock] = useState('');
  const [lowStock, setLowStock] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const isWeightOrVolume = ['kg', 'g', 'l', 'ml'].includes(unit);

  useEffect(() => {
    if (isEdit && id) {
      void fetchProduct(id).then((p) => {
        if (p) {
          setName(p.name);
          setSku(p.sku);
          setCategory(p.category);
          setUnit(p.unit || 'pcs');
          setCostPrice(String(fromCents(p.costPriceCents)));
          setSellingPrice(String(fromCents(p.priceCents)));
          setTaxRate(String(p.taxRate));
          setStock(String(p.stock));
          setLowStock(String(p.lowStockAlert));
          setImageUrl(p.image || '');
        }
      });
    }
  }, [isEdit, id, fetchProduct]);

  const handleSaveProduct = async () => {
    setError('');

    if (!name.trim() || !sku.trim() || !category || !sellingPrice.trim() || !stock.trim()) {
      setError(t('products:add.requiredFields'));
      return;
    }

    const priceNum = parseFloat(sellingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError(t('products:add.invalidPrice', { symbol: currencySymbol }));
      return;
    }

    const costNum = costPrice.trim() ? parseFloat(costPrice) : 0;
    if (isNaN(costNum) || costNum < 0) {
      setError(t('products:add.invalidCost'));
      return;
    }

    const stockNum = parseFloat(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setError(t('products:add.invalidStock'));
      return;
    }

    const lowStockNum = lowStock.trim() ? parseFloat(lowStock) : (isWeightOrVolume ? 2.0 : 5);
    if (isNaN(lowStockNum) || lowStockNum < 0) {
      setError(t('products:add.invalidLowStock'));
      return;
    }

    const taxRateNum = taxRate.trim() ? parseFloat(taxRate) : 8;
    if (isNaN(taxRateNum) || taxRateNum < 0 || taxRateNum > 100) {
      setError(t('products:add.invalidTaxRate'));
      return;
    }

    const isAvailable = await checkSkuAvailable(sku.trim(), id);
    if (!isAvailable) {
      setError(t('products:add.skuExists'));
      return;
    }

    try {
      await saveProduct({
        id,
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category,
        unit,
        price: priceNum,
        costPrice: costNum,
        taxRate: taxRateNum,
        stock: stockNum,
        lowStockAlert: lowStockNum,
        image: imageUrl.trim() || null,
      });

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/products');
      }
    } catch {
      setError(t('products:add.saveFailed'));
    }
  };

  const performDelete = async () => {
    if (!id) return;
    try {
      await deleteProduct(id);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/products');
      }
    } catch {
      setError(t('products:add.deleteFailed'));
    }
  };

  const handleDeleteProduct = () => {
    if (!isEdit || !id) return;

    if (Platform.OS === 'web') {
      if (window.confirm(t('products:add.confirmDeleteMessage', { name }))) {
        void performDelete();
      }
    } else {
      Alert.alert(
        t('products:add.confirmDeleteTitle'),
        t('products:add.confirmDeleteMessage', { name }),
        [
          { text: t('common:actions.cancel'), style: 'cancel' },
          { text: t('common:actions.delete'), style: 'destructive', onPress: () => void performDelete() },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#004ac6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? t('products:add.titleEdit') : t('products:add.titleAdd')}
        </Text>
        {isEdit ? (
          <TouchableOpacity style={styles.headerIconButton} onPress={handleDeleteProduct}>
            <MaterialIcons name="delete" size={24} color="#ba1a1a" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color="#ba1a1a" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <ProductImageSection
            imageUrl={imageUrl}
            onChangeImageUrl={setImageUrl}
          />

          <BasicInfoSection
            name={name}
            setName={setName}
            sku={sku}
            setSku={setSku}
            category={category}
            setCategory={setCategory}
            onScanPress={() => router.push({ pathname: '/scanner', params: { mode: 'add_product' } })}
          />

          <PricingInventorySection
            unit={unit}
            setUnit={setUnit}
            costPrice={costPrice}
            setCostPrice={setCostPrice}
            sellingPrice={sellingPrice}
            setSellingPrice={setSellingPrice}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            stock={stock}
            setStock={setStock}
            lowStock={lowStock}
            setLowStock={setLowStock}
            currencySymbol={currencySymbol}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {isEdit && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#ba1a1a', flex: 1 }]}
              onPress={handleDeleteProduct}
            >
              <MaterialIcons name="delete" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>{t('common:actions.delete')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveButton, { flex: isEdit ? 2 : 1 }, isSubmitting && { opacity: 0.7 }]}
            onPress={() => void handleSaveProduct()}
            disabled={isSubmitting}
          >
            <MaterialIcons name="save" size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? t('products:add.saving') : isEdit ? t('products:add.saveChanges') : t('products:add.save')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
