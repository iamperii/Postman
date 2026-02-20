let __pmSidebarBound = false;

function bindSidebar() {
	// sidebar partial inject olunubsa, elementlər gec gəlir — ona görə burda yoxlayırıq
	const sidebar = document.getElementById('dashboardSidebar');
	const shell = document.querySelector('.dashboard-shell');

	if (!sidebar || !shell) return false;

	// 2 dəfə bind olmasın
	if (__pmSidebarBound) return true;
	__pmSidebarBound = true;

	// --- UI references (id lazım deyil)
	const quickSearch = document.getElementById('dashboardQuickSearch');
	const plusIcon = document.getElementById('dashboardPlusIcon');

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
		sidebar
			.querySelectorAll('.dashboard-panel')
			.forEach((p) =>
				p.classList.toggle(
					'active',
					p.getAttribute('data-dashboard-panel') === tabName,
				),
			);

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

	document.addEventListener('click', (e) => {
		const btn = e.target.closest('.dashboard-leftbar-btn[data-dashboard-tab]');
		if (!btn) return;

		const tab = btn.getAttribute('data-dashboard-tab');
		if (!tab) return;

		setActiveDashboardTab(tab);
	});

	document.addEventListener('click', (e) => {
		const treeBtn = e.target.closest('[data-dashboard-open]');
		if (!treeBtn) return;

		const id = treeBtn.getAttribute('data-dashboard-open');
		const panel = document.getElementById(id);
		if (!panel) return;

		const isHidden = panel.classList.contains('d-none');
		panel.classList.toggle('d-none', !isHidden);

		treeBtn.classList.toggle('is-open', isHidden);
		treeBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
	});

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
