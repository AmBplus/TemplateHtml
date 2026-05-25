# 🔐 Captcha Module — Attribute Based

یک ماژول کپچای سبک و مستقل که کاملاً از طریق **HTML attributes** پیکربندی می‌شود.  
بدون نیاز به نوشتن JavaScript اضافه — فقط اتریبیوت‌ها را تنظیم کنید.

---

## 📦 نصب

فایل را در صفحه خود include کنید:

```html
<script src="/wwwroot/js/captcha-module/captcha.js"></script>
```

---

## 🚀 استفاده سریع

### حالت تست (بدون API)

```html
<!-- تصویر کپچا -->
<img
  data-captcha-img
  data-captcha-mode="test"
  data-captcha-token-input="#my-captcha-input"
  data-captcha-loading="#my-captcha-spinner"
  data-captcha-error="#my-captcha-error"
  data-captcha-refresh="#my-refresh-btn"
  style="width:160px; height:42px;"
  alt="کد امنیتی"
>

<!-- spinner (اختیاری) -->
<div id="my-captcha-spinner" class="hidden">در حال بارگذاری...</div>

<!-- فیلد ورودی -->
<input type="text" id="my-captcha-input" placeholder="کد امنیتی">

<!-- دکمه refresh -->
<button type="button" id="my-refresh-btn">🔄 کد جدید</button>

<!-- پیغام خطا -->
<p id="my-captcha-error" class="hidden">کد امنیتی اشتباه است</p>
```

### حالت واقعی (API)

```html
<img
  data-captcha-img
  data-captcha-mode="api"
  data-captcha-api="/api/captcha/generate"
  data-captcha-token-input="#captcha-input"
  data-captcha-loading="#captcha-spinner"
  data-captcha-error="#captcha-error"
  data-captcha-refresh="#refresh-btn"
  style="width:160px; height:42px;"
  alt="کد امنیتی"
>
```

---

## 📋 لیست کامل Attributes

| Attribute | نوع | پیش‌فرض | توضیح |
|-----------|-----|---------|-------|
| `data-captcha-img` | flag | — | **اجباری** — المان را به عنوان کپچا معرفی می‌کند |
| `data-captcha-mode` | `"test"` \| `"api"` | `"test"` | حالت کار: تست محلی یا API واقعی |
| `data-captcha-api` | URL | `/api/captcha` | آدرس API (فقط در حالت `api`) |
| `data-captcha-token-input` | CSS selector | — | selector فیلد ورودی کد امنیتی |
| `data-captcha-loading` | CSS selector | — | selector المان loading/spinner |
| `data-captcha-error` | CSS selector | — | selector المان پیغام خطا |
| `data-captcha-refresh` | CSS selector | — | selector دکمه refresh |
| `data-captcha-width` | number | `160` | عرض تصویر (فقط حالت test) |
| `data-captcha-height` | number | `42` | ارتفاع تصویر (فقط حالت test) |
| `data-captcha-chars` | string | `ABCDE...` | کاراکترهای مجاز (فقط حالت test) |
| `data-captcha-noise-lines` | number | `4` | تعداد خطوط نویز (فقط حالت test) |
| `data-captcha-noise-dots` | number | `35` | تعداد نقاط نویز (فقط حالت test) |

---

## ✅ اعتبارسنجی در فرم

```javascript
document.getElementById('my-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const captchaImg   = document.querySelector('[data-captcha-img]');
    const captchaInput = document.getElementById('my-captcha-input');

    if (!CaptchaModule.validate(captchaImg, captchaInput.value)) {
        document.getElementById('my-captcha-error').classList.remove('hidden');
        CaptchaModule.reload(captchaImg); // بارگذاری مجدد
        return;
    }

    // ادامه ارسال فرم...
});
```

---

## 🔄 بارگذاری دستی

```javascript
const captchaImg = document.querySelector('[data-captcha-img]');
CaptchaModule.reload(captchaImg);
```

---

## 🌐 فرمت پاسخ API (حالت واقعی)

API باید یک JSON برگرداند. فرمت‌های پشتیبانی‌شده:

```json
// فرمت ۱ (توصیه‌شده)
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "token": "AB3X7K"
}

// فرمت ۲ (سرور token را در session نگه می‌دارد)
{
  "captchaImage": "data:image/png;base64,iVBORw0KGgo...",
  "captchaToken": "AB3X7K"
}

// فرمت ۳
{
  "base64": "data:image/png;base64,iVBORw0KGgo...",
  "code": "AB3X7K"
}
```

> **نکته:** اگر API فقط تصویر برمی‌گرداند و token را در session سرور نگه می‌دارد،  
> فیلد `token` می‌تواند خالی باشد. در این صورت اعتبارسنجی باید سمت سرور انجام شود.

---

## 🔧 API عمومی JavaScript

```javascript
// بارگذاری مجدد
CaptchaModule.reload(imgElement);

// اعتبارسنجی
const isValid = CaptchaModule.validate(imgElement, userInput); // boolean

// init دستی (برای المان‌هایی که بعداً به DOM اضافه شدند)
CaptchaModule.init();
```

---

## 💡 مثال کامل با Tailwind CSS

```html
<!-- Captcha Section -->
<div class="flex items-center gap-3">
    <!-- تصویر کپچا -->
    <div class="relative flex-shrink-0">
        <img
            data-captcha-img
            data-captcha-mode="test"
            data-captcha-token-input="#captcha-input"
            data-captcha-loading="#captcha-loading"
            data-captcha-error="#captcha-error"
            data-captcha-refresh="#refresh-captcha"
            class="rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors shadow-sm"
            style="width:160px; height:42px; object-fit:cover;"
            alt="کد امنیتی"
            title="کلیک برای تغییر کد"
        >
        <!-- Spinner -->
        <div id="captcha-loading" class="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <svg class="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
        </div>
    </div>

    <!-- فیلد ورودی -->
    <div class="flex-1 relative">
        <input
            type="text"
            id="captcha-input"
            dir="ltr"
            class="w-full h-[42px] px-3 text-sm rounded-lg border border-gray-300 text-center tracking-widest uppercase"
            placeholder="کد امنیتی"
            maxlength="6"
            autocomplete="off"
        >
        <!-- دکمه refresh -->
        <button type="button" id="refresh-captcha"
            class="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
        </button>
        <!-- خطا -->
        <p id="captcha-error" class="hidden text-xs text-red-500 mt-1">کد امنیتی اشتباه است</p>
    </div>
</div>

<script src="/wwwroot/js/captcha-module/captcha.js"></script>
```

---

## 📁 ساختار فایل‌ها

```
wwwroot/js/captcha-module/
├── captcha.js      ← ماژول اصلی
└── README.md       ← این فایل
```

---

## 🔒 نکات امنیتی

- در **حالت `test`**: token سمت کلاینت نگه‌داری می‌شود (مناسب برای توسعه و نمایش)
- در **حالت `api`**: توصیه می‌شود token را **سمت سرور** در session ذخیره کنید و اعتبارسنجی نهایی سمت سرور انجام شود
- هرگز در محیط production به token سمت کلاینت اعتماد نکنید

---

*ساخته شده با ❤️ برای سامانه دانا*
