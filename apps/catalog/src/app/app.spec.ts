import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { FAQS, SKILLS } from './skills.data';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('renders every skill from the catalog data', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('article');
    expect(cards).toHaveLength(SKILLS.length);
    expect(fixture.nativeElement.textContent).toContain('Angular Architecture');
    expect(fixture.nativeElement.textContent).toContain('daisyUI v5');
  });

  it('renders indexable educational and FAQ content', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const headings = [...fixture.nativeElement.querySelectorAll('h1, h2')].map(
      (heading: HTMLElement) => heading.textContent?.replace(/\s+/g, ' ').trim()
    );
    const questions = fixture.nativeElement.querySelectorAll('details');

    expect(headings).toContain('Trusted agent skills for better software.');
    expect(headings).toContain('What are agent skills?');
    expect(headings).toContain('How to install an agent skill');
    expect(headings).toContain('Common questions about agent skills');
    expect(questions).toHaveLength(FAQS.length);

    for (const faq of FAQS) {
      expect(fixture.nativeElement.textContent).toContain(faq.question);
      expect(fixture.nativeElement.textContent).toContain(faq.answer);
    }
  });

  it('searches skills by name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const search = fixture.nativeElement.querySelector(
      '#skill-search'
    ) as HTMLInputElement;
    search.value = 'daisy';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('article');
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('daisyUI v5');
  });

  it('combines category and creator filters', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const category = fixture.nativeElement.querySelector(
      '#category-filter'
    ) as HTMLSelectElement;
    const creator = fixture.nativeElement.querySelector(
      '#creator-filter'
    ) as HTMLSelectElement;

    category.value = 'Development';
    category.dispatchEvent(new Event('change'));
    creator.value = 'Angular';
    creator.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('article');
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('Angular Developer');
  });

  it('shows an empty state and clears active filters', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const search = fixture.nativeElement.querySelector(
      '#skill-search'
    ) as HTMLInputElement;
    search.value = 'missing skill';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('No skills found');

    const clearButton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button: HTMLButtonElement) => button.textContent?.includes('Clear filters')
    ) as HTMLButtonElement;
    clearButton.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(
      SKILLS.length
    );
    expect(search.value).toBe('');
  });

  it('copies an installation command to the clipboard', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const copyButton = fixture.nativeElement.querySelector(
      'button[aria-label="Copy installation command for Angular Architecture"]'
    ) as HTMLButtonElement;
    copyButton.click();
    await Promise.resolve();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith(SKILLS[0].installCommand);
    expect(copyButton.textContent).toContain('Copied');
  });
});
