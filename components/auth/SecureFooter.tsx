import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

export const SecureFooter = () => {
  const { t } = useTranslation('auth');

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" style={styles.icon}>
        <Path
          d="M 12 2 L 4 5 V 11 C 4 16.5 7.4 21.7 12 23 C 16.6 21.7 20 16.5 20 11 V 5 L 12 2 Z"
          stroke="#2563eb"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M 9 11 L 11 13 L 15 9" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <View>
        <Text style={styles.title}>{t('auth:login.secureTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth:login.secureSubtitle')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
});
