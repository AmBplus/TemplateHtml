# 👁️ Password Toggle Module — Attribute Based

یک ماژول سبک و مستقل برای نمایش/مخفی کردن رمز عبور که کاملاً از طریق **HTML attributes** پیکربندی می‌شود.

---

## 📦 نصب

```html
<script src="/wwwroot/js/password-toggle-module/password-toggle.js"></script>
```

---

## 🚀 استفاده سریع

```html
<!-- فیلد رمز عبور -->
<input type="password" id="password" placeholder="رمز عبور">

<!-- دکمه toggle -->
<button type="button"
    data-password-toggle
    data-password-target="#password"
    data-password-icon-show="#eye-open"
    data-password-icon-hide="#eye-closed"
    aria-label="نمایش رمز عبور">

    <!-- آیکون چشم باز (حالت پیش‌فرض: نمایش) -->
    <svg id="eye-open" ...></svg>

    <!-- آیکون چشم بسته (پیش‌فرض: مخفی) -->
    <svg id="eye-closed" class="hidden" ...></svg>
</button>
```

---

## 📋 لیست Attributes

| Attribute | نوع | توضیح |
|-----------|-----|-------|
| `data-password-toggle` | flag | **اجباری** — دکمه را به عنوان toggle معرفی می‌کند |
| `data-password-target` | CSS selector | **اجباری** — selector فیلد input رمز عبور |
| `data-password-icon-show` | CSS selector | آیکون نمایش رمز (وقتی رمز مخفی است) |
| `data-password-icon-hide` | CSS selector | آیکون مخفی کردن رمز (وقتی رمز نمایش داده می‌شود) |

---

## 💡 مثال کامل با Tailwind CSS

```html
<div class="relative">
    <input
        type="password"
        id="password"
        class="w-full px-3 py-2.5 rounded-lg border"
        placeholder="رمز عبور"
    >
    <button
        type="button"
        data-password-toggle
        data-password-target="#password"
        data-password-icon-show="#eye-open"
        data-password-icon-hide="#eye-closed"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        aria-label="نمایش رمز عبور"
    >
        <!-- چشم باز -->
        <svg id="eye-open" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                   -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        <!-- چشم بسته -->
        <svg id="eye-closed" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                   a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                   M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532
                   l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5
                   c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
        </svg>
    </button>
</div>

<script src="/wwwroot/js/password-toggle-module/password-toggle.js"></script>
```

---

## 🔧 API عمومی JavaScript

```javascript
// init دستی (برای المان‌هایی که بعداً به DOM اضافه شدند)
PasswordToggle.init();

// فعال‌سازی یک دکمه خاص
const btn = document.querySelector('[data-password-toggle]');
PasswordToggle.initToggle(btn);
```

---

## 📁 ساختار فایل‌ها

```
wwwroot/js/password-toggle-module/
├── password-toggle.js   ← ماژول اصلی
└── README.md            ← این فایل
```

---

## ♿ دسترسی‌پذیری (Accessibility)

- `aria-label` دکمه به صورت خودکار بین **"نمایش رمز عبور"** و **"مخفی کردن رمز عبور"** تغییر می‌کند
- استفاده از `type="button"` از submit شدن فرم جلوگیری می‌کند

---

*ساخته شده با ❤️ برای سامانه دانا*
