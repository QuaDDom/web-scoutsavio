import { useEffect } from 'react';

export const SEO = ({
  title,
  description,
  keywords = '',
  image = '/og-image.jpg',
  url = '',
  type = 'website'
}) => {
  const baseUrl = 'https://scoutsavio.org';
  const fullUrl = `${baseUrl}${url}`;
  const fullTitle = title
    ? `${title} | Grupo Scout 331 Savio`
    : 'Grupo Scout 331 Gral. Manuel Nicolás Savio | Río Tercero, Córdoba';

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMeta = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Standard meta tags
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', `${baseUrl}${image}`, true);
    updateMeta('og:url', fullUrl, true);
    updateMeta('og:type', type, true);

    // Twitter
    updateMeta('twitter:title', fullTitle, true);
    updateMeta('twitter:description', description, true);
    updateMeta('twitter:image', `${baseUrl}${image}`, true);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', fullUrl);
    }
  }, [fullTitle, description, keywords, image, fullUrl, type]);

  return null;
};
