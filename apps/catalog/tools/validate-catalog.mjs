export function validateCatalog(value) {
  if (
    !value?.site ||
    !Array.isArray(value.items) ||
    !Array.isArray(value.faqs)
  ) {
    throw new Error('catalog.data.json must define site, items, and faqs.');
  }

  validateUrl(value.site.url);
  validateUrl(value.site.sourceRepository);

  for (const field of [
    'name',
    'organizationName',
    'title',
    'language',
    'locale',
    'themeColor',
  ]) {
    if (
      typeof value.site[field] !== 'string' ||
      value.site[field].trim() === ''
    ) {
      throw new Error(`Site configuration has an invalid ${field}.`);
    }
  }

  if (!value.site.url.endsWith('/')) {
    throw new Error('site.url must end with a slash.');
  }

  if (value.items.length === 0) {
    throw new Error('The catalog must contain at least one item.');
  }

  const ids = new Set();
  for (const item of value.items) {
    for (const field of [
      'id',
      'name',
      'url',
      'description',
      'creator',
      'creatorType',
    ]) {
      if (typeof item?.[field] !== 'string' || item[field].trim() === '') {
        throw new Error(
          `Item ${item?.id ?? '<unknown>'} has an invalid ${field}.`
        );
      }
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) {
      throw new Error(`Item id "${item.id}" must be lowercase kebab-case.`);
    }

    if (ids.has(item.id)) {
      throw new Error(`Duplicate item id "${item.id}".`);
    }

    validateUrl(item.url);
    for (const field of ['types', 'categories']) {
      if (
        !Array.isArray(item[field]) ||
        item[field].length === 0 ||
        item[field].some(
          (entry) => typeof entry !== 'string' || !entry.trim()
        ) ||
        new Set(item[field]).size !== item[field].length
      ) {
        throw new Error(
          `Item "${item.id}" must have non-empty, unique ${field}.`
        );
      }
    }
    if (
      item.types.some((type) => !['Skill', 'CLI', 'MCP', 'Plugin'].includes(type))
    ) {
      throw new Error(`Item "${item.id}" has an invalid type.`);
    }
    const url = new URL(item.url);
    if (
      item.types.includes('Skill') &&
      !['skills.sh', 'www.skills.sh'].includes(url.hostname)
    ) {
      throw new Error(`Skill "${item.id}" must link to skills.sh.`);
    }
    if (
      ['skills.sh', 'www.skills.sh'].includes(url.hostname) &&
      url.pathname.startsWith('/code-dimension/code-dimension-skills/') &&
      (item.creator !== 'Code Dimension' || item.creatorType !== 'Organization')
    ) {
      throw new Error(
        `Local item "${item.id}" must be authored by Code Dimension.`
      );
    }

    if (!['Organization', 'Person'].includes(item.creatorType)) {
      throw new Error(
        `Item "${item.id}" creatorType must be Organization or Person.`
      );
    }

    ids.add(item.id);
  }

  if (value.faqs.length === 0) {
    throw new Error('The catalog must contain at least one FAQ.');
  }

  for (const faq of value.faqs) {
    if (
      typeof faq?.question !== 'string' ||
      !faq.question.trim() ||
      typeof faq?.answer !== 'string' ||
      !faq.answer.trim()
    ) {
      throw new Error('Every FAQ must have a non-empty question and answer.');
    }
  }
}

function validateUrl(value) {
  if (
    typeof value !== 'string' ||
    !['http:', 'https:'].includes(new URL(value).protocol)
  ) {
    throw new Error('Catalog URLs must use HTTP or HTTPS.');
  }
}
