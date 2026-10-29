import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,215,0.3)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131b2e',
  },
  deleteBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#434655',
  },
  input: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#c3c6d7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: '#131b2e',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  chipScroll: {
    marginTop: 4,
  },
  chipList: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f3ff',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#004fe6',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#434655',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  submitBtn: {
    backgroundColor: '#004fe6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
