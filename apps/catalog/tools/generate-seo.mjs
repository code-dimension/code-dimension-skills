import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const dataPath = path.join(projectRoot, 'src/app/catalog.data.json');
const indexTemplatePath = path.join(projectRoot, 'src/index.html');
const indexOutputPath = path.join(projectRoot, 'src/index.generated.html');
const publicPath = path.join(projectRoot, 'public');
const seoMarker =
  '    <!-- catalog-seo: generated from app/catalog.data.json before each build -->';

const catalog = JSON.parse(await readFile(dataPath, 'utf8'));
const indexTemplate = await readFile(indexTemplatePath, 'utf8');

validateCatalog(catalog);

const { site, faqs, skills } = catalog;
const categories = uniqueSorted(skills.map((skill) => skill.category));
const creators = uniqueSorted(skills.map((skill) => skill.creator));
const metaDescription = `Browse ${skills.length} reviewed agent skills for AI coding agents. Compare practical guidance, creators, categories, and installation commands. Explore the catalog.`;
const socialDescription = `Explore ${skills.length} practical, reviewed agent skills for AI coding agents. Compare use cases and copy installation commands in seconds.`;

if (metaDescription.length > 160) {
  throw new Error(
    `Generated meta description is ${metaDescription.length} characters; expected at most 160.`
  );
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site.url}#organization`,
  name: site.organizationName,
  url: site.url,
  description: `${site.organizationName} reviews and creates practical skills for AI coding agents.`,
  sameAs: [site.sourceRepository],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}#website`,
  url: site.url,
  name: site.name,
  description: metaDescription,
  inLanguage: site.language,
  publisher: { '@id': `${site.url}#organization` },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${site.url}#skill-list`,
  name: 'Recommended agent skills',
  description: `Reviewed agent skills across ${formatList(categories)}.`,
  numberOfItems: skills.length,
  itemListElement: skills.map((skill, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${site.url}#skill-${skill.id}`,
    item: {
      '@type': 'CreativeWork',
      name: skill.name,
      description: skill.description,
      genre: skill.category,
      creator: {
        '@type': skill.creatorType,
        name: skill.creator,
      },
    },
  })),
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${site.url}#faq`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const generatedHead = [
  `    <title>${escapeHtml(site.title)}</title>`,
  `    <meta name="description" content="${escapeHtml(metaDescription)}" />`,
  `    <meta name="author" content="${escapeHtml(site.organizationName)}" />`,
  `    <meta name="application-name" content="${escapeHtml(site.name)}" />`,
  '    <meta name="robots" content="index, follow, max-image-preview:large" />',
  `    <meta name="theme-color" content="${escapeHtml(site.themeColor)}" />`,
  '    <meta name="color-scheme" content="dark" />',
  '',
  `    <link rel="canonical" href="${escapeHtml(site.url)}" />`,
  `    <link rel="alternate" type="text/markdown" href="${escapeHtml(
    new URL('skills.md', site.url).href
  )}" title="Agent skills catalog in Markdown" />`,
  '',
  '    <meta property="og:type" content="website" />',
  `    <meta property="og:locale" content="${escapeHtml(site.locale)}" />`,
  `    <meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
  '    <meta property="og:title" content="Trusted Agent Skills for AI Coding Agents" />',
  `    <meta property="og:description" content="${escapeHtml(
    socialDescription
  )}" />`,
  `    <meta property="og:url" content="${escapeHtml(site.url)}" />`,
  '',
  '    <meta name="twitter:card" content="summary" />',
  '    <meta name="twitter:title" content="Trusted Agent Skills for AI Coding Agents" />',
  `    <meta name="twitter:description" content="${escapeHtml(
    socialDescription
  )}" />`,
  '',
  schemaScript(organizationSchema),
  schemaScript(websiteSchema),
  schemaScript(itemListSchema),
  schemaScript(faqSchema),
].join('\n');

if (!indexTemplate.includes(seoMarker)) {
  throw new Error(`SEO marker not found in ${indexTemplatePath}.`);
}

await Promise.all([
  writeFile(indexOutputPath, indexTemplate.replace(seoMarker, generatedHead)),
  writeFile(path.join(publicPath, 'robots.txt'), generateRobots(site.url)),
  writeFile(path.join(publicPath, 'sitemap.xml'), generateSitemap(site.url)),
  writeFile(
    path.join(publicPath, 'llms.txt'),
    generateLlms(site, skills, categories, creators)
  ),
  writeFile(
    path.join(publicPath, 'skills.md'),
    generateSkillsMarkdown(site, skills)
  ),
]);

console.log(
  `Generated SEO/AEO artifacts for ${skills.length} skills and ${faqs.length} FAQs.`
);

function validateCatalog(value) {
  if (!value?.site || !Array.isArray(value.skills) || !Array.isArray(value.faqs)) {
    throw new Error('catalog.data.json must define site, skills, and faqs.');
  }

  new URL(value.site.url);
  new URL(value.site.sourceRepository);

  for (const field of [
    'name',
    'organizationName',
    'title',
    'language',
    'locale',
    'themeColor',
  ]) {
    if (typeof value.site[field] !== 'string' || value.site[field].trim() === '') {
      throw new Error(`Site configuration has an invalid ${field}.`);
    }
  }

  if (!value.site.url.endsWith('/')) {
    throw new Error('site.url must end with a slash.');
  }

  if (value.skills.length === 0) {
    throw new Error('The catalog must contain at least one skill.');
  }

  const ids = new Set();
  for (const skill of value.skills) {
    for (const field of [
      'id',
      'name',
      'installCommand',
      'category',
      'description',
      'creator',
      'creatorType',
    ]) {
      if (typeof skill[field] !== 'string' || skill[field].trim() === '') {
        throw new Error(
          `Skill ${skill.id ?? '<unknown>'} has an invalid ${field}.`
        );
      }
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.id)) {
      throw new Error(`Skill id "${skill.id}" must be lowercase kebab-case.`);
    }

    if (ids.has(skill.id)) {
      throw new Error(`Duplicate skill id "${skill.id}".`);
    }

    if (!skill.installCommand.startsWith('npx skills add ')) {
      throw new Error(
        `Skill "${skill.id}" must use an npx skills add command.`
      );
    }

    if (!['Organization', 'Person'].includes(skill.creatorType)) {
      throw new Error(
        `Skill "${skill.id}" creatorType must be Organization or Person.`
      );
    }

    ids.add(skill.id);
  }

  for (const faq of value.faqs) {
    if (!faq?.question?.trim() || !faq?.answer?.trim()) {
      throw new Error('Every FAQ must have a non-empty question and answer.');
    }
  }
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((first, second) =>
    first.localeCompare(second, 'en')
  );
}

function formatList(values) {
  if (values.length < 2) {
    return values[0] ?? 'software development';
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function schemaScript(schema) {
  const json = JSON.stringify(schema, null, 2).replaceAll('<', '\\u003c');
  return `    <script type="application/ld+json">\n${indent(
    json,
    6
  )}\n    </script>`;
}

function indent(value, spaces) {
  const padding = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line) => `${padding}${line}`)
    .join('\n');
}

function generateRobots(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL(
    'sitemap.xml',
    siteUrl
  ).href}\n`;
}

function generateSitemap(siteUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escapeHtml(
    siteUrl
  )}</loc>\n  </url>\n</urlset>\n`;
}

function generateLlms(siteConfig, skillEntries, skillCategories, skillCreators) {
  return `# ${siteConfig.name}\n\n> ${siteConfig.organizationName}'s public catalog of reviewed and original skills for AI coding agents.\n\nThe catalog currently contains ${skillEntries.length} skills across ${skillCategories.length} categories from ${skillCreators.length} creators. Each entry identifies its creator, explains its scope, and provides an installation command.\n\n## Key resources\n\n- [Agent Skills Catalog](${siteConfig.url}): Browse and filter every recommended skill.\n- [Machine-readable Skills Catalog](${new URL(
    'skills.md',
    siteConfig.url
  ).href}): Read skill descriptions and installation commands in Markdown.\n- [Source Repository](${siteConfig.sourceRepository}): Inspect the catalog and skill source files on GitHub.\n\n## Catalog categories\n\n${skillCategories
    .map((category) => `- ${category}`)
    .join('\n')}\n\n## Usage\n\nChoose a skill, copy its \`npx skills add\` command, run it from the project directory, and review the installed \`SKILL.md\` before applying its guidance.\n`;
}

function generateSkillsMarkdown(siteConfig, skillEntries) {
  const entries = skillEntries
    .map(
      (skill) =>
        `## ${skill.name}\n\n- Creator: ${skill.creator}\n- Category: ${skill.category}\n- Purpose: ${skill.description}\n- Install: \`${skill.installCommand}\``
    )
    .join('\n\n');

  return `# Agent Skills Catalog\n\n${siteConfig.organizationName} maintains this catalog to help developers discover practical, reviewed skills for AI coding agents. A skill is a reusable instruction package focused on a framework, workflow, or engineering practice.\n\nCatalog entries: ${skillEntries.length}\n\nCanonical catalog: <${siteConfig.url}>\n\n${entries}\n\n## How to use a skill\n\n1. Choose a skill that matches your task.\n2. Run its installation command from your project directory.\n3. Review the installed \`SKILL.md\` before applying the guidance with your coding agent.\n\n## Source and updates\n\nInspect the public source repository for the latest catalog and skill files: <${siteConfig.sourceRepository}>\n`;
}
