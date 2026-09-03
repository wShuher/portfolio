/**
 * Internationalization (i18n) Engine
 * Handles automatic device language detection, manual selection, and dynamic DOM translation.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_language';
  const SUPPORTED_LANGS = ['en', 'ja'];
  const DEFAULT_LANG = 'en';

  /**
   * Resolves nested object key (e.g. "hero.greeting" -> obj.hero.greeting)
   */
  function getNestedTranslation(obj, path) {
    if (!obj || !path) return null;
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      if (current[parts[i]] === undefined || current[parts[i]] === null) {
        return null;
      }
      current = current[parts[i]];
    }
    return current;
  }

  /**
   * Detects the user's device/browser language.
   * If Japanese ('ja', 'ja-JP', etc.) -> 'ja'
   * Otherwise ('en', 'es', 'zh', etc.) -> 'en'
   */
  function detectDeviceLanguage() {
    try {
      const candidates = [];
      if (navigator.languages && Array.isArray(navigator.languages)) {
        candidates.push(...navigator.languages);
      }
      if (navigator.language) {
        candidates.push(navigator.language);
      }
      if (navigator.userLanguage) {
        candidates.push(navigator.userLanguage);
      }

      for (let i = 0; i < candidates.length; i++) {
        const lang = String(candidates[i] || '').toLowerCase().trim();
        if (lang.startsWith('ja')) {
          return 'ja';
        }
      }
    } catch (e) {
      console.warn('Language detection error:', e);
    }
    return DEFAULT_LANG;
  }

  /**
   * Retrieves the current active language:
   * 1. Stored user preference in localStorage (if valid)
   * 2. Device language detection
   */
  function getPreferredLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) {
        return stored;
      }
    } catch (e) {
      // localStorage might be unavailable or restricted
    }
    return detectDeviceLanguage();
  }

  /**
   * Applies the selected language to the DOM.
   */
  function applyLanguage(lang) {
    const activeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    document.documentElement.lang = activeLang;

    const transObj = (typeof translations !== 'undefined' && translations) ? translations : (window.portfolioTranslations || window.translations);
    if (!transObj || !transObj[activeLang]) {
      return activeLang;
    }

    const dict = transObj[activeLang];

    // Determine active page key
    const pageKey = (document.body && document.body.dataset && document.body.dataset.page)
      ? document.body.dataset.page
      : (function () {
          const path = window.location.pathname || '';
          const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '').toLowerCase();
          return filename || 'index';
        })();

    // Update document title and description
    let pageMeta = null;
    if (dict.pages && dict.pages[pageKey] && dict.pages[pageKey].meta) {
      pageMeta = dict.pages[pageKey].meta;
    } else if (dict.meta) {
      const isIndex = !window.location.pathname || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
      if (isIndex) {
        pageMeta = dict.meta;
      }
    }

    if (pageMeta) {
      if (pageMeta.title) {
        document.title = pageMeta.title;
      }
      if (pageMeta.description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', pageMeta.description);
        }
      }
    }

    // Update text content / innerHTML
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const val = getNestedTranslation(dict, key);
      if (val !== null && val !== undefined) {
        el.innerHTML = val;
      }
    });

    // Update form placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getNestedTranslation(dict, key);
      if (val !== null && val !== undefined) {
        el.setAttribute('placeholder', val);
      }
    });

    // Update titles
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      const val = getNestedTranslation(dict, key);
      if (val !== null && val !== undefined) {
        el.setAttribute('title', val);
      }
    });

    // Update aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
    ariaElements.forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria-label');
      const val = getNestedTranslation(dict, key);
      if (val !== null && val !== undefined) {
        el.setAttribute('aria-label', val);
      }
    });

    // Update switcher buttons UI
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(function (btn) {
      const targetLang = btn.getAttribute('data-lang-set');
      if (targetLang === activeLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Trigger Typed.js re-init if available
    if (typeof window.initTyped === 'function') {
      window.initTyped(activeLang);
    }

    // Broadcast language change event
    try {
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: activeLang }
      }));
    } catch (e) {
      // IE fallback if necessary
    }

    return activeLang;
  }

  /**
   * Sets and saves the user language preference.
   */
  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
    return applyLanguage(lang);
  }

  // Bind click listeners for language switcher buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.lang-btn');
    if (btn) {
      const targetLang = btn.getAttribute('data-lang-set');
      if (targetLang && SUPPORTED_LANGS.includes(targetLang)) {
        e.preventDefault();
        setLanguage(targetLang);
      }
    }
  });

  // Run on DOM ready
  function init() {
    const currentLang = getPreferredLanguage();
    applyLanguage(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global i18n object
  window.portfolioI18n = {
    init: init,
    getLanguage: getPreferredLanguage,
    setLanguage: setLanguage,
    applyLanguage: applyLanguage,
    detectDeviceLanguage: detectDeviceLanguage
  };
})();
