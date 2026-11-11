// A draft is visible to reviewers, but cannot become indexable without approval.
export function validateDraftHub(html, slug) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const attr = (tag, name) => {
    const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
    return match?.[2];
  };
  const robots = tags.filter(tag => attr(tag, 'name')?.toLowerCase() === 'robots');
  if (robots.length !== 1 || !/^noindex\s*,\s*follow$/i.test(attr(robots[0], 'content') || ''))
    throw new Error(`Unapproved hub must have exactly one noindex,follow robots directive: ${slug}`);
  const links = html.match(/<link\b[^>]*>/gi) || [];
  const canonical = links.filter(tag => attr(tag, 'rel')?.toLowerCase() === 'canonical');
  if (canonical.length !== 1 || attr(canonical[0], 'href') !== `https://aafnaipatro.com/events/${slug}/`)
    throw new Error(`Unapproved hub must have one matching canonical: ${slug}`);
}
