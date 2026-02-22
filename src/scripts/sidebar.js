let __pmSidebarBound = false;

function bindSidebar() {
	const sidebar = document.getElementById('dashboardSidebar');
	const shell = document.querySelector('.dashboard-shell');
	if (!sidebar || !shell) return false;

	if (__pmSidebarBound) return true;
	__pmSidebarBound = true;

	const quickSearch = document.getElementById('dashboardQuickSearch');
	const plusIcon = document.getElementById('dashboardPlusIcon');
	const footerToggle = document.getElementById('dashboardFooterSidebarToggle');
	const resizer = document.getElementById('dashboardResizer');

	const TAB_LABELS = {
		collections: 'Collections',
		environments: 'Environments',
		flows: 'Flows',
		history: 'History',
		more: 'More',
	};

	const TAB_PLACEHOLDERS = {
		collections: 'Search collections',
		environments: 'Search environments',
		flows: 'Search flows',
		history: 'Search history',
		more: 'Search',
	};

	const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

	function setMyLabel(tabName) {
		const labelEl = sidebar.querySelector(
			'[data-dashboard-open="collection-1"] .dashboard-treelabel',
		);
		if (!labelEl) return;
		const label = TAB_LABELS[tabName] || 'Collections';
		labelEl.textContent = `My ${label}`;
	}

	function applySearchUI(tabName) {
		if (quickSearch)
			quickSearch.placeholder = TAB_PLACEHOLDERS[tabName] || 'Search';
		if (plusIcon) plusIcon.classList.toggle('d-none', tabName === 'history');
		setMyLabel(tabName);
	}

	function setActiveDashboardTab(tabName) {
		sidebar.querySelectorAll('.dashboard-panel').forEach((p) => {
			p.classList.toggle(
				'active',
				p.getAttribute('data-dashboard-panel') === tabName,
			);
		});

		document
			.querySelectorAll('.dashboard-leftbar-btn[data-dashboard-tab]')
			.forEach((b) =>
				b.classList.toggle(
					'active',
					b.getAttribute('data-dashboard-tab') === tabName,
				),
			);

		applySearchUI(tabName);
	}

	// --- Leftbar tab switching (event delegation)
	document.addEventListener('click', (e) => {
		const btn = e.target.closest('.dashboard-leftbar-btn[data-dashboard-tab]');
		if (!btn) return;
		const tab = btn.getAttribute('data-dashboard-tab');
		if (!tab) return;
		setActiveDashboardTab(tab);
	});

	// --- Tree open/close (requires the panel with matching id)
	document.addEventListener('click', (e) => {
		const treeBtn = e.target.closest('[data-dashboard-open]');
		if (!treeBtn) return;

		const id = treeBtn.getAttribute('data-dashboard-open');
		const panel = document.getElementById(id);
		if (!panel) return; // panel must exist (e.g. id="collection-1")

		const willOpen = panel.classList.contains('d-none');
		panel.classList.toggle('d-none', !willOpen);

		treeBtn.classList.toggle('is-open', willOpen);
		treeBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
	});

	// --- Sidebar minimize/restore (icons only) via footer button
	function toggleMinSidebar() {
		shell.classList.toggle('sidebar-min');
	}

	if (footerToggle) {
		footerToggle.addEventListener('click', (e) => {
			e.preventDefault();
			toggleMinSidebar();
		});
	}

	// --- Drag resizer (fast: rAF throttling + CSS var write)
	if (resizer) {
		let dragging = false;
		let startX = 0;
		let startW = 0;

		let rafId = 0;
		let nextW = 0;

		const MIN = 92; // match your CSS --sidebar-min-w idea
		const MAX = 560;

		const applyWidth = () => {
			rafId = 0;
			shell.style.setProperty('--sidebar-w', `${nextW}px`);
		};

		const onMove = (ev) => {
			if (!dragging) return;
			const dx = ev.clientX - startX;
			nextW = clamp(startW + dx, MIN, MAX);

			if (!rafId) rafId = requestAnimationFrame(applyWidth);
		};

		const stop = () => {
			if (!dragging) return;
			dragging = false;
			shell.classList.remove('is-resizing');
			document.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerup', stop);
		};

		resizer.addEventListener('pointerdown', (ev) => {
			// if sidebar is in "icons-only", restore first
			if (shell.classList.contains('sidebar-min'))
				shell.classList.remove('sidebar-min');

			dragging = true;
			startX = ev.clientX;

			const current = getComputedStyle(shell)
				.getPropertyValue('--sidebar-w')
				.trim();
			startW = parseInt(current, 10);
			if (!Number.isFinite(startW)) startW = 320;

			shell.classList.add('is-resizing');
			resizer.setPointerCapture?.(ev.pointerId);

			document.addEventListener('pointermove', onMove);
			document.addEventListener('pointerup', stop);
		});

		// keyboard support (optional, no design change)
		resizer.addEventListener('keydown', (ev) => {
			const step = ev.shiftKey ? 40 : 20;
			const current = getComputedStyle(shell)
				.getPropertyValue('--sidebar-w')
				.trim();
			let w = parseInt(current, 10);
			if (!Number.isFinite(w)) w = 320;

			if (ev.key === 'ArrowLeft') {
				ev.preventDefault();
				shell.style.setProperty(
					'--sidebar-w',
					`${clamp(w - step, MIN, MAX)}px`,
				);
			}
			if (ev.key === 'ArrowRight') {
				ev.preventDefault();
				shell.style.setProperty(
					'--sidebar-w',
					`${clamp(w + step, MIN, MAX)}px`,
				);
			}
		});
	}

	// init active tab
	const activeBtn = document.querySelector(
		'.dashboard-leftbar-btn.active[data-dashboard-tab]',
	);
	setActiveDashboardTab(
		activeBtn?.getAttribute('data-dashboard-tab') || 'collections',
	);

	return true;
}

bindSidebar();

const __pmObserver = new MutationObserver(() => {
	if (bindSidebar()) __pmObserver.disconnect();
});
__pmObserver.observe(document.documentElement, {
	childList: true,
	subtree: true,
});

// Tree action click (kept)
document.addEventListener('click', (e) => {
	const action = e.target.closest('[data-tree-action]');
	if (!action) return;

	e.preventDefault();
	e.stopPropagation();

	const type = action.getAttribute('data-tree-action');
	// TODO: handle add/star/more
});
