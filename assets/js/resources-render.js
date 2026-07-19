/* ============================================================
   FIN ASTRA — RESOURCES RENDER
   resources-render.js — renders cards/tabs on resources.html
   Also renders the Home insights preview (3 latest posts)
   ============================================================ */

'use strict';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getCategoryLabel(cat) {
  const map = { blog: 'Blog', news: 'News', article: 'Article' };
  return map[cat] || cat;
}

function getPlaceholderSVG(tag) {
  const colors = {
    'Estate Planning': '#C1603D',
    'Regulatory': '#6B5F52',
    'Succession': '#C1603D',
    'Tax Strategy': '#6B8F5C',
    'Press': '#2B2622',
    'Corporate': '#6B5F52',
    'Compliance': '#C1603D',
    'Wealth': '#6B8F5C',
  };
  const color = colors[tag] || '#9C8F7E';
  return `
    <div class="card-resource__thumb-placeholder" aria-hidden="true">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="44" height="40" rx="1" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.4"/>
        <path d="M14 28h28M14 20h18M14 36h22" stroke="${color}" stroke-width="1.5" stroke-linecap="square"/>
        <circle cx="42" cy="14" r="5" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.6"/>
      </svg>
    </div>`;
}

function renderResourceCard(post) {
  const thumb = post.image
    ? `<img src="${post.image}" alt="${post.title}" loading="lazy">`
    : getPlaceholderSVG(post.tag);

  return `
    <article class="card-resource reveal-up">
      <a href="/blog/${post.slug}.html" aria-label="Read: ${post.title}">
        <div class="card-resource__thumb">
          ${thumb}
        </div>
        <div class="card-resource__body">
          <div class="card-resource__meta">
            <span class="card-resource__tag">${post.tag}</span>
            <time class="card-resource__date" datetime="${post.date}">${formatDate(post.date)}</time>
          </div>
          <h3 class="card-resource__title">${post.title}</h3>
          <p class="card-resource__excerpt">${post.excerpt}</p>
        </div>
        <div class="card-resource__footer">
          <span class="card-resource__read-more">
            Read more
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
          <span class="card-resource__tag" style="font-size:11px;">${getCategoryLabel(post.category)}</span>
        </div>
      </a>
    </article>`;
}

function renderUsefulLink(link) {
  return `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="useful-link-item" aria-label="Visit: ${link.title} (opens new tab)">
      <div class="useful-link-content">
        <p class="useful-link-title">${link.title}</p>
        <p class="useful-link-desc">${link.description}</p>
      </div>
      <span class="useful-link-arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </span>
    </a>`;
}

// ─── RESOURCES PAGE RENDER ────────────────────────────────
function initResourcesPage() {
  if (typeof resourcesData === 'undefined') return;

  const blogGrid = document.getElementById('blog-grid');
  const articlesGrid = document.getElementById('articles-grid');
  const newsGrid = document.getElementById('news-grid');
  const linksContainer = document.getElementById('useful-links-container');

  const blogs = resourcesData.filter(p => p.category === 'blog');
  const articles = resourcesData.filter(p => p.category === 'article');
  const news = resourcesData.filter(p => p.category === 'news');

  // Combine articles + news for the Articles & News tab
  const articlesAndNews = [...articles, ...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (blogGrid) {
    blogGrid.innerHTML = blogs.map(renderResourceCard).join('');
  }

  if (articlesGrid) {
    articlesGrid.innerHTML = articlesAndNews.map(renderResourceCard).join('');
  }

  if (newsGrid) {
    newsGrid.innerHTML = news.map(renderResourceCard).join('');
  }

  if (linksContainer && typeof usefulLinksData !== 'undefined') {
    linksContainer.innerHTML = usefulLinksData.map(renderUsefulLink).join('');
  }
}

// ─── HOME INSIGHTS PREVIEW ────────────────────────────────
function initHomeInsights() {
  const insightsGrid = document.getElementById('insights-preview');
  if (!insightsGrid || typeof resourcesData === 'undefined') return;

  const latest = [...resourcesData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  insightsGrid.innerHTML = latest.map(renderResourceCard).join('');
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initResourcesPage();
  initHomeInsights();
});
