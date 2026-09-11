import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Skill } from './skill.model';
import { FAQS, SKILLS } from './skills.data';

type CopyState = Readonly<{
  skillId: string;
  skillName: string;
  status: 'success' | 'error';
}>;

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
  private readonly document = inject(DOCUMENT);

  protected readonly skills = SKILLS;
  protected readonly faqs = FAQS;
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal(ALL_FILTER_VALUE);
  protected readonly selectedCreator = signal(ALL_FILTER_VALUE);
  protected readonly copyState = signal<CopyState | null>(null);

  protected readonly categories = uniqueSorted(
    this.skills.map((skill) => skill.category)
  );
  protected readonly creators = uniqueSorted(
    this.skills.map((skill) => skill.creator)
  );

  protected readonly filteredSkills = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('en');
    const category = this.selectedCategory();
    const creator = this.selectedCreator();

    return this.skills.filter(
      (skill) =>
        (!query || skill.name.toLocaleLowerCase('en').includes(query)) &&
        (category === ALL_FILTER_VALUE || skill.category === category) &&
        (creator === ALL_FILTER_VALUE || skill.creator === creator)
    );
  });

  protected readonly copyAnnouncement = computed(() => {
    const state = this.copyState();

    if (!state) {
      return '';
    }

    return state.status === 'success'
      ? `${state.skillName} installation command copied to clipboard.`
      : `Could not copy the ${state.skillName} installation command.`;
  });

  protected updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected updateCategory(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  protected updateCreator(event: Event): void {
    this.selectedCreator.set((event.target as HTMLSelectElement).value);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(ALL_FILTER_VALUE);
    this.selectedCreator.set(ALL_FILTER_VALUE);
  }

  protected async copyCommand(skill: Skill): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;

    if (!clipboard) {
      this.copyState.set({
        skillId: skill.id,
        skillName: skill.name,
        status: 'error',
      });
      return;
    }

    try {
      await clipboard.writeText(skill.installCommand);
      this.copyState.set({
        skillId: skill.id,
        skillName: skill.name,
        status: 'success',
      });
    } catch {
      this.copyState.set({
        skillId: skill.id,
        skillName: skill.name,
        status: 'error',
      });
    }
  }
}
