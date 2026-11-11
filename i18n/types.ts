import 'react-i18next';
import { enUS } from './locales/en-US';

export type DeepStringMap<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepStringMap<T[K]> : string;
};

export type LocaleShape = DeepStringMap<typeof enUS>;

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof enUS;
  }
}
