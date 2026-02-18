const form = document.querySelector("form");
const emailInput = document.getElementById("workEmail");
const emailError = document.getElementById("email-error");

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const RESET_EMAIL_KEY = "resetEmail";
const NEXT_URL = "../html/resetPassword.html";

function setError(inputEl, errorEl, message) {
  errorEl.textContent = message || "";
  inputEl.classList.add("is-invalid");
  inputEl.classList.remove("is-valid");
}

function setValid(inputEl, errorEl) {
  errorEl.textContent = "";
  inputEl.classList.remove("is-invalid");
  inputEl.classList.add("is-valid");
}

function validateEmail() {
  const v = emailInput.value.trim();

  if (!v) {
    setError(emailInput, emailError, "Please enter your email address.");
    return false;
  }

  if (!EMAIL_RE.test(v)) {
    setError(
      emailInput,
      emailError,
      "Please enter a valid email address, like: yourname@email.com",
    );
    return false;
  }

  setValid(emailInput, emailError);
  return true;
}

function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function isRegistered(email) {
  const target = email.toLowerCase();

  const users = safeParse(USERS_KEY);
  if (Array.isArray(users) && users.length) {
    return users.some((u) => (u?.email || "").toLowerCase() === target);
  }

  const currentUser = safeParse(CURRENT_USER_KEY);
  if (currentUser && typeof currentUser === "object") {
    return (currentUser?.email || "").toLowerCase() === target;
  }

  return false;
}

emailInput.addEventListener("input", () => {
  const v = emailInput.value.trim();
  if (!v) {
    emailError.textContent = "";
    emailInput.classList.remove("is-valid", "is-invalid");
    return;
  }
  validateEmail();
});

emailInput.addEventListener("blur", validateEmail);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ok = validateEmail();
  if (!ok) return;

  const email = emailInput.value.trim();

  if (!isRegistered(email)) {
    setError(emailInput, emailError, "This email is not registered.");
    return;
  }

  localStorage.setItem(RESET_EMAIL_KEY, email);
  window.location.href = NEXT_URL;
});
