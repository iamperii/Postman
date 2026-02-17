const form = document.querySelector("form");
const showPasswordBtn = document.querySelector(".showPasswordBtn");

const mailInput = document.getElementById("workEmail");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("name-error");
const mailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const STORAGE_KEY = "currentUser";
const SIGNIN_URL = "../signin/signin.html";

let usernameManuallyEdited = false;

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

mailInput.addEventListener("input", () => {
  if (usernameManuallyEdited) return;
  usernameInput.value = (mailInput.value.split("@")[0] || "").trim();
  usernameError.textContent = "";
});

usernameInput.addEventListener("input", () => {
  usernameManuallyEdited = true;
  usernameError.textContent = "";
});

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

    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    updateShowBtnText();

    passwordInput.focus();
  });
}

function validateEmail() {
  const v = mailInput.value.trim();
  const ok = /^\S+@\S+\.\S+$/.test(v);
  if (!ok) {
    mailError.textContent =
      "Please enter a valid email address, like: yourname@email.com";
    return false;
  }
  mailError.textContent = "";
  return true;
}

function validateUsername() {
  const v = usernameInput.value.trim();

  if (!v) {
    usernameError.textContent = "You must write a username.";
    return false;
  }

  const onlyDigits = /^\d+$/.test(v);
  if (onlyDigits) {
    usernameError.textContent = "Username cannot be only numbers.";
    return false;
  }

  usernameError.textContent = "";
  return true;
}

function validatePassword() {
  const v = passwordInput.value.trim();

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

function validateUsernamePasswordnotSame() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) return true;

  if (username.toLowerCase() === password.toLowerCase()) {
    passwordError.textContent = "Password and username cannot be the same.";
    return false;
  }
  return true;
}
mailInput.addEventListener("blur", validateEmail);
usernameInput.addEventListener("blur", () => {
  (validateUsername(), validateUsernamePasswordnotSame());
});
passwordInput.addEventListener("blur", () => {
  (validatePassword(), validateUsernamePasswordnotSame());
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const okEmail = validateEmail();
  const okUsername = validateUsername();
  const okPassword = validatePassword();
  const okNotSame = validateUsernamePasswordnotSame();

  if (!okEmail || !okUsername || !okPassword || !okNotSame) {
    showToast("Please fix the errors in the form.", "error");
    return;
  }

  const currentUser = {
    email: mailInput.value.trim(),
    username: usernameInput.value.trim(),
    password: passwordInput.value,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  showToast("Account created successfully.", "success");

  setTimeout(() => {
    window.location.href = SIGNIN_URL;
  }, 400);
});
