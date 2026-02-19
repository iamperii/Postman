const STORAGE_KEY = 'currentUser';
const MAX_INVITES = 5;

const HOME_URL = '../html/home.html';

const form = document.getElementById('teamForm');
const teamNameInput = document.getElementById('teamName');

const inviteInputsWrap = document.getElementById('inviteInputs');
const addMoreBtn = document.getElementById('addMoreBtn');
const inviteLimitMsg = document.getElementById('inviteLimitMsg');
const copyEl = document.querySelector('.copyInviteLink');

async function copyInviteLink() {
	const link = window.location.href;

	try {
		await navigator.clipboard.writeText(link);
	} catch {
		const input = document.createElement('input');
		input.value = link;
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		input.remove();
	}
}

if (copyEl) {
	copyEl.style.cursor = 'pointer';
	copyEl.addEventListener('click', copyInviteLink);
}

function getCurrentUser() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
	} catch {
		return null;
	}
}
function setDefaultTeamName() {
	const user = getCurrentUser();
	const username = (user?.name || '').trim();

	if (!teamNameInput) return;

	if (teamNameInput.value.trim()) return;

	if (username) teamNameInput.value = `${username}'s team`;
}

function isValidEmail(v) {
	return /^\S+@\S+\.\S+$/.test(v);
}

function ensureErrorEl(input) {
	let err = input.nextElementSibling;
	if (!err || !err.classList?.contains('field-error')) {
		err = document.createElement('div');
		err.className = 'field-error';
		err.textContent = '';
		input.insertAdjacentElement('afterend', err);
	}
	return err;
}

function validateInviteInput(input) {
	const v = input.value.trim();
	const err = ensureErrorEl(input);

	if (!v) {
		err.textContent = '';
		return true;
	}

	if (!isValidEmail(v)) {
		err.textContent =
			'Please enter a valid email address, like: yourname@email.com';
		return false;
	}

	err.textContent = '';
	return true;
}

function wireInviteValidation(input) {
	input.addEventListener('blur', () => validateInviteInput(input));
	input.addEventListener('input', () => {
		const err = ensureErrorEl(input);
		if (err.textContent) validateInviteInput(input);
	});
}

function getInviteInputs() {
	return Array.from(inviteInputsWrap.querySelectorAll('input.option-input'));
}

function updateInviteLimitUI() {
	const count = getInviteInputs().length;
	const reached = count >= MAX_INVITES;

	addMoreBtn.disabled = reached;
	inviteLimitMsg.style.display = reached ? 'inline' : 'none';
}

function addInviteInput() {
	const count = getInviteInputs().length;
	if (count >= MAX_INVITES) {
		updateInviteLimitUI();
		return;
	}

	const input = document.createElement('input');
	input.className = 'option-input form-control';
	input.placeholder = 'Email address';

	inviteInputsWrap.appendChild(input);
	wireInviteValidation(input);

	updateInviteLimitUI();
}

function validateAllInvites() {
	const inputs = getInviteInputs();
	let ok = true;
	for (const input of inputs) {
		const oneOk = validateInviteInput(input);
		if (!oneOk) ok = false;
	}
	return ok;
}

setDefaultTeamName();

getInviteInputs().forEach(wireInviteValidation);
updateInviteLimitUI();

addMoreBtn.addEventListener('click', addInviteInput);

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const okInvites = validateAllInvites();
	if (!okInvites) return;

	const user = getCurrentUser() || {};
	const teamName = teamNameInput.value.trim();

	const invites = getInviteInputs()
		.map((i) => i.value.trim())
		.filter(Boolean);

	const onboarding = {
		...user,
		teamName,
		invites,
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(onboarding));

	window.location.href = HOME_URL;
});
