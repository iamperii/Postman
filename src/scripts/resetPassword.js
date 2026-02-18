const form = document.querySelector("form");
const showPasswordBtn = document.querySelector(".showPasswordBtn");
const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("password-error");

const STORAGE_KEY = "currentUser";
const SIGNIN_URL = "../html/signin.html"; 

function showToast(message, type = "error") {
  const el = document.createElement("div");
  el.textContent = message;

  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "24px";
  el.style.transform = "translateX(-50%)";
  el.style.padding = "12px 14px";
  el.style.borderRadius = "10px";
  el.style.fontSize = "14px";
  el.style.zIndex = "9999";
  el.style.maxWidth = "90vw";
  el.style.boxShadow = "0 10px 30px rgba(0,0,0,.15)";
  el.style.border = "1px solid rgba(0,0,0,.08)";
  el.style.background = type === "success" ? "#eaffea" : "#ffecec";
  el.style.color = "#111";

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}

if (showPasswordBtn && passwordInput) {
  showPasswordBtn.style.display = "none";
  showPasswordBtn.style.cursor = "pointer";
  showPasswordBtn.style.userSelect = "none";

  const updateShowBtnText = () => {
    showPasswordBtn.textContent =
      passwordInput.type === "password" ? "Show" : "Hide";
  };

  passwordInput.addEventListener("focus", () => {
    showPasswordBtn.style.display = "inline";
    updateShowBtnText();
  });

  passwordInput.addEventListener("blur", () => {
    setTimeout(() => {
      showPasswordBtn.style.display = "none";
    }, 120);
  });

  showPasswordBtn.addEventListener("mousedown", (e) => e.preventDefault());

  showPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    updateShowBtnText();
    passwordInput.focus();
  });
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function validatePassword() {
  const v = passwordInput.value.trim();

  if (!v) {
    passwordError.textContent = "Please enter a new password.";
    return false;
  }

  if (v.length < 8) {
    passwordError.textContent = "Use a password that is at least 8 characters.";
    return false;
  }

  const hasUpperLowerNumber = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(v);
  if (!hasUpperLowerNumber) {
    passwordError.textContent =
      "Password must include uppercase, lowercase letters and numbers.";
    return false;
  }

  passwordError.textContent = "";
  return true;
}

passwordInput.addEventListener("blur", validatePassword);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const okPassword = validatePassword();
  if (!okPassword) {
    showToast("Please fix the errors in the form.", "error");
    return;
  }

  const storedUser = getStoredUser();
  if (!storedUser) {
    showToast("No account found. Please sign up first.", "error");
    return;
  }

  storedUser.password = passwordInput.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUser));

  sessionStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isLoggedIn");

  showToast("Password reset successfully.", "success");

  setTimeout(() => {
    window.location.href = SIGNIN_URL;
  }, 400);
});
