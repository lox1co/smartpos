import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#ba1a1a',
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
});
