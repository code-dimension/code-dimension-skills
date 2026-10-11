import { validateCatalog } from './validate-catalog.mjs';
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

const { site, faqs, items } = catalog;
const categories = uniqueSorted(items.flatMap((item) => item.categories));
const types = uniqueSorted(items.flatMap((item) => item.types));
const creators = uniqueSorted(items.map((item) => item.creator));
const metaDescription = `Discover ${items.length} recommended agent tools: skills, CLIs, and MCP. Compare objectives, types, and creators. Visit each source to get started.`;
const socialDescription = `Explore ${items.length} agent tools across ${categories.length} objectives. Find skills, CLIs, and MCP tools from ${creators.length} creators.`;

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
  description: `${site.organizationName} reviews and creates practical tools for AI coding agents.`,
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
  name: 'Recommended agent tools',
  description: `Recommended agent tools across ${formatList(categories)}.`,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${site.url}#skill-${item.id}`,
    item: {
      '@type': 'CreativeWork',
      name: item.name,
      description: item.description,
      url: item.url,
      genre: item.categories,
      learningResourceType: item.types,
      creator: {
        '@type': item.creatorType,
        name: item.creator,
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
  )}" title="Agent tools catalog in Markdown" />`,
  '',
  '    <meta property="og:type" content="website" />',
  `    <meta property="og:locale" content="${escapeHtml(site.locale)}" />`,
  `    <meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
  '    <meta property="og:title" content="Trusted Agent Tools for AI Coding Agents" />',
  `    <meta property="og:description" content="${escapeHtml(
    socialDescription
  )}" />`,
  `    <meta property="og:url" content="${escapeHtml(site.url)}" />`,
  '',
  '    <meta name="twitter:card" content="summary" />',
  '    <meta name="twitter:title" content="Trusted Agent Tools for AI Coding Agents" />',
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
    generateLlms(site, items, categories, creators, types)
  ),
  writeFile(
    path.join(publicPath, 'skills.md'),
    generateSkillsMarkdown(site, items)
  ),
]);

console.log(
  `Generated SEO/AEO artifacts for ${items.length} tools and ${faqs.length} FAQs.`
);

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
  return `User-agent: *\nAllow: /\n\nSitemap: ${
    new URL('sitemap.xml', siteUrl).href
  }\n`;
}

function generateSitemap(siteUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escapeHtml(
    siteUrl
  )}</loc>\n  </url>\n</urlset>\n`;
}

function generateLlms(
  siteConfig,
  itemEntries,
  itemCategories,
  itemCreators,
  itemTypes
) {
  return `# ${siteConfig.name}\n\n> ${siteConfig.organizationName}'s public catalog of recommended tools for AI coding agents.\n\nThe catalog contains ${itemEntries.length} tools across ${itemCategories.length} objectives from ${itemCreators.length} creators. Types: ${itemTypes.join(', ')}.\n\n## Key resources\n\n- [Agent Tools Catalog](${siteConfig.url}): Browse and filter every recommendation.\n- [Catalog in Markdown](${new URL('skills.md', siteConfig.url).href}): Read descriptions, types, categories, creators, and source links.\n- [Source Repository](${siteConfig.sourceRepository}): Inspect the catalog and local skills.\n\n## Catalog categories\n\n${itemCategories.map((category) => `- ${category}`).join('\n')}\n\n${catalogEntriesMarkdown(itemEntries)}\n\n## Usage\n\nChoose a tool by objective and visit its source for documentation and setup. Review instructions and permissions before use.\n`;
}

function catalogEntriesMarkdown(itemEntries) {
  return itemEntries
    .map(
      (item) =>
        `## ${item.name}\n\n- Creator: ${item.creator}\n- Types: ${item.types.join(', ')}\n- Categories: ${item.categories.join(', ')}\n- Purpose: ${item.description}\n- Visit tool: <${item.url}>`
    )
    .join('\n\n');
}

function generateSkillsMarkdown(siteConfig, itemEntries) {
  return `# Agent Tools Catalog\n\n${siteConfig.organizationName} recommends skills, CLIs, and MCP tools for AI coding agents. Skills provide reusable instructions, CLIs run terminal tasks, and MCP connects agents to tools and context.\n\nCatalog entries: ${itemEntries.length}\n\nCanonical catalog: <${siteConfig.url}>\n\n${catalogEntriesMarkdown(itemEntries)}\n\n## How to get started\n\n1. Choose a tool that matches your task.\n2. Visit its source for documentation and setup instructions.\n3. Review instructions and permissions before using it with your coding agent.\n\n## Source and updates\n\nInspect the public source repository for the latest catalog and skill files: <${siteConfig.sourceRepository}>\n`;
}
