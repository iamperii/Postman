const STORAGE_KEY = "currentUser";
const TEST_CODE = "123456";
const CHOOSE_ROLE = "../html/chooseRole.html";

const signedEmailEl = document.querySelector(".signedEmail");
const form = document.querySelector(".form");
const codeInput = document.getElementById("digitCode");
const errorEl = document.getElementById("email-error");
const verifyBtn = document.querySelector(".orangeBtn");
const signInErrorBox = document.querySelector(".signInError");

const resendLink = document.querySelector(".resendLink");
const resendTimerEl = document.querySelector(".resendTimer");

const pageLoader = document.querySelector(".pageLoader");

function showLoader() {
  pageLoader?.classList.add("is-show");
  pageLoader?.setAttribute("aria-hidden", "false");
}

function hideLoader() {
  pageLoader?.classList.remove("is-show");
  pageLoader?.setAttribute("aria-hidden", "true");
}

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

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setError(msg = "") {
  if (errorEl) errorEl.textContent = msg;
}

function normalizeDigits(value) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function setVerifyEnabled() {
  const v = codeInput.value.trim();
  verifyBtn.disabled = v.length !== 6;
}

let resendInterval = null;
let resendLockedUntil = 0;

function setResendDisabled(disabled) {
  if (!resendLink) return;

  if (disabled) {
    resendLink.classList.add("disabled");
    resendLink.setAttribute("aria-disabled", "true");
    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.6";
  } else {
    resendLink.classList.remove("disabled");
    resendLink.removeAttribute("aria-disabled");
    resendLink.style.pointerEvents = "auto";
    resendLink.style.opacity = "1";
    if (resendTimerEl) resendTimerEl.textContent = "";
  }
}

function startResendCooldown(seconds = 30) {
  resendLockedUntil = Date.now() + seconds * 1000;
  setResendDisabled(true);

  if (resendInterval) clearInterval(resendInterval);

  const tick = () => {
    const leftMs = resendLockedUntil - Date.now();
    const left = Math.max(0, Math.ceil(leftMs / 1000));

    if (resendTimerEl) {
      resendTimerEl.textContent = left > 0 ? `(${left}s)` : "";
    }

    if (left <= 0) {
      clearInterval(resendInterval);
      resendInterval = null;
      setResendDisabled(false);
    }
  };

  tick();
  resendInterval = setInterval(tick, 250);
}

(function init() {
  const user = getCurrentUser();
  if (!user?.email) {
    showMessage("No signed email found. Please sign up again.", "error");
    setTimeout(() => (window.location.href = CHOOSE_ROLE), 300);
    return;
  }
  signedEmailEl.textContent = user.email;

  verifyBtn.disabled = true;
  setResendDisabled(false);
  clearMessage();
})();

codeInput.addEventListener("input", () => {
  const cleaned = normalizeDigits(codeInput.value);
  if (codeInput.value !== cleaned) codeInput.value = cleaned;

  setError("");
  clearMessage();
  setVerifyEnabled();
});

codeInput.addEventListener("paste", () => {
  setTimeout(() => {
    codeInput.value = normalizeDigits(codeInput.value);
    setVerifyEnabled();
  }, 0);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const code = codeInput.value.trim();
  clearMessage();

  if (code.length !== 6) {
    setError("Please enter the 6 digit code.");
    showMessage("Code must be 6 digits.", "error");
    return;
  }

  if (code === TEST_CODE) {
    setError("");

    const user = getCurrentUser();
    if (user) {
      user.isVerified = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    showLoader();

    setTimeout(() => {
      window.location.href = CHOOSE_ROLE;
    }, 700);

    return;
  }

  setError("Wrong code. Try again or resend the code.");
  showMessage("Wrong verification code.", "error");

  startResendCooldown(30);
});

resendLink?.addEventListener("click", (e) => {
  e.preventDefault();

  if (Date.now() < resendLockedUntil) return;

  clearMessage();
  showMessage("Verification code resent (test).", "success");

  startResendCooldown(30);
});
