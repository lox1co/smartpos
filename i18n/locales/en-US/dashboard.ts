export const dashboard = {
  header: {
    title: 'SmartPOS',
  },
  bento: {
    todaySales: "Today's Sales",
    vsYesterday: 'vs yesterday',
    orders: 'Orders',
    profit: 'Profit',
  },
  actions: {
    title: 'Quick Actions',
    newSale: 'New Sale',
    addProduct: 'Add Product',
    stockEntry: 'Stock Entry',
    history: 'History',
    credit: 'Khata / Credit',
    reports: 'Reports',
  },
  alerts: {
    title: 'Low Stock Alerts',
    itemsCount: '{{count}} Items',
    left: '{{count}} left',
    empty: 'No low stock alerts',
  },
  revenueTrend: {
    title: 'Revenue Trend',
  },
  transactions: {
    title: 'Recent Transactions',
    seeAll: 'See All',
    empty: 'No recent transactions',
    items: '{{count}} items',
  },
  days: {
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
  },
} as const;
