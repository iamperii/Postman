const signInBtn = document.querySelector(".signInBtn");

const mailInput = document.getElementById("workEmail");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("name-error");
const mailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

let usernameManuallyEdited = false;

mailInput.addEventListener("input", () => {
  if (usernameManuallyEdited) return;
  usernameInput.value = (mailInput.value.split("@")[0] || "").trim();
  usernameError.innerText = "";
});

usernameInput.addEventListener("input", () => {
  usernameManuallyEdited = true;
  usernameError.innerText = "";
});

function validateEmail() {
  const v = mailInput.value.trim();
  if (v.length === 0 || !v.includes("@")) {
    mailError.innerText =
      "Please enter a valid email address, like: yourname@email.com";
    mailError.style.display = "inline";
    return false;
  }
  mailError.innerText = "";
  return true;
}

function validateUsername() {
  const v = usernameInput.value.trim();
  if (v.length === 0) {
    usernameError.innerText = "You must write a username";
    usernameError.style.display = "inline";

    return false;
  }
  usernameError.innerText = "";
  return true;
}

function validatePassword() {
  const v = passwordInput.value.trim();
  if (v.length < 8) {
    passwordError.innerText =
      "Use a password that is at least 8 characters – it helps keep your account secure.";
    passwordError.style.display = "inline";
    return false;
  }
  passwordError.innerText = "";
  return true;
}

mailInput.addEventListener("blur", validateEmail);
usernameInput.addEventListener("blur", validateUsername);
passwordInput.addEventListener("blur", validatePassword);

signInBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const okEmail = validateEmail();
  const okUsername = validateUsername();
  const okPassword = validatePassword();

  if (!okEmail || !okUsername || !okPassword) return;

  const currentUser = {
    email: mailInput.value.trim(),
    username: usernameInput.value.trim(),
    password: passwordInput.value,
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  // console.log("clicked");
  console.log(currentUser);
});
