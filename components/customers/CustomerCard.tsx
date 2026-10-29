import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomerSelect } from '@/db/schema/customers';
import { formatCents } from '@/utils/money';
import { styles } from './customers.styles';

interface CustomerCardProps {
  customer: CustomerSelect;
  currencySymbol: string;
  onPress: (customer: CustomerSelect) => void;
}

export const CustomerCard = memo(function CustomerCard({
  customer,
  currencySymbol,
  onPress,
}: CustomerCardProps) {
  const owesMoney = customer.creditBalanceCents > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(customer)}
    >
      <View style={styles.avatar}>
        <MaterialIcons name="person" size={24} color="#004fe6" />
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{customer.name}</Text>
        {customer.phone && <Text style={styles.cardPhone}>{customer.phone}</Text>}
      </View>

      <View style={styles.cardRight}>
        <Text
          style={[
            styles.balanceAmount,
            owesMoney ? styles.balanceOwed : styles.balanceSettled,
          ]}
        >
          {formatCents(customer.creditBalanceCents, currencySymbol)}
        </Text>
        <Text style={styles.balanceLabel}>
          {owesMoney ? 'Outstanding' : 'Settled'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
