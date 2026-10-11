import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { validateCatalog } from './validate-catalog.mjs';

const catalog = JSON.parse(
  await readFile(
    new URL('../src/app/catalog.data.json', import.meta.url),
    'utf8'
  )
);

test('accepts the catalog with 23 unique tools and five local authors', () => {
  validateCatalog(catalog);
  assert.equal(catalog.items.length, 23);
  const local = catalog.items.filter((item) =>
    item.url.startsWith(
      'https://skills.sh/code-dimension/code-dimension-skills/'
    )
  );
  assert.equal(local.length, 5);
  for (const item of local) {
    assert.equal(item.creator, 'Code Dimension');
    assert.equal(item.creatorType, 'Organization');
  }
});

test('accepts the www.skills.sh domain', () => {
  const data = structuredClone(catalog);
  data.items[0].url = data.items[0].url.replace(
    'https://skills.sh/',
    'https://www.skills.sh/'
  );
  validateCatalog(data);
});

const invalidCases = [
  ['missing items', (data) => delete data.items],
  ['empty items', (data) => (data.items = [])],
  ['duplicate IDs', (data) => data.items.push(data.items[0])],
  ['invalid ID', (data) => (data.items[0].id = 'Invalid ID')],
  ['empty categories', (data) => (data.items[0].categories = [])],
  ['missing categories', (data) => delete data.items[0].categories],
  ['non-string category', (data) => (data.items[0].categories = [4])],
  ['blank category', (data) => (data.items[0].categories = [' '])],
  [
    'duplicate categories',
    (data) => (data.items[0].categories = ['Design', 'Design']),
  ],
  ['empty types', (data) => (data.items[0].types = [])],
  ['invalid type', (data) => (data.items[0].types = ['Plugin'])],
  ['missing types', (data) => delete data.items[0].types],
  ['script URL', (data) => (data.items[0].url = 'javascript:alert(1)')],
  [
    'skill outside skills.sh',
    (data) =>
      (data.items[0].url =
        'https://github.com/code-dimension/code-dimension-skills'),
  ],
  [
    'lookalike skills domain',
    (data) => (data.items[0].url = 'https://skills.sh.example.com/tool'),
  ],
  ['relative URL', (data) => (data.items[0].url = '/tool')],
  ['FTP URL', (data) => (data.site.sourceRepository = 'ftp://example.com/')],
  ['invalid creator type', (data) => (data.items[0].creatorType = 'Team')],
  [
    'incorrect local author',
    (data) =>
      (data.items.find((item) => item.id === 'save-research').creator =
        'Other'),
  ],
  [
    'incorrect local author type',
    (data) =>
      (data.items.find((item) => item.id === 'save-research').creatorType =
        'Person'),
  ],
  ['empty FAQs', (data) => (data.faqs = [])],
  ['blank FAQ', (data) => (data.faqs[0].answer = '')],
  ['non-string FAQ', (data) => (data.faqs[0].answer = 1)],
];
for (const field of [
  'id',
  'name',
  'description',
  'creator',
  'creatorType',
  'url',
]) {
  invalidCases.push([
    `missing ${field}`,
    (data) => delete data.items[0][field],
  ]);
}
for (const [name, mutate] of invalidCases) {
  test(`rejects ${name}`, () => {
    const data = structuredClone(catalog);
    mutate(data);
    assert.throws(() => validateCatalog(data));
  });
}
