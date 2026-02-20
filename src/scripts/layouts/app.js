const layout = document.querySelector('.layout');
document.querySelector('.icon-btn')?.addEventListener('click', () => {
	layout.classList.toggle('sidebar-collapsed');
});

async function loadPartial(selector, url) {
	const el = document.querySelector(selector);
	if (!el) {
		console.warn('Missing element:', selector);
		return;
	}

	const res = await fetch(url, { cache: 'no-store' });
	if (!res.ok) {
		const msg = `Failed to load ${url}: ${res.status}`;
		console.error(msg);
		el.innerHTML = `<div style="padding:12px;color:#c00">${msg}</div>`;
		return;
	}

	el.innerHTML = await res.text();
}

function setActiveNavLinks() {
	const current = location.pathname.split('/').pop();
	document.querySelectorAll('[data-nav]').forEach((a) => {
		const href = a.getAttribute('href') || '';
		const target = href.split('/').pop();
		a.classList.toggle('active', target === current);
	});
}

function bindLayoutEvents() {
	const toggleBtn = document.querySelector('[data-sidebar-toggle]');
	const sidebar = document.querySelector('[data-sidebar]');

	if (toggleBtn && sidebar) {
		toggleBtn.addEventListener('click', () => {
			sidebar.classList.toggle('collapsed');
		});
	}
}

async function init() {
	try {
		console.log('Init layout...');

		await Promise.all([
			loadPartial('#app-header', '../partials/header.html'),
			loadPartial('#app-sidebar', '../partials/sidebar.html'),
			loadPartial('#app-footer', '../partials/footer.html'),
			loadPartial('#app-content', '../../html/partials/workspacemain.html'),
			loadPartial('#app-rightsidebar', '../../html/partials/rightSidebar.html'),
		]);

		console.log('Partials loaded.');
		setActiveNavLinks();
		bindLayoutEvents();
	} catch (e) {
		console.error('Layout init failed:', e);
	}
}

document.addEventListener('DOMContentLoaded', init);
