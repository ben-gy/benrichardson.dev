// ============ DYNAMIC SITES LOADER ============
// Fetches the site index from gh-site-factory and populates the Sites dropdown

const INDEX_URL = 'https://ben-gy.github.io/gh-site-factory/index/sites.json';

export function initSitesLoader() {
    const menu = document.getElementById('sites-menu');
    if (!menu) return;

    fetch(INDEX_URL)
        .then(r => r.json())
        .then(data => {
            const webSites = (data.sites || [])
                .filter(s => s.type === 'web' && s.url)
                .sort((a, b) => b.date.localeCompare(a.date));

            if (webSites.length === 0) return;

            // Remove the loading placeholder
            const placeholder = menu.querySelector('.sites-loading');
            if (placeholder) placeholder.remove();

            // Insert a divider after the static links
            const divider = document.createElement('li');
            divider.className = 'divider';
            menu.appendChild(divider);

            // Add each web site
            for (const site of webSites) {
                const li = document.createElement('li');
                li.setAttribute('role', 'menu-item');
                const a = document.createElement('a');
                a.href = site.url;
                a.target = '_blank';
                a.textContent = site.name;
                li.appendChild(a);
                menu.appendChild(li);
            }
        })
        .catch(() => {
            // Silent fail — static links still work
            const placeholder = menu.querySelector('.sites-loading');
            if (placeholder) placeholder.remove();
        });
}
