import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations';

export interface DatabaseMigrationState {
  success: boolean;
  error?: Error;
}

export const useDatabaseMigration = (): DatabaseMigrationState => {
  return useMigrations(db, migrations);
};
