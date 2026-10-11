import { CatalogItem } from './catalog-item.model';
import catalogData from './catalog.data.json';

export interface CatalogFaq {
  readonly question: string;
  readonly answer: string;
}

/**
 * Edit catalog.data.json to update the site. The same data drives the Angular
 * UI and the SEO/AEO artifacts generated before every build.
 */
export const CATALOG_ITEMS: readonly CatalogItem[] = catalogData.items;
export const FAQS: readonly CatalogFaq[] = catalogData.faqs;
