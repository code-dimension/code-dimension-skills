import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { CATALOG_ITEMS, FAQS } from './catalog.data';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    root = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function setControl(id: string, value: string) {
    const control = root.querySelector<HTMLInputElement | HTMLSelectElement>(
      `#${id}`
    )!;
    control.value = value;
    control.dispatchEvent(
      new Event(id === 'skill-search' ? 'input' : 'change')
    );
    await fixture.whenStable();
  }

  function cardIds() {
    return [...root.querySelectorAll('article')].map((card) =>
      card.id.replace('skill-', '')
    );
  }

  it('renders 23 unique recommendations in editorial order', () => {
    expect(CATALOG_ITEMS).toHaveLength(23);
    expect(cardIds()).toEqual(CATALOG_ITEMS.map((item) => item.id));
    expect(new Set(cardIds()).size).toBe(23);
    expect(root.textContent?.replace(/\s+/g, ' ')).toContain('of 23 tools');
  });

  it('renders source links, accessible new-tab notices, creators and every badge', () => {
    for (const item of CATALOG_ITEMS) {
      const card = root.querySelector(`#skill-${item.id}`)!;
      const link = card.querySelector<HTMLAnchorElement>('a')!;
      expect(link.href).toBe(item.url);
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.getAttribute('aria-label')).toBe(
        `Visit tool: ${item.name} (opens in a new tab)`
      );
      expect(link.tabIndex).toBe(0);
      expect(card.querySelector('dd')?.textContent).toBe(item.creator);
      for (const badge of [...item.categories, ...item.types]) {
        expect(card.textContent).toContain(badge);
      }
    }
    expect(root.querySelector('code')).toBeNull();
    expect(root.textContent).not.toMatch(/Copy command|npx skills add/);
  });

  it('keeps native, labeled keyboard controls and existing anchors', () => {
    for (const id of [
      'skill-search',
      'category-filter',
      'type-filter',
      'creator-filter',
    ]) {
      const control = root.querySelector<HTMLElement>(`#${id}`)!;
      expect(control.tabIndex).toBe(0);
      expect(
        root
          .querySelector(`#${control.getAttribute('aria-labelledby')}`)
          ?.textContent?.trim()
      ).toBeTruthy();
    }
    for (const id of [
      'top',
      'skills',
      'faq',
      'agent-skills-title',
      'install-title',
    ]) {
      expect(root.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(root.querySelector('a[href="/skills.md"]')).not.toBeNull();
  });

  it('renders educational content and the canonical FAQs', () => {
    expect(root.textContent).toContain('Skills, CLIs, and MCP tools');
    expect(root.textContent).toContain('How to get started');
    expect(root.querySelectorAll('details')).toHaveLength(FAQS.length);
    for (const faq of FAQS) {
      expect(root.textContent).toContain(faq.question);
      expect(root.textContent).toContain(faq.answer);
    }
  });

  it.each([
    ['  aNgUlAr  ', ['angular-developer']],
    ['reusable project documentation', ['save-research']],
    ['Spec-Driven Development', ['save-research', 'openspec']],
    [
      'Code Dimension',
      [
        'save-research',
        'pragmatic-git-context',
        'subagent-delegation',
        'hotmart-api',
        'cloudflare-stream',
      ],
    ],
  ])(
    'searches names, descriptions, categories and creators: %s',
    async (query, expected) => {
      await setControl('skill-search', query);
      expect(cardIds()).toEqual(expected);
    }
  );

  it.each([
    [
      'category-filter',
      'Design & UI',
      [
        'daisyui',
        'tailwind-patterns',
        'frontend-design',
        'design-md',
        'stitch-mcp',
      ],
    ],
    [
      'category-filter',
      'Token Optimization',
      ['subagent-delegation', 'rtk', 'headroom', 'context7'],
    ],
    [
      'type-filter',
      'MCP',
      ['headroom', 'context7', 'stitch-mcp', 'chrome-devtools-mcp'],
    ],
    ['type-filter', 'CLI', ['rtk', 'headroom', 'context7', 'openspec']],
    [
      'creator-filter',
      'Code Dimension',
      [
        'save-research',
        'pragmatic-git-context',
        'subagent-delegation',
        'hotmart-api',
        'cloudflare-stream',
      ],
    ],
  ])('filters %s by %s without duplicates', async (id, value, expected) => {
    await setControl(id, value);
    expect(cardIds()).toEqual(expected);
    expect(
      root.querySelector('[role="status"] strong')?.textContent?.trim()
    ).toBe(String(expected.length));
  });

  it('finds the new MCPs by objective and creator', async () => {
    await setControl('type-filter', 'MCP');
    await setControl('category-filter', 'Design & UI');
    await setControl('creator-filter', 'Google Labs');
    expect(cardIds()).toEqual(['stitch-mcp']);
    await setControl('category-filter', 'Code Quality & Review');
    await setControl('creator-filter', 'Google');
    expect(cardIds()).toEqual(['chrome-devtools-mcp']);
  });

  it('includes multi-type tools in the Skill filter', async () => {
    await setControl('type-filter', 'Skill');
    expect(cardIds()).toHaveLength(19);
    expect(cardIds()).toContain('context7');
    expect(cardIds()).toContain('openspec');
    expect(cardIds()).not.toContain('headroom');
  });

  it('intersects search and all three filters', async () => {
    await setControl('category-filter', 'Research & Documentation');
    await setControl('type-filter', 'MCP');
    await setControl('creator-filter', 'Upstash');
    await setControl('skill-search', 'documentation');
    expect(cardIds()).toEqual(['context7']);
    await setControl('creator-filter', 'Code Dimension');
    expect(cardIds()).toEqual([]);
    expect(root.textContent).toContain('No tools found');
  });

  it('clears search and every filter from an empty result', async () => {
    await setControl('category-filter', 'Backend & APIs');
    await setControl('type-filter', 'CLI');
    await setControl('creator-filter', 'Code Dimension');
    await setControl('skill-search', 'missing tool');
    expect(cardIds()).toEqual([]);
    expect(
      root.querySelector('[role="status"] strong')?.textContent?.trim()
    ).toBe('0');
    const clear = [...root.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Clear filters')
    )!;
    clear.click();
    await fixture.whenStable();
    expect(cardIds()).toEqual(CATALOG_ITEMS.map((item) => item.id));
    expect(root.querySelector<HTMLInputElement>('#skill-search')!.value).toBe(
      ''
    );
    for (const select of root.querySelectorAll('select'))
      expect(select.value).toBe('all');
    expect(root.querySelector('button')).toBeNull();
  });
});
