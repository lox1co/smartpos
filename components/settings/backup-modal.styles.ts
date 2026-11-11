import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    marginBottom: 10,
    gap: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004ac6',
  },
  restoreBtn: {
    backgroundColor: '#ccfbf1',
  },
  restoreText: {
    color: '#0d9488',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
});
