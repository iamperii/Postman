const searchInput = document.getElementById('pmSearch');

window.addEventListener('keydown', (e) => {
	const isMac = navigator.platform.toUpperCase().includes('MAC');
	const isCmdK = isMac && e.metaKey && e.key.toLowerCase() === 'k';
	const isCtrlK = !isMac && e.ctrlKey && e.key.toLowerCase() === 'k';

	if (isCmdK || isCtrlK) {
		e.preventDefault();
		searchInput?.focus();
	}
});

const searchGroup = document.querySelector('.dashboard-searchgroup');
const overlay = document.getElementById('pmSearchOverlay');
const panel = document.getElementById('pmSearchPanel');

let overlayOpen = false;

function positionSearchPanel() {
	if (!searchGroup || !panel) return;

	const r = searchGroup.getBoundingClientRect();
	const gap = 10;

	const top = Math.round(r.bottom + gap);
	const left = Math.round(r.left);
	const width = Math.round(r.width);

	panel.style.top = `${top}px`;
	panel.style.left = `${left}px`;
	panel.style.width = `${width}px`;

	// Height limit (so it doesn't go out of viewport)
	const maxH = Math.max(220, window.innerHeight - top - 16);
	panel.style.maxHeight = `${maxH}px`;
}

function openSearchOverlay() {
	if (!overlay || !panel || overlayOpen) return;
	overlay.hidden = false;
	overlayOpen = true;
	positionSearchPanel();
}

function closeSearchOverlay() {
	if (!overlay || !overlayOpen) return;
	overlay.hidden = true;
	overlayOpen = false;
}

searchInput?.addEventListener('focus', () => {
	openSearchOverlay();
});

searchInput?.addEventListener('click', () => {
	openSearchOverlay();
});

// close on ESC
window.addEventListener('keydown', (e) => {
	if (!overlayOpen) return;
	if (e.key === 'Escape') {
		e.preventDefault();
		closeSearchOverlay();
		searchInput?.blur();
	}
});

// close on backdrop click
overlay?.addEventListener('click', (e) => {
	const t = e.target;
	if (t && t.matches && t.matches('[data-pm-search-close]')) {
		closeSearchOverlay();
		searchInput?.blur();
	}
});

// keep open when clicking inside panel
panel?.addEventListener('click', (e) => {
	e.stopPropagation();
});

// reposition on resize/scroll
window.addEventListener('resize', () => {
	if (overlayOpen) positionSearchPanel();
});

window.addEventListener(
	'scroll',
	() => {
		if (overlayOpen) positionSearchPanel();
	},
	true,
);
console.log(
	document.getElementById('pmSearchOverlay'),
	document.getElementById('pmSearchPanel'),
	document.getElementById('pmSearch'),
);
