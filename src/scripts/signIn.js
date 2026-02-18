const form = document.querySelector("form");

const loginInput = document.getElementById("workEmail");
const passwordInput = document.getElementById("password");

const staySignedInInput = document.getElementById("staySignedIn");

const showPasswordBtn = document.querySelector(".showPasswordBtn");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const HOME_URL = "../html/home.html"; 
const STORAGE_KEY = "currentUser";

const signInErrorBox = document.querySelector(".signInError");

function showMessage(message, type = "error") {
  if (!signInErrorBox) return;

  signInErrorBox.textContent = message;
  signInErrorBox.classList.remove("error", "success");
  signInErrorBox.classList.add(type);
  signInErrorBox.style.display = "block";
}

function clearMessage() {
  if (!signInErrorBox) return;
  signInErrorBox.textContent = "";
  signInErrorBox.classList.remove("error", "success");
  signInErrorBox.style.display = "none";
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
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
    showPasswordBtn.textContent =
      passwordInput.type === "password" ? "Show" : "Hide";
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

  clearMessage(); 

  const ok1 = validateLogin();
  const ok2 = validatePassword();
  if (!ok1 || !ok2) return;

  const storedUser = getStoredUser();

  if (!storedUser) {
    showMessage("No account found. Please sign up first.", "error");
    return;
  }

  const isOk = loginMatches(storedUser, loginInput.value, passwordInput.value);

  if (!isOk) {
    showMessage("Incorrect email/username or password.", "error");
    return;
  }

  const sessionKey = "isLoggedIn";
  const remember = staySignedInInput?.checked ?? false;

  if (remember) localStorage.setItem(sessionKey, "true");
  else sessionStorage.setItem(sessionKey, "true");

  showMessage("Signed in successfully.", "success");

  window.location.href = HOME_URL;
});

