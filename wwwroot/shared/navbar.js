// Navigation Bar Management - نسخه Hover برای User Menu
class NavBarManager {
  constructor() {
    this.userMenuButton = null;
    this.userMenu = null;
    this.mobileMenuButton = null;
    this.mobileMenuPanel = null;
    this.mobileProfileButton = null;
    this.mobileProfilePanel = null;
    this.mobileMenuOverlay = null;

    this.isMobileMenuOpen = false;
    this.isMobileProfileOpen = false;

    this.init();
  }

  init() {
    this.userMenuButton = document.getElementById('user-menu-button');
    this.userMenu = document.getElementById('user-menu');

    this.mobileMenuButton = document.getElementById('mobile-menu-button');
    this.mobileMenuPanel = document.getElementById('mobile-menu-panel');
    this.mobileProfileButton = document.getElementById('mobile-profile-button');
    this.mobileProfilePanel = document.getElementById('mobile-profile-panel');
    this.mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    this.setupEventListeners();
  }

  setupEventListeners() {
    // ====================== Desktop User Menu - فقط Hover ======================
    if (this.userMenuButton && this.userMenu) {
      // باز شدن با Hover
      this.userMenuButton.addEventListener('mouseenter', () => {
        this.openUserMenu();
      });

      // بستن وقتی موس از هر دو عنصر خارج شد
      const closeOnMouseLeave = () => {
        setTimeout(() => {
          if (!this.userMenuButton.matches(':hover') && 
              !this.userMenu.matches(':hover')) {
            this.closeUserMenu();
          }
        }, 150); // کمی تأخیر برای تجربه بهتر
      };

      this.userMenuButton.addEventListener('mouseleave', closeOnMouseLeave);
      this.userMenu.addEventListener('mouseleave', closeOnMouseLeave);

      // همچنان پشتیبانی از Escape Key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeUserMenu();
        }
      });
    }

    // ====================== Mobile Menu ======================
    if (this.mobileMenuButton && this.mobileMenuPanel) {
      this.mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeMobileProfile();
        this.toggleMobileMenu();
      });
    }

    // Overlay
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
        this.closeMobileProfile();
      });
    }

    // ====================== Mobile Profile ======================
    if (this.mobileProfileButton && this.mobileProfilePanel) {
      this.mobileProfileButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeMobileMenu();
        this.toggleMobileProfile();
      });
    }

    // Escape for mobile too
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeMobileProfile();
      }
    });

    // Mobile Theme
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    if (mobileThemeToggle && window.ThemeManager) {
      mobileThemeToggle.addEventListener('click', () => window.ThemeManager.toggle());
    }
  }

  // ====================== User Menu (Hover Only) ======================
  openUserMenu() {
    this.userMenu.classList.remove('hidden');
    this.userMenu.setAttribute('aria-hidden', 'false');
    this.userMenuButton.setAttribute('aria-expanded', 'true');
    
    setTimeout(() => {
      this.userMenu.classList.add('animate-fade-in');
    }, 10);
  }

  closeUserMenu() {
    this.userMenu.classList.add('hidden');
    this.userMenu.setAttribute('aria-hidden', 'true');
    this.userMenuButton.setAttribute('aria-expanded', 'false');
    this.userMenu.classList.remove('animate-fade-in');
  }

  // ====================== Mobile Menu ======================
  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    if (this.isMobileMenuOpen) return;
    this.isMobileMenuOpen = true;

    if (this.mobileMenuOverlay) this.mobileMenuOverlay.classList.remove('hidden');
    this.mobileMenuPanel.classList.remove('translate-y-full');
    this.mobileMenuPanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    if (!this.isMobileMenuOpen) return;
    this.isMobileMenuOpen = false;

    if (this.mobileMenuOverlay) this.mobileMenuOverlay.classList.add('hidden');
    this.mobileMenuPanel.classList.add('translate-y-full');
    this.mobileMenuPanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ====================== Mobile Profile ======================
  toggleMobileProfile() {
    if (this.isMobileProfileOpen) {
      this.closeMobileProfile();
    } else {
      this.openMobileProfile();
    }
  }

  openMobileProfile() {
    if (this.isMobileProfileOpen || !this.mobileProfilePanel) return;
    this.isMobileProfileOpen = true;

    if (this.mobileMenuOverlay) this.mobileMenuOverlay.classList.remove('hidden');
    this.mobileProfilePanel.classList.remove('translate-y-full');
    this.mobileProfilePanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeMobileProfile() {
    if (!this.isMobileProfileOpen || !this.mobileProfilePanel) return;
    this.isMobileProfileOpen = false;

    if (this.mobileMenuOverlay) this.mobileMenuOverlay.classList.add('hidden');
    this.mobileProfilePanel.classList.add('translate-y-full');
    this.mobileProfilePanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// ====================== Initialize Only Once ======================
if (!window.NavBarManagerInstance) {
  const initialize = () => {
    window.NavBarManagerInstance = new NavBarManager();
    window.NavBarManager = window.NavBarManagerInstance;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}