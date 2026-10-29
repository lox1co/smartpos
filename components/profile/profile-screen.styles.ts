import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  mainContainer: {
    paddingHorizontal: 16,
  },
  floatingToast: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  floatingToastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutBtnText: {
    color: '#ba1a1a',
    fontSize: 15,
    fontWeight: '700',
  },
  footerVersionText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 16,
    fontWeight: '500',
  },
});
