import { z } from 'zod';

export const languageCodeSchema = z.enum(['en-US', 'es-419']);

export type LanguageCode = z.infer<typeof languageCodeSchema>;
