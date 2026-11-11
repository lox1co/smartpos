import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import { useSyncStore } from '@/stores/sync-store';
import { triggerSync } from './sync/sync-worker';

let subscription: NetInfoSubscription | null = null;

export const initializeNetworkListener = (): void => {
  if (subscription) return;

  subscription = NetInfo.addEventListener((state: NetInfoState) => {
    const isConnected = Boolean(state.isConnected && state.isInternetReachable !== false);
    const wasOnline = useSyncStore.getState().isOnline;

    useSyncStore.getState().setIsOnline(isConnected);

    if (isConnected && !wasOnline) {
      triggerSync();
    }
  });
};

export const stopNetworkListener = (): void => {
  if (subscription) {
    subscription();
    subscription = null;
  }
};
