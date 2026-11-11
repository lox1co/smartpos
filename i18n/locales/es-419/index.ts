import type { LocaleShape } from '@/i18n/types';
import { common } from './common';
import { auth } from './auth';
import { profile } from './profile';
import { settings } from './settings';
import { dashboard } from './dashboard';
import { products } from './products';
import { inventory } from './inventory';
import { billing } from './billing';
import { transactions } from './transactions';
import { customers } from './customers';
import { reports } from './reports';
import { signup } from './signup';
import { shop } from './shop';
import { support } from './support';

export const es419: LocaleShape = {
  common,
  auth,
  profile,
  settings,
  dashboard,
  products,
  inventory,
  billing,
  transactions,
  customers,
  reports,
  signup,
  shop,
  support,
};
