import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .init(
    {
      fallbackLng: 'en',
      debug: true,
      backend: {
        // для загрузки на github pages изменить loadpath на этот loadPath: 'locales/{{lng}}/translation-{{lng}}.json'
        loadPath: '../locales/{{lng}}/translation-{{lng}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'i18nextLng',
      },
    },
    () => {
      document.getElementById('output').innerHTML = i18next.t('key');
      document.querySelector('.header__change-language-title').innerHTML =
        i18next.t('action');
    }
  );

const buttonEnglish = document.querySelector(
  '.header__change-language-button--english'
);
const buttonSpanish = document.querySelector(
  '.header__change-language-button--spanish'
);

function changeLanguage(lng) {
  i18next.changeLanguage(lng, () => {
    updateContent();
    document.documentElement.setAttribute('lang', lng);
  });
}

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18next.t(key);
  });
}

buttonEnglish.addEventListener('click', () => {
  if (
    buttonSpanish.classList.contains('header__change-language-button--active')
  ) {
    buttonSpanish.classList.remove('header__change-language-button--active');
    buttonEnglish.classList.add('header__change-language-button--active');
  }
  changeLanguage('en');
});
buttonSpanish.addEventListener('click', () => {
  if (
    buttonEnglish.classList.contains('header__change-language-button--active')
  ) {
    buttonEnglish.classList.remove('header__change-language-button--active');
    buttonSpanish.classList.add('header__change-language-button--active');
  }
  changeLanguage('es');
});
