import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TransactionSelect } from '@/db/schema/transactions';
import { formatCents } from '@/utils/money';
import { styles } from './transactions.styles';

interface TransactionCardProps {
  transaction: TransactionSelect;
  currencySymbol: string;
  onPress: (transaction: TransactionSelect) => void;
}

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

export const TransactionCard = memo(function TransactionCard({
  transaction,
  currencySymbol,
  onPress,
}: TransactionCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(transaction)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.invoiceNumber}>{transaction.invoiceNumber}</Text>
        <Text style={styles.amount}>
          {formatCents(transaction.totalCents, currencySymbol)}
        </Text>
      </View>

      <View style={styles.cardMeta}>
        <Text style={styles.dateText}>{formatDate(transaction.createdAt)}</Text>
        <View style={styles.badgeRow}>
          {transaction.isPendingSync && (
            <View style={styles.syncBadge}>
              <Text style={styles.syncBadgeText}>Offline</Text>
            </View>
          )}
          <View style={styles.methodBadge}>
            <Text style={styles.methodBadgeText}>{transaction.paymentMethod}</Text>
          </View>
        </View>
      </View>

      {transaction.customerName && (
        <Text style={styles.customerText}>Customer: {transaction.customerName}</Text>
      )}
    </TouchableOpacity>
  );
});
