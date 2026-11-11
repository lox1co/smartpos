import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    height: 48,
    backgroundColor: '#f5f8ff',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0f172a',
  },
});
