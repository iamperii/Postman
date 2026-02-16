const languageSwitcher = document.getElementById('language-switcher');
let translations = {};

async function setLanguage(newLocale) {
  localStorage.setItem('language', newLocale);
  await fetchTranslations(newLocale);
  translatePage();
}

async function fetchTranslations(newLocale) {
  const response = await fetch(`./lang/${newLocale}.json`);
  translations = await response.json();
}

function translatePage() {
  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });
}

languageSwitcher.addEventListener('change', (event) => {
  setLanguage(event.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
  const userLocale = localStorage.getItem('language') || 'en';
  languageSwitcher.value = userLocale;
  setLanguage(userLocale);
});
