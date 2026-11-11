import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const expoDb = openDatabaseSync('smartpos.db');

expoDb.execSync('PRAGMA journal_mode = WAL;');
expoDb.execSync('PRAGMA synchronous = NORMAL;');

export const db = drizzle(expoDb, { schema });

export type Database = typeof db;
