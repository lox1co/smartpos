import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { TerminalIllustration } from './TerminalIllustration';

interface LoginHeaderProps {
  readonly isKeyboardVisible: boolean;
}

export const LoginHeader = ({ isKeyboardVisible }: LoginHeaderProps) => (
  <View style={styles.headerRow}>
    <View style={styles.logoAndTag}>
      <View style={styles.logoRow}>
        <Svg width={32} height={32} viewBox="0 0 28 28" style={styles.logoSvg}>
          <Path
            d="M 3 6 H 7.5 L 9.8 17.5 H 21.5 L 23.5 9 H 8.5"
            stroke="#2563eb"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Circle cx={11.5} cy={22.5} r={2.2} fill="#2563eb" />
          <Circle cx={19.5} cy={22.5} r={2.2} fill="#2563eb" />
        </Svg>
        <Text style={styles.logoText}>
          Smart<Text style={styles.logoBold}>POS</Text>
        </Text>
      </View>
      <Text style={styles.tagline}>Simple • Fast • Smart</Text>
    </View>
    {!isKeyboardVisible && <TerminalIllustration />}
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 420,
    marginTop: 10,
    marginBottom: 15,
  },
  logoAndTag: {
    flex: 1,
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSvg: {
    marginRight: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: -0.5,
  },
  logoBold: {
    color: '#1e293b',
    fontWeight: '800',
  },
  tagline: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
