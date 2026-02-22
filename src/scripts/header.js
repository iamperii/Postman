let overlayOpen = false;

function getEls() {
	return {
		searchInput: document.getElementById('pmSearch'),
		searchGroup: document.querySelector('.dashboard-searchgroup'),
		overlay: document.getElementById('pmSearchOverlay'),
		panel: document.getElementById('pmSearchPanel'),
	};
}

function positionSearchPanel(searchGroup, panel) {
	if (!searchGroup || !panel) return;

	const r = searchGroup.getBoundingClientRect();
	const gap = 10;

	const top = Math.round(r.bottom + gap);
	const left = Math.round(r.left);
	const width = Math.round(r.width);

	panel.style.top = `60px`;
	panel.style.left = `50%`;
	panel.style.width = `${width}px`;


	const maxH = Math.max(220, window.innerHeight - top - 16);
	panel.style.maxHeight = `${maxH}px`;
}

function openSearchOverlay() {
	const { searchGroup, overlay, panel } = getEls();
	if (!overlay || !panel) return;

	overlay.hidden = false;
	overlayOpen = true;
	positionSearchPanel(searchGroup, panel);
}

function closeSearchOverlay() {
	const { overlay } = getEls();
	if (!overlay) return;

	overlay.hidden = true;
	overlayOpen = false;
}

window.addEventListener('keydown', (e) => {
	const isMac = navigator.platform.toUpperCase().includes('MAC');
	const isCmdK = isMac && e.metaKey && e.key.toLowerCase() === 'k';
	const isCtrlK = !isMac && e.ctrlKey && e.key.toLowerCase() === 'k';

	if (isCmdK || isCtrlK) {
		e.preventDefault();
		const { searchInput } = getEls();
		searchInput?.focus();
		openSearchOverlay();
	}

	if (overlayOpen && e.key === 'Escape') {
		e.preventDefault();
		closeSearchOverlay();
		getEls().searchInput?.blur();
	}
});

document.addEventListener(
	'focusin',
	(e) => {
		if (e.target && e.target.id === 'pmSearch') openSearchOverlay();
	},
	true,
);

document.addEventListener(
	'click',
	(e) => {
		const t = e.target;

		if (t && t.id === 'pmSearch') {
			openSearchOverlay();
			return;
		}

		if (t && t.matches && t.matches('[data-pm-search-close]')) {
			closeSearchOverlay();
			getEls().searchInput?.blur();
			return;
		}
	},
	true,
);

document.addEventListener(
	'click',
	(e) => {
		const { panel } = getEls();
		if (!panel) return;
		if (panel.contains(e.target)) e.stopPropagation();
	},
	true,
);

window.addEventListener('resize', () => {
	if (!overlayOpen) return;
	const { searchGroup, panel } = getEls();
	positionSearchPanel(searchGroup, panel);
});

window.addEventListener(
	'scroll',
	() => {
		if (!overlayOpen) return;
		const { searchGroup, panel } = getEls();
		positionSearchPanel(searchGroup, panel);
	},
	true,
);
const pmOverlay = document.getElementById('pmSearchOverlay');
const pmPanel = document.getElementById('pmSearchPanel');

let lastActiveEl = null;

function openPmSearch() {
	if (!pmOverlay) return;

	lastActiveEl = document.activeElement;

	pmOverlay.hidden = false;
	requestAnimationFrame(() => {
		const firstFocusable =
			pmOverlay.querySelector(
				'input, button, textarea, select, a[href], [tabindex]:not([tabindex="-1"])',
			) || pmPanel;
		firstFocusable?.focus?.();
	});
}

function closePmSearch() {
	if (!pmOverlay) return;

	pmOverlay.hidden = true;

	if (lastActiveEl && typeof lastActiveEl.focus === 'function') {
		lastActiveEl.focus();
	}
	lastActiveEl = null;
}

document.addEventListener('click', (e) => {
	const openBtn = e.target.closest('[data-pm-search-open]');
	if (openBtn) {
		openPmSearch();
		return;
	}

	const closeBtn = e.target.closest('[data-pm-search-close]');
	if (closeBtn) {
		closePmSearch();
	}
});

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && pmOverlay && !pmOverlay.hidden) {
		closePmSearch();
	}
});

if (pmPanel) {
	pmPanel.addEventListener('click', (e) => e.stopPropagation());
}
