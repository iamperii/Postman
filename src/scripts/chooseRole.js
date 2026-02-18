const STORAGE_KEY = "currentUser";

const nameInput = document.querySelector(".name-input");
const roleButtons = document.querySelectorAll(".option-button");
const continueBtn = document.querySelector(".orangeBtn");

let selectedRole = "";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUserPatch(patch) {
  const prev = readUser();
  const next = { ...prev, ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function setContinueEnabled(enabled) {
  continueBtn.disabled = !enabled;
  continueBtn.classList.toggle("is-disabled", !enabled);
  continueBtn.setAttribute("aria-disabled", String(!enabled));
}

setContinueEnabled(false);

roleButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    roleButtons.forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");

    selectedRole = btn.textContent.trim();
    setContinueEnabled(true);
  });
});

(function loadFromStorage() {
  const user = readUser();

  if (user.name && nameInput) nameInput.value = user.name;

  if (user.role) {
    selectedRole = user.role;
    roleButtons.forEach((b) => {
      if (b.textContent.trim() === user.role) b.classList.add("is-selected");
    });
    setContinueEnabled(true);
  }
})();

continueBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!selectedRole) {
    setContinueEnabled(false);
    return;
  }

  const name = (nameInput?.value || "").trim();

  saveUserPatch({
    name,                 
    role: selectedRole,
    roleUpdatedAt: new Date().toISOString(),
  });

  window.location.href = "../html/setUpYourTeam.html";
});
