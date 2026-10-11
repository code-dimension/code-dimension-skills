import { Component, computed, signal } from '@angular/core';
import { FAQS, CATALOG_ITEMS } from './catalog.data';

const ALL_FILTER_VALUE = 'all';

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((first, second) =>
    first.localeCompare(second, 'en')
  );
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly items = CATALOG_ITEMS;
  protected readonly faqs = FAQS;
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal(ALL_FILTER_VALUE);
  protected readonly selectedCreator = signal(ALL_FILTER_VALUE);
  protected readonly selectedType = signal(ALL_FILTER_VALUE);

  protected readonly categories = uniqueSorted(
    this.items.flatMap((item) => item.categories)
  );
  protected readonly types = uniqueSorted(
    this.items.flatMap((item) => item.types)
  );
  protected readonly creators = uniqueSorted(
    this.items.map((item) => item.creator)
  );

  protected readonly filteredItems = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('en');
    const category = this.selectedCategory();
    const creator = this.selectedCreator();
    const type = this.selectedType();

    return this.items.filter(
      (item) =>
        (!query ||
          [item.name, item.description, item.creator, ...item.categories].some(
            (value) => value.toLocaleLowerCase('en').includes(query)
          )) &&
        (category === ALL_FILTER_VALUE || item.categories.includes(category)) &&
        (type === ALL_FILTER_VALUE || item.types.includes(type)) &&
        (creator === ALL_FILTER_VALUE || item.creator === creator)
    );
  });

  protected updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected updateCategory(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  protected updateType(event: Event): void {
    this.selectedType.set((event.target as HTMLSelectElement).value);
  }

  protected updateCreator(event: Event): void {
    this.selectedCreator.set((event.target as HTMLSelectElement).value);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(ALL_FILTER_VALUE);
    this.selectedCreator.set(ALL_FILTER_VALUE);
    this.selectedType.set(ALL_FILTER_VALUE);
  }
}
