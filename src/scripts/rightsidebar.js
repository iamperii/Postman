document.addEventListener('DOMContentLoaded', () => {
	const toggleBtn = document.getElementById('rightbarToggle');
	const panel = document.getElementById('rightbarPanel');
	const rightbar = document.getElementById('rightbar');

	if (!toggleBtn || !panel || !rightbar) return;

	// Default: bağlı
	rightbar.classList.remove('open');
	toggleBtn.setAttribute('aria-expanded', 'false');

	toggleBtn.addEventListener('click', () => {
		rightbar.classList.toggle('open');
		const isOpen = rightbar.classList.contains('open');
		toggleBtn.setAttribute('aria-expanded', String(isOpen));
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			rightbar.classList.remove('open');
			toggleBtn.setAttribute('aria-expanded', 'false');
		}
	});
});
