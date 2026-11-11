import { create } from 'zustand';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOutboxCount: number;
  lastSyncTimestamp: number | null;
  lastSyncError: string | null;
  setIsOnline: (isOnline: boolean) => void;
  setIsSyncing: (isSyncing: boolean) => void;
  setPendingOutboxCount: (count: number) => void;
  setLastSyncTimestamp: (timestamp: number) => void;
  setLastSyncError: (error: string | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: true,
  isSyncing: false,
  pendingOutboxCount: 0,
  lastSyncTimestamp: null,
  lastSyncError: null,

  setIsOnline: (isOnline) => set({ isOnline }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  setPendingOutboxCount: (pendingOutboxCount) => set({ pendingOutboxCount }),
  setLastSyncTimestamp: (lastSyncTimestamp) => set({ lastSyncTimestamp, lastSyncError: null }),
  setLastSyncError: (lastSyncError) => set({ lastSyncError }),
}));
