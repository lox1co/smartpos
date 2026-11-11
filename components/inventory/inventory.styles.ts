import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
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
  metricsBanner: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,215,0.2)',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef0fa',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737686',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#131b2e',
    marginTop: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.25)',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#131b2e',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  cardSku: {
    fontSize: 12,
    color: '#737686',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#e8f5e9',
  },
  stockBadgeLow: {
    backgroundColor: '#fff3e0',
  },
  stockBadgeOut: {
    backgroundColor: '#ffebee',
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2e7d32',
  },
  stockBadgeTextLow: {
    color: '#ef6c00',
  },
  stockBadgeTextOut: {
    color: '#c62828',
  },
  restockBtn: {
    backgroundColor: '#004fe6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restockBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
