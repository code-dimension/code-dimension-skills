export interface CatalogItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly creator: string;
  readonly types: readonly string[];
  readonly categories: readonly string[];
  readonly url: string;
}
