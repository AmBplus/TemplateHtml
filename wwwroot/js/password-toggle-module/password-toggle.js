/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           Password Toggle Module - Attribute Based          ║
 * ║  نسخه: 1.0.0                                                ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * استفاده:
 *   <button data-password-toggle
 *           data-password-target="#password"
 *           data-password-icon-show="#eye-open"
 *           data-password-icon-hide="#eye-closed">
 *   </button>
 */

(function (global) {
    'use strict';

    /**
     * فعال‌سازی toggle برای یک دکمه
     * @param {HTMLElement} btn
     */
    function initToggle(btn) {
        const targetSel  = btn.getAttribute('data-password-target');
        const showSel    = btn.getAttribute('data-password-icon-show');
        const hideSel    = btn.getAttribute('data-password-icon-hide');

        if (!targetSel) {
            console.warn('[PasswordToggle] data-password-target تعریف نشده است.', btn);
            return;
        }

        const input   = document.querySelector(targetSel);
        const iconShow = showSel ? document.querySelector(showSel) : null;
        const iconHide = hideSel ? document.querySelector(hideSel) : null;

        if (!input) {
            console.warn('[PasswordToggle] المان input پیدا نشد:', targetSel);
            return;
        }

        btn.addEventListener('click', function () {
            const isPassword = input.type === 'password';

            // تغییر نوع input
            input.type = isPassword ? 'text' : 'password';

            // تغییر آیکون‌ها
            if (iconShow) iconShow.classList.toggle('hidden', isPassword);
            if (iconHide) iconHide.classList.toggle('hidden', !isPassword);

            // aria-label برای دسترسی‌پذیری
            btn.setAttribute('aria-label', isPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور');
        });
    }

    // ─── Auto-init ────────────────────────────────────────────────────────────
    function init() {
        document.querySelectorAll('[data-password-toggle]').forEach(initToggle);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ─── API عمومی ───────────────────────────────────────────────────────────
    global.PasswordToggle = {
        /** init دستی برای المان‌هایی که بعداً به DOM اضافه شدند */
        init: init,
        /** فعال‌سازی یک دکمه خاص */
        initToggle: initToggle,
    };

})(window);
