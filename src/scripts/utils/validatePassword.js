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
