// Theme Management - use data-theme attribute and active-theme storage
class ThemeManager {
  constructor() {
    this.storageKey = 'active-theme';
    this.theme = this.getStoredTheme() || 'default';
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.setupToggleButton();
  }

  getStoredTheme() {
    return localStorage.getItem(this.storageKey);
  }

  applyTheme(theme) {
    this.theme = theme;
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}

    // Maintain a Tailwind-compatible .dark class for utilities that rely on it
    if (String(theme).endsWith('-dark') || /(^|-)dark$/.test(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(this.storageKey, theme);
    this.updateToggleButton();
  }

  // Toggle between light and dark variant of the current base theme.
  toggleTheme() {
    var cur = this.theme || 'default';
    if (String(cur).endsWith('-dark')) {
      // switch to light/base
      var base = cur.replace(/-dark$/, '');
      // prefer explicit base (default) or base-light if exists — conservative: use base
      this.applyTheme(base);
    } else {
      // switch to dark variant
      this.applyTheme(cur + '-dark');
    }
  }

  setupToggleButton() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggleTheme());

    const mobile = document.getElementById('mobile-theme-toggle');
    if (mobile) mobile.addEventListener('click', () => this.toggleTheme());

    const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
    toggleBtns.forEach(btn => btn.addEventListener('click', () => this.toggleTheme()));
  }

  updateToggleButton() {
    const all = [].slice.call(document.querySelectorAll('#theme-toggle, [data-theme-toggle], #mobile-theme-toggle'));
    all.forEach(btn => this.updateSingleButton(btn));
  }

  updateSingleButton(toggleBtn) {
    // Support multiple icon naming conventions used across pages
    const sunIcon = toggleBtn.querySelector('.sun-icon') || toggleBtn.querySelector('.mobile-sun-icon');
    const moonIcon = toggleBtn.querySelector('.moon-icon') || toggleBtn.querySelector('.mobile-moon-icon');

    var isDark = String(this.theme).endsWith('-dark') || /(^|-)dark$/.test(this.theme);
    if (isDark) {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    }
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}
