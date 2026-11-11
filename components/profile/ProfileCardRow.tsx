import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfileCardRowProps {
  readonly iconName: keyof typeof MaterialIcons.glyphMap;
  readonly iconColor: string;
  readonly iconBgColor: string;
  readonly label: string;
  readonly subLabel: string;
  readonly onPress?: () => void;
  readonly rightElement?: React.ReactNode;
  readonly isLast?: boolean;
}

export const ProfileCardRow = ({
  iconName,
  iconColor,
  iconBgColor,
  label,
  subLabel,
  onPress,
  rightElement,
  isLast,
}: ProfileCardRowProps) => (
  <TouchableOpacity
    style={[styles.cardRow, isLast && styles.lastCardRow]}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={styles.rowLeft}>
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.rowTextCol}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSubLabel} numberOfLines={1}>
          {subLabel}
        </Text>
      </View>
    </View>
    {rightElement ?? <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastCardRow: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextCol: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  rowSubLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
