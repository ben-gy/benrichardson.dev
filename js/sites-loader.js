// ============ DYNAMIC SITES LOADER ============
// Fetches the site index from gh-site-factory and populates the Sites dropdown.
// Sites carrying a `group` are nested under a labelled submenu (e.g. "Data");
// everything else is listed flat, newest first.

const INDEX_URL = 'https://ben-gy.github.io/gh-site-factory/index/sites.json';

// Map a site's group key to the submenu label shown in the dropdown.
const GROUP_LABELS = {
    data: 'Data',
};

// The shared index doesn't yet carry a grouping field, so membership is defined
// here by slug. If the index later adds an explicit `group`, that wins (see
// groupOf), and these sites auto-nest without touching this list.
const GROUP_BY_SLUG = {
    'au-crime': 'data',
    'au-planning': 'data',
    'au-crashes': 'data',
    'au-donations': 'data',
    'au-hospitals': 'data',
    'nemwatch': 'data',
    'au-dams': 'data',
};

function groupOf(site) {
    const key = site.group || GROUP_BY_SLUG[site.slug];
    return key && GROUP_LABELS[key] ? key : null;
}

function byDateDesc(a, b) {
    return b.date.localeCompare(a.date);
}

function makeLink(site) {
    const li = document.createElement('li');
    li.setAttribute('role', 'menu-item');
    const a = document.createElement('a');
    a.href = site.url;
    a.target = '_blank';
    a.textContent = site.name;
    li.appendChild(a);
    return li;
}

function makeDivider() {
    const divider = document.createElement('li');
    divider.className = 'divider';
    return divider;
}

function makeSubmenu(label, sites) {
    const li = document.createElement('li');
    li.setAttribute('role', 'menu-item');
    li.setAttribute('aria-haspopup', 'true');
    li.setAttribute('tabindex', '0');
    li.classList.add('has-submenu');

    const title = document.createElement('span');
    title.className = 'submenu-label';
    title.textContent = label;
    li.appendChild(title);

    const submenu = document.createElement('ul');
    submenu.setAttribute('role', 'menu');
    for (const site of sites) submenu.appendChild(makeLink(site));
    li.appendChild(submenu);

    // Mobile (and keyboard) support: tapping the label toggles the flyout
    // instead of relying on hover/:focus-within. Stop propagation so the
    // parent "Sites" menu doesn't close.
    title.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('submenu-open');
    });

    return li;
}

export function initSitesLoader() {
    const menu = document.getElementById('sites-menu');
    if (!menu) return;

    fetch(INDEX_URL)
        .then(r => r.json())
        .then(data => {
            const webSites = (data.sites || []).filter(s => s.type === 'web' && s.url);
            if (webSites.length === 0) return;

            // Remove the loading placeholder
            const placeholder = menu.querySelector('.sites-loading');
            if (placeholder) placeholder.remove();

            // Split into grouped (nested submenus) and ungrouped (flat) sites.
            const grouped = new Map(); // group key -> [sites]
            const flat = [];
            for (const site of webSites) {
                const key = groupOf(site);
                if (key) {
                    if (!grouped.has(key)) grouped.set(key, []);
                    grouped.get(key).push(site);
                } else {
                    flat.push(site);
                }
            }

            // Divider after the static links (GitHub / LinkedIn)
            menu.appendChild(makeDivider());

            // Flat sites first, newest to oldest
            flat.sort(byDateDesc);
            for (const site of flat) menu.appendChild(makeLink(site));

            // Then a submenu per group, newest group-member first
            for (const [key, sites] of grouped) {
                sites.sort(byDateDesc);
                menu.appendChild(makeSubmenu(GROUP_LABELS[key], sites));
            }
        })
        .catch(() => {
            // Silent fail — static links still work
            const placeholder = menu.querySelector('.sites-loading');
            if (placeholder) placeholder.remove();
        });
}
