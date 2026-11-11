import { expoDb } from '../client';

export interface DatabaseStats {
  pageSize: number;
  pageCount: number;
  freelistCount: number;
  totalSizeBytes: number;
}

export const getDatabaseStats = async (): Promise<DatabaseStats> => {
  const pageSizeRow = await expoDb.getFirstAsync<{ page_size: number }>('PRAGMA page_size;');
  const pageCountRow = await expoDb.getFirstAsync<{ page_count: number }>('PRAGMA page_count;');
  const freelistRow = await expoDb.getFirstAsync<{ freelist_count: number }>('PRAGMA freelist_count;');

  const pageSize = pageSizeRow?.page_size ?? 4096;
  const pageCount = pageCountRow?.page_count ?? 0;
  const freelistCount = freelistRow?.freelist_count ?? 0;
  const totalSizeBytes = pageSize * pageCount;

  return {
    pageSize,
    pageCount,
    freelistCount,
    totalSizeBytes,
  };
};

export const runDatabaseOptimization = async (): Promise<void> => {
  await expoDb.execAsync('PRAGMA optimize;');
  await expoDb.execAsync('PRAGMA incremental_vacuum(50);');
};
