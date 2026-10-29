import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,215,0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#131b2e',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,215,0.2)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef0fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#131b2e',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#eef0fa',
  },
  filterChipActive: {
    backgroundColor: '#004fe6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#434655',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.25)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  invoiceNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#131b2e',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#004fe6',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#737686',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  methodBadge: {
    backgroundColor: '#f0f3ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#004fe6',
  },
  syncBadge: {
    backgroundColor: '#fff3e0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  syncBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef6c00',
  },
  customerText: {
    fontSize: 12,
    color: '#434655',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#737686',
    marginTop: 8,
  },
});
