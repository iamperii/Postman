const form = document.querySelector("form");
const emailInput = document.getElementById("workEmail");
const emailError = document.getElementById("email-error");

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function setError(inputEl, errorEl, message) {
  errorEl.textContent = message || "";
  inputEl.classList.toggle("is-invalid", !!message);
  if (message) inputEl.classList.remove("is-valid");
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
    setError(emailInput, emailError, "Please enter a valid email address.");
    return false;
  }

  setValid(emailInput, emailError);
  return true;
}

emailInput.addEventListener("input", () => {
  const v = emailInput.value.trim();
  if (!v) {
    setError(emailInput, emailError, "");
    emailInput.classList.remove("is-valid", "is-invalid");
    return;
  }
  validateEmail();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ok = validateEmail();
  if (!ok) return;

  window.location.href = "../signin/signin.html";
});
