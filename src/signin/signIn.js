
const form = document.querySelector("form");

const loginInput = document.getElementById("workEmail"); 
const passwordInput = document.getElementById("password");

const staySignedInInput = document.getElementById("staySignedIn");

const showPasswordBtn = document.querySelector(".showPasswordBtn");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const HOME_URL = "../home/home.html";
const STORAGE_KEY = "currentUser";   

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

  requestAnimationFrame(() => {
    el.style.opacity = "1";
  });

  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 200);
  }, 2400);
}

function validateLogin() {
  const v = loginInput.value.trim();
  if (!v) {
    emailError.textContent = "Please enter your email or username.";
    return false;
  }
  if (v.includes("@") && !/^\S+@\S+\.\S+$/.test(v)) {
    emailError.textContent = "Please enter a valid email address.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validatePassword() {
  const v = passwordInput.value.trim();
  if (v.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters.";
    return false;
  }
  passwordError.textContent = "";
  return true;
}

if (passwordInput && showPasswordBtn) {
  passwordInput.addEventListener("focus", () => {
    showPasswordBtn.style.display = "inline";
  });

  showPasswordBtn.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    showPasswordBtn.textContent =
      passwordInput.type === "password" ? "Show password" : "Hide password";
  });
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function loginMatches(storedUser, loginValue, passwordValue) {
  const login = loginValue.trim();
  const pass = passwordValue;

  return (
    (login === storedUser.email || login === storedUser.username) &&
    pass === storedUser.password
  );
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ok1 = validateLogin();
  const ok2 = validatePassword();
  if (!ok1 || !ok2) return;

  const storedUser = getStoredUser();

  if (!storedUser) {
    showToast("No account found. Please sign up first.", "error");
    return;
  }

  const isOk = loginMatches(storedUser, loginInput.value, passwordInput.value);

  if (!isOk) {
    showToast("Incorrect email/username or password.", "error");
    return;
  }

  const sessionKey = "isLoggedIn";
  const remember = staySignedInInput?.checked ?? false;

  if (remember) {
    localStorage.setItem(sessionKey, "true");
  } else {
    sessionStorage.setItem(sessionKey, "true");
  }

  showToast("Signed in successfully.", "success");

  window.location.href = HOME_URL;
});
