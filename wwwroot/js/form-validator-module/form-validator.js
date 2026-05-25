/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           FormValidator — Attribute Based Validation        ║
 * ║  نسخه: 1.0.0  |  وابستگی: AmbModal                         ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * نحوه استفاده روی فرم:
 *   <form data-validate>
 *
 * نحوه استفاده روی input:
 *   <input data-rules="required|min:3|max:20|alpha" data-label="نام کاربری">
 *
 * قوانین پشتیبانی‌شده (با | از هم جدا می‌شوند):
 *   required          — الزامی
 *   min:N             — حداقل N کاراکتر
 *   max:N             — حداکثر N کاراکتر
 *   minVal:N          — حداقل مقدار عددی N
 *   maxVal:N          — حداکثر مقدار عددی N
 *   numeric           — فقط عدد
 *   alpha             — فقط حروف (فارسی/انگلیسی)
 *   alphanumeric      — حروف و عدد
 *   email             — فرمت ایمیل
 *   phone             — شماره موبایل ایرانی (09xxxxxxxxx)
 *   nationalId        — کد ملی ایرانی (10 رقم + الگوریتم)
 *   url               — فرمت URL
 *   date              — فرمت تاریخ (YYYY-MM-DD)
 *   checked           — برای checkbox/radio: باید انتخاب شده باشد
 *   match:#selector   — مقدار باید با المان دیگری برابر باشد
 *   regex:PATTERN      — regex دلخواه (کاراکتر | در regex با \| escape شود)
 *   noSpace           — فضای خالی مجاز نیست
 *   persian           — فقط حروف فارسی
 *   english           — فقط حروف انگلیسی
 *   strongPassword    — رمز قوی (حداقل 8 کاراکتر، عدد، حرف بزرگ، حرف کوچک)
 */

(function (global) {
    'use strict';

    // ─── پیام‌های پیش‌فرض ────────────────────────────────────────────────────
    const DEFAULT_MESSAGES = {
        required:       (label) => `فیلد «${label}» الزامی است`,
        min:            (label, n) => `«${label}» باید حداقل ${n} کاراکتر باشد`,
        max:            (label, n) => `«${label}» باید حداکثر ${n} کاراکتر باشد`,
        minVal:         (label, n) => `«${label}» باید حداقل ${n} باشد`,
        maxVal:         (label, n) => `«${label}» باید حداکثر ${n} باشد`,
        numeric:        (label) => `«${label}» باید فقط عدد باشد`,
        alpha:          (label) => `«${label}» باید فقط حروف باشد`,
        alphanumeric:   (label) => `«${label}» باید فقط حروف و عدد باشد`,
        email:          (label) => `فرمت ایمیل «${label}» صحیح نیست`,
        phone:          (label) => `شماره موبایل «${label}» معتبر نیست (مثال: 09123456789)`,
        nationalId:     (label) => `کد ملی «${label}» معتبر نیست`,
        url:            (label) => `آدرس URL «${label}» معتبر نیست`,
        date:           (label) => `فرمت تاریخ «${label}» صحیح نیست (YYYY-MM-DD)`,
        checked:        (label) => `«${label}» باید انتخاب شود`,
        match:          (label) => `«${label}» با مقدار مرجع مطابقت ندارد`,
        regex:          (label) => `مقدار «${label}» فرمت مجاز را ندارد`,
        noSpace:        (label) => `«${label}» نباید فضای خالی داشته باشد`,
        persian:        (label) => `«${label}» باید فقط حروف فارسی باشد`,
        english:        (label) => `«${label}» باید فقط حروف انگلیسی باشد`,
        strongPassword: (label) => `«${label}» باید حداقل 8 کاراکتر، شامل عدد، حرف بزرگ و کوچک انگلیسی باشد`,
    };

    // ─── موتور اعتبارسنجی ────────────────────────────────────────────────────

    /**
     * اعتبارسنجی یک قانون روی یک مقدار
     * @returns {string|null} پیام خطا یا null در صورت موفقیت
     */
    function validateRule(rule, value, el, label) {
        // جداسازی نام قانون و پارامتر
        const colonIdx = rule.indexOf(':');
        const name  = colonIdx === -1 ? rule : rule.slice(0, colonIdx);
        const param = colonIdx === -1 ? null  : rule.slice(colonIdx + 1);

        const val = (value || '').trim();

        switch (name) {
            case 'required':
                if (el.type === 'checkbox' || el.type === 'radio') {
                    if (!el.checked) return DEFAULT_MESSAGES.checked(label);
                } else {
                    if (!val) return DEFAULT_MESSAGES.required(label);
                }
                break;

            case 'min':
                if (val && val.length < parseInt(param, 10))
                    return DEFAULT_MESSAGES.min(label, param);
                break;

            case 'max':
                if (val && val.length > parseInt(param, 10))
                    return DEFAULT_MESSAGES.max(label, param);
                break;

            case 'minVal':
                if (val && parseFloat(val) < parseFloat(param))
                    return DEFAULT_MESSAGES.minVal(label, param);
                break;

            case 'maxVal':
                if (val && parseFloat(val) > parseFloat(param))
                    return DEFAULT_MESSAGES.maxVal(label, param);
                break;

            case 'numeric':
                if (val && !/^\d+(\.\d+)?$/.test(val))
                    return DEFAULT_MESSAGES.numeric(label);
                break;

            case 'alpha':
                if (val && !/^[\u0600-\u06FFa-zA-Z\s]+$/.test(val))
                    return DEFAULT_MESSAGES.alpha(label);
                break;

            case 'alphanumeric':
                if (val && !/^[\u0600-\u06FFa-zA-Z0-9\s]+$/.test(val))
                    return DEFAULT_MESSAGES.alphanumeric(label);
                break;

            case 'email':
                if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
                    return DEFAULT_MESSAGES.email(label);
                break;

            case 'phone':
                if (val && !/^09[0-9]{9}$/.test(val))
                    return DEFAULT_MESSAGES.phone(label);
                break;

            case 'nationalId':
                if (val && !_validateNationalId(val))
                    return DEFAULT_MESSAGES.nationalId(label);
                break;

            case 'url':
                if (val) {
                    try { new URL(val); }
                    catch { return DEFAULT_MESSAGES.url(label); }
                }
                break;

            case 'date':
                if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val))
                    return DEFAULT_MESSAGES.date(label);
                break;

            case 'checked':
                if (!el.checked) return DEFAULT_MESSAGES.checked(label);
                break;

            case 'match': {
                const target = document.querySelector(param);
                if (target && val !== target.value.trim())
                    return DEFAULT_MESSAGES.match(label);
                break;
            }

            case 'regex': {
                // param = pattern (کاراکتر \| برای pipe واقعی در regex)
                const pattern = param.replace(/\\\|/g, '|');
                try {
                    if (val && !new RegExp(pattern).test(val))
                        return DEFAULT_MESSAGES.regex(label);
                } catch (e) {
                    console.warn('[FormValidator] regex نامعتبر:', pattern, e);
                }
                break;
            }

            case 'noSpace':
                if (val && /\s/.test(val))
                    return DEFAULT_MESSAGES.noSpace(label);
                break;

            case 'persian':
                if (val && !/^[\u0600-\u06FF\s]+$/.test(val))
                    return DEFAULT_MESSAGES.persian(label);
                break;

            case 'english':
                if (val && !/^[a-zA-Z\s]+$/.test(val))
                    return DEFAULT_MESSAGES.english(label);
                break;

            case 'strongPassword':
                if (val && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val))
                    return DEFAULT_MESSAGES.strongPassword(label);
                break;

            case 'captcha': {
                // param = CSS selector of captcha img element (e.g. #captcha-img)
                // Only validate if a value has been entered (required rule handles empty case)
                if (!val) break;
                if (!global.CaptchaModule) {
                    console.warn('[FormValidator] CaptchaModule not found');
                    break;
                }
                const captchaImg = param ? document.querySelector(param) : null;
                if (captchaImg && !global.CaptchaModule.validate(captchaImg, val)) {
                    global.CaptchaModule.reload(captchaImg);
                    return `کد امنیتی «${label}» اشتباه است`;
                }
                break;
            }

            default:
                console.warn('[FormValidator] قانون ناشناخته:', name);
        }

        return null; // موفق
    }

    // ─── اعتبارسنجی کد ملی ───────────────────────────────────────────────────
    function _validateNationalId(code) {
        if (!/^\d{10}$/.test(code)) return false;
        if (/^(\d)\1{9}$/.test(code)) return false; // همه ارقام یکسان
        const digits = code.split('').map(Number);
        const check  = digits[9];
        const sum    = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);
        const rem    = sum % 11;
        return (rem < 2 && check === rem) || (rem >= 2 && check === 11 - rem);
    }

    // ─── اعتبارسنجی یک المان ─────────────────────────────────────────────────
    /**
     * @param {HTMLElement} el
     * @returns {string[]} آرایه خطاها
     */
    function validateElement(el) {
        const rulesAttr = el.getAttribute('data-rules');
        if (!rulesAttr) return [];

        const label  = el.getAttribute('data-label') || el.name || el.id || 'فیلد';
        const value  = el.value;
        const errors = [];

        // جداسازی قوانین با | (به جز \| که escape شده)
        const rules = rulesAttr.split(/(?<!\\)\|/);

        for (const rule of rules) {
            const trimmed = rule.trim();
            if (!trimmed) continue;
            const msg = validateRule(trimmed, value, el, label);
            if (msg) errors.push(msg);
        }

        return errors;
    }

    // ─── اعتبارسنجی کل فرم ───────────────────────────────────────────────────
    /**
     * @param {HTMLFormElement} form
     * @returns {{ valid: boolean, errors: string[] }}
     */
    function validateForm(form) {
        const fields = form.querySelectorAll('[data-rules]');
        const allErrors = [];

        fields.forEach(el => {
            const errs = validateElement(el);
            allErrors.push(...errs);

            // نمایش inline error (اختیاری)
            _updateInlineError(el, errs);
        });

        return { valid: allErrors.length === 0, errors: allErrors };
    }

    // ─── نمایش خطای inline ───────────────────────────────────────────────────
function _updateInlineError(el, errors) {
    const safeKey = (el.id || el.name || '').replace(/[^a-zA-Z0-9_-]/g, '_') || Math.random().toString(36).slice(2);
    const errorId = 'fv-err-' + safeKey;
    let errorEl = document.getElementById(errorId);

    if (errors.length > 0) {
        el.classList.add('fv-invalid');
        el.classList.remove('fv-valid');

        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.id = errorId;
            errorEl.className = 'fv-error-msg';
            errorEl.style.cssText = 'color:#dc2626;font-size:0.7rem;font-weight:500;margin-top:0.25rem;display:block;line-height:1.2;';

            // Find the outermost wrapper div that is a direct child of the form's space-y container.
            // Strategy: go up from el until parent is the <form> or has data-validate, then insert after that node.
            let anchor = el;
            while (anchor.parentElement && anchor.parentElement.tagName !== 'FORM' && !anchor.parentElement.hasAttribute('data-validate')) {
                anchor = anchor.parentElement;
            }
            // Insert error after anchor (sibling in the form's direct children)
            anchor.parentNode.insertBefore(errorEl, anchor.nextSibling);
        }
        errorEl.textContent = errors[0];
        errorEl.style.display = 'block';
    } else {
        el.classList.remove('fv-invalid');
        el.classList.add('fv-valid');
        if (errorEl) errorEl.style.display = 'none';
    }
}

    // ─── استایل inline ───────────────────────────────────────────────────────
function _injectInlineStyles() {
    const id = 'fv-inline-styles';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
        .fv-invalid {
            border-color: #dc2626 !important;
            box-shadow: 0 0 0 2px rgba(220,38,38,.15) !important;
        }
        .fv-valid {
            border-color: #16a34a !important;
        }
        .fv-error-msg {
            animation: fvSlideIn 0.2s ease-out;
        }
        @keyframes fvSlideIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(s);
}
    // ─── Auto-init روی فرم‌های data-validate ─────────────────────────────────
    function init() {
        _injectInlineStyles();

        document.querySelectorAll('form[data-validate]').forEach(form => {
            // جلوگیری از init مجدد
            if (form._fvInitialized) return;
            form._fvInitialized = true;

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const result = validateForm(form);

                             if (!result.valid) {
                    // Show errors via AmbModal (libs/ambmodal API)
                    if (global.AmbModal) {
                        const title = form.getAttribute('data-validate-title') || 'لطفاً خطاها را برطرف کنید';
                        // استفاده از Shortcut جدید به‌جای alert قدیمی
                        global.AmbModal.error(title, result.errors, { rtl: true, btnText: 'باشه' });
                    } else {
                        console.warn('[FormValidator] AmbModal not found. Errors:', result.errors);
                        window.alert(result.errors.join('\n'));
                    }

                    // Focus first invalid field
                    const firstInvalid = form.querySelector('.fv-invalid');
                    if (firstInvalid) firstInvalid.focus();
                } else {
                    // Dispatch success event — page-level code listens to 'fv:valid'
                    form.dispatchEvent(new CustomEvent('fv:valid', { bubbles: true }));
                }
            });

            // اعتبارسنجی real-time روی blur
            form.querySelectorAll('[data-rules]').forEach(el => {
                el.addEventListener('blur', () => {
                    const errs = validateElement(el);
                    _updateInlineError(el, errs);
                });
                el.addEventListener('input', () => {
                    // پاک کردن خطا هنگام تایپ
                    if (el.classList.contains('fv-invalid')) {
                        const errs = validateElement(el);
                        _updateInlineError(el, errs);
                    }
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ─── API عمومی ───────────────────────────────────────────────────────────
    global.FormValidator = {
        /** init دستی */
        init,
        /** اعتبارسنجی یک فرم */
        validateForm,
        /** اعتبارسنجی یک المان */
        validateElement,
        /** اضافه کردن پیام سفارشی */
        setMessage: (rule, fn) => { DEFAULT_MESSAGES[rule] = fn; },
    };

})(window);
