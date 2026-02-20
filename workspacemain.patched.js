const sectionTabs = document.querySelectorAll('[data-dashboard-section]');
const mainPanels = document.querySelectorAll('[data-dashboard-panel-main]');

sectionTabs.forEach((btn) => {
	btn.addEventListener('click', () => {
		const key = btn.getAttribute('data-dashboard-section');

		sectionTabs.forEach((b) => b.classList.remove('active'));
		btn.classList.add('active');

		mainPanels.forEach((p) => p.classList.remove('active'));
		document
			.querySelector(`[data-dashboard-panel-main="${key}"]`)
			?.classList.add('active');
	});
});

const rightbar = document.getElementById('rightbar');
const rightbarToggle = document.getElementById('rightbarToggle');

rightbarToggle?.addEventListener('click', () => {
	const isOpen = rightbar.classList.toggle('open');
	rightbarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

const aboutInput = document.getElementById('aboutSummary');
const aboutCount = document.getElementById('aboutCount');

function updateAboutCount() {
	if (!aboutInput || !aboutCount) return;
	aboutCount.textContent = String(aboutInput.value.length);
}

aboutInput?.addEventListener('input', updateAboutCount);
updateAboutCount();
