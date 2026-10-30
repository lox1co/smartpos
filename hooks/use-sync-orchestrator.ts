import { useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { useSyncStore } from '@/stores/sync-store';
import { syncCatalogFromServer, startSyncWorker, stopSyncWorker } from '@/services/sync';
import { initializeNetworkListener, stopNetworkListener } from '@/services/network-service';

export const useSyncOrchestrator = (isDbReady: boolean) => {
  const currentUser = useSessionStore((state) => state.currentUser);
  const isOnline = useSyncStore((state) => state.isOnline);
  const isSyncing = useSyncStore((state) => state.isSyncing);
  const pendingCount = useSyncStore((state) => state.pendingOutboxCount);

  useEffect(() => {
    initializeNetworkListener();
    return () => {
      stopNetworkListener();
    };
  }, []);

  useEffect(() => {
    if (!isDbReady) return;

    const token = currentUser?.token;
    const storeId = currentUser?.storeId;

    if (token && storeId) {
      startSyncWorker(storeId, token);
      void syncCatalogFromServer(token, storeId).catch(() => {});
    } else {
      stopSyncWorker();
    }

    return () => {
      stopSyncWorker();
    };
  }, [isDbReady, currentUser?.token, currentUser?.storeId]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
  };
};
