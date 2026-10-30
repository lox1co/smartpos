import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScannedItemRow, ScannedItemState } from './ScannedItemRow';
import { styles } from './scanner.styles';

interface ScannedListDrawerProps {
  scannedItems: ScannedItemState[];
  bottomInset: number;
  currencySymbol: string;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onOpenManualEntry: () => void;
  onDone: () => void;
}

export const ScannedListDrawer = ({
  scannedItems,
  bottomInset,
  currencySymbol,
  onIncrement,
  onDecrement,
  onOpenManualEntry,
  onDone,
}: ScannedListDrawerProps) => {
  const totalItems = scannedItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <View style={[styles.drawerCard, { paddingBottom: bottomInset + 16 }]}>
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      <View style={styles.drawerContent}>
        <Text style={styles.drawerTitle}>Recently Scanned</Text>

        <ScrollView style={styles.scannedList} showsVerticalScrollIndicator={false}>
          {scannedItems.map((item) => (
            <ScannedItemRow
              key={item.product.id}
              item={item}
              currencySymbol={currencySymbol}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))}

          {scannedItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="qr-code-scanner" size={44} color="#c3c6d7" />
              <Text style={styles.emptyText}>
                Align barcode inside the target viewfinder frame
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onOpenManualEntry}
            activeOpacity={0.7}
          >
            <MaterialIcons name="keyboard" size={20} color="#131b2e" />
            <Text style={styles.secondaryBtnText}>Manual Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.primaryBtn, totalItems === 0 && { opacity: 0.8 }]}
            onPress={onDone}
          >
            <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            <Text style={styles.primaryBtnText}>
              {totalItems > 0 ? `Add to Cart (${totalItems})` : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
