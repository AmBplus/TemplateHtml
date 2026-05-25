/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              Captcha Module - Attribute Based               ║
 * ║  نسخه: 2.0.0  |  Compatible with ASP.NET Core API          ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * استفاده:
 *   <img data-captcha-img
 *        data-captcha-token-input="#captcha-input"
 *        data-captcha-api="/api/captcha"
 *        data-captcha-mode="api"
 *   >
 */

(function (global) {
    'use strict';

    // ─── تنظیمات پیش‌فرض ────────────────────────────────────────────────────
    const DEFAULTS = {
        mode: 'test',           
        apiUrl: '/api/captcha',     // آدرس API 
        validateUrl: '/api/captcha/validate', // آدرس اعتبارسنجی
        width: 160,
        height: 42,
        chars: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
        noiseLines: 4,
        noiseDots: 35,
        loadingClass: 'captcha-loading',
    };

    // ─── ابزارها ─────────────────────────────────────────────────────────────

    /** تولید تصویر کپچا روی canvas (فقط برای حالت تست) */
    function generateLocalCaptcha(options) {
        const W = options.width  || DEFAULTS.width;
        const H = options.height || DEFAULTS.height;
        const chars = options.chars || DEFAULTS.chars;

        const canvas = document.createElement('canvas');
        canvas.width  = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // پس‌زمینه
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#f3f4f6');
        grad.addColorStop(1, '#ffffff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // خطوط نویز
        const lineCount = options.noiseLines || DEFAULTS.noiseLines;
        for (let i = 0; i < lineCount; i++) {
            ctx.strokeStyle = `rgba(${r(80,200)},${r(80,200)},${r(80,200)},0.35)`;
            ctx.lineWidth = 1 + Math.random();
            ctx.beginPath();
            ctx.moveTo(Math.random() * W, Math.random() * H);
            ctx.bezierCurveTo(
                Math.random() * W, Math.random() * H,
                Math.random() * W, Math.random() * H,
                Math.random() * W, Math.random() * H
            );
            ctx.stroke();
        }

        // تولید کد
        let code = '';
        for (let i = 0; i < 6; i++) code += chars[~~(Math.random() * chars.length)];

        // رسم کاراکترها
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < code.length; i++) {
            const x = 14 + i * 23;
            const y = H / 2 + (Math.random() - 0.5) * 8;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((Math.random() - 0.5) * 0.45);
            ctx.fillStyle = `hsl(${~~(Math.random() * 360)},70%,40%)`;
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }

        // نقاط نویز
        const dotCount = options.noiseDots || DEFAULTS.noiseDots;
        for (let i = 0; i < dotCount; i++) {
            ctx.fillStyle = `rgba(${r(0,255)},${r(0,255)},${r(0,255)},0.25)`;
            ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
        }

        return { image: canvas.toDataURL('image/png'), token: code };
    }

    function r(min, max) { return ~~(Math.random() * (max - min) + min); }

    // ─── هسته ماژول ──────────────────────────────────────────────────────────

    /**
     * بارگذاری کپچا برای یک المان img
     * @param {HTMLImageElement} imgEl
     */
    async function loadCaptcha(imgEl) {
        const mode        = imgEl.getAttribute('data-captcha-mode') || DEFAULTS.mode;
        const apiUrl      = imgEl.getAttribute('data-captcha-api')  || DEFAULTS.apiUrl;
        const tokenInputSel = imgEl.getAttribute('data-captcha-token-input');
        const errorSel    = imgEl.getAttribute('data-captcha-error');
        const loadingSel  = imgEl.getAttribute('data-captcha-loading');

        const tokenInput = tokenInputSel ? document.querySelector(tokenInputSel) : null;
        const errorEl    = errorSel ? document.querySelector(errorSel) : null;
        const loadingEl  = loadingSel ? document.querySelector(loadingSel) : null;

        _showLoading(imgEl, loadingEl, true);

        try {
            let result;

            if (mode === 'api') {
                result = await _fetchFromApi(apiUrl);
            } else {
                result = await _fetchLocal(imgEl);
            }

            imgEl.src = result.image;
            imgEl.onload = () => {
                _showLoading(imgEl, loadingEl, false);
                imgEl.style.opacity = '1';
            };

            // ذخیره توکن روی المان برای اعتبارسنجی
            imgEl.dataset.captchaCurrentToken = result.token || '';

        } catch (err) {
            console.error('[CaptchaModule] خطا:', err);
            _showLoading(imgEl, loadingEl, false);
        }

        if (tokenInput) tokenInput.value = '';
        if (errorEl) errorEl.classList.add('hidden');
    }

    /**
     * اعتبارسنجی کپچا با سرور (روش推薦)
     * @param {HTMLImageElement} imgEl 
     * @param {string} userInput 
     * @param {string} validateUrl 
     * @returns {Promise<{valid: boolean, message: string}>}
     */
    async function validateCaptchaWithServer(imgEl, userInput, validateUrl = null) {
        const token = imgEl.dataset.captchaCurrentToken;
        if (!token) {
            return { valid: false, message: 'توکن یافت نشد، دوباره تلاش کنید' };
        }

        const url = validateUrl || DEFAULTS.validateUrl;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    userInput: userInput,
                    token: token
                })
            });

            const result = await response.json();
            
            // اگر اعتبارسنجی موفق بود، توکن رو پاک کن (یکبار مصرف)
            if (result.valid) {
                imgEl.dataset.captchaCurrentToken = '';
            }
            
            return { valid: result.valid, message: result.message };
        } catch (err) {
            console.error('[CaptchaModule] خطا در اعتبارسنجی:', err);
            return { valid: false, message: 'خطا در ارتباط با سرور' };
        }
    }

    /**
     * اعتبارسنجی سمت کلاینت (سریع اما امنیت کمتر)
     * @param {HTMLImageElement} imgEl 
     * @param {string} userInput 
     * @returns {boolean}
     */
    function validateCaptchaLocal(imgEl, userInput) {
        const token = imgEl.dataset.captchaCurrentToken || '';
        return userInput.trim().toUpperCase() === token.toUpperCase();
    }

    // ─── توابع داخلی ─────────────────────────────────────────────────────────

    function _fetchLocal(imgEl) {
        return new Promise((resolve) => {
            const delay = 200 + Math.random() * 300;
            setTimeout(() => {
                const opts = {
                    width:      parseInt(imgEl.getAttribute('data-captcha-width')) || DEFAULTS.width,
                    height:     parseInt(imgEl.getAttribute('data-captcha-height')) || DEFAULTS.height,
                    chars:      imgEl.getAttribute('data-captcha-chars') || DEFAULTS.chars,
                    noiseLines: parseInt(imgEl.getAttribute('data-captcha-noise-lines')) || DEFAULTS.noiseLines,
                    noiseDots:  parseInt(imgEl.getAttribute('data-captcha-noise-dots')) || DEFAULTS.noiseDots,
                };
                resolve(generateLocalCaptcha(opts));
            }, delay);
        });
    }

    /**
     * فرچ از API ASP.NET Core
     * انتظار: { image: "data:image/png;base64,...", token: "XXXXXX" }
     */
    async function _fetchFromApi(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        return {
            image: data.image || data.captchaImage || data.base64 || data.src,
            token: data.token || data.captchaToken || data.code || '',
        };
    }

    function _showLoading(imgEl, loadingEl, show) {
        imgEl.style.opacity = show ? '0' : '1';
        if (loadingEl) {
            loadingEl.classList.toggle('hidden', !show);
        }
    }

    // ─── Auto-init ───────────────────────────────────────────────────────────

    function init() {
        const images = document.querySelectorAll('[data-captcha-img]');
        images.forEach((imgEl) => {
            loadCaptcha(imgEl);

            const refreshSel = imgEl.getAttribute('data-captcha-refresh');
            if (refreshSel) {
                const refreshBtn = document.querySelector(refreshSel);
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        loadCaptcha(imgEl);
                    });
                }
            }

            imgEl.style.cursor = 'pointer';
            imgEl.addEventListener('click', () => loadCaptcha(imgEl));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ─── API عمومی ───────────────────────────────────────────────────────────
    global.CaptchaModule = {
        reload: loadCaptcha,
        validate: validateCaptchaLocal,           // اعتبارسنجی سمت کلاینت
        validateWithServer: validateCaptchaWithServer, // اعتبارسنجی با سرور (امن‌تر)
        init: init,
    };

})(window);