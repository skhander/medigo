import { colombiaProviders } from "./providers/colombia";
import { costaRicaProviders } from "./providers/costa-rica";
import { indiaProviders } from "./providers/india";
import { mexicoProviders } from "./providers/mexico";
import { southKoreaProviders } from "./providers/south-korea";
import { thailandProviders } from "./providers/thailand";
import { turkeyProviders } from "./providers/turkey";

export { POPULAR_PROCEDURES, PROCEDURE_CATEGORIES, FEATURED_PROCEDURES } from "./procedures";
export { COUNTRIES } from "./countries";

export const SEED_PROVIDERS = [
  ...mexicoProviders,
  ...thailandProviders,
  ...indiaProviders,
  ...turkeyProviders,
  ...costaRicaProviders,
  ...colombiaProviders,
  ...southKoreaProviders,
];
