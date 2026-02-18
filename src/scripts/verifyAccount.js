const STORAGE_KEY = "currentUser";
const TEST_CODE = "123456";
const SIGN_IN = "../html/signin.html";

const signedEmailEl = document.querySelector(".signedEmail");
const form = document.querySelector(".form");
const codeInput = document.getElementById("digitCode");
const errorEl = document.getElementById("email-error");
const verifyBtn = document.querySelector(".orangeBtn");

const resendLink = document.querySelector(".resendLink");
const resendTimerEl = document.querySelector(".resendTimer");

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
    showToast("No signed email found. Please sign up again.", "error");
    setTimeout(() => (window.location.href = SIGN_IN), 100);
    return;
  }
  signedEmailEl.textContent = user.email;

  verifyBtn.disabled = true;

  setResendDisabled(false);
})();

codeInput.addEventListener("input", () => {
  const cleaned = normalizeDigits(codeInput.value);
  if (codeInput.value !== cleaned) codeInput.value = cleaned;

  setError("");
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

  if (code.length !== 6) {
    setError("Please enter the 6 digit code.");
    showToast("Code must be 6 digits.", "error");
    return;
  }

  if (code === TEST_CODE) {
    setError("");
    showToast("Verified successfully.", "success");

    const user = getCurrentUser();
    if (user) {
      user.isVerified = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    setTimeout(() => {
      window.location.href = SIGN_IN;
    }, 400);

    return;
  }

  setError("Wrong code. Try again or resend the code.");
  showToast("Wrong verification code.", "error");

  startResendCooldown(30);
});

resendLink?.addEventListener("click", (e) => {
  e.preventDefault();

  if (Date.now() < resendLockedUntil) return;

  showToast("Verification code resent (test).", "success");

  startResendCooldown(30);
});
