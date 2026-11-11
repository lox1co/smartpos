import { randomUUID } from 'expo-crypto';

export const generateUuid = (): string => {
  return randomUUID();
};
