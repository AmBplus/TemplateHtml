**مستندسازی کامپوننت‌های SCSS**

این سند فشرده و مرجع‌وار، کامپوننت‌های موجود در پوشه `wwwroot/scss/components/` را نشان می‌دهد: کلاس‌های اصلی، واریانت‌ها، متغیرهای کلیدی و مثال‌های استفاده.

--

**فایل‌ها**: [wwwroot/scss/components/_button.scss](wwwroot/scss/components/_button.scss#L1) · [wwwroot/scss/components/_badge.scss](wwwroot/scss/components/_badge.scss#L1) · [wwwroot/scss/components/_link.scss](wwwroot/scss/components/_link.scss#L1) · [wwwroot/scss/components/_menu.scss](wwwroot/scss/components/_menu.scss#L1) · [wwwroot/scss/components/_select.scss](wwwroot/scss/components/_select.scss#L1) · [wwwroot/scss/components/_group-input.scss](wwwroot/scss/components/_group-input.scss#L1) · [wwwroot/scss/components/_switch.scss](wwwroot/scss/components/_switch.scss#L1) · [wwwroot/scss/components/_social-button.scss](wwwroot/scss/components/_social-button.scss#L1)

----

**راهنما برای خواندن این مستند**: هر بخش شامل: **کلاس‌ها / واریانت‌ها**، **متغیرهای مرتبط** و **یادداشت‌ها / مثال سریع**.

**Button**
- فایل: [components/_button.scss](wwwroot/scss/components/_button.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `btn` (پایه)
  - `btn-primary`, `btn-secondary`, `btn-outline`, `btn-ghost`
  - Semantic: `btn-success`, `btn-danger`, `btn-warning`, `btn-info`
  - Extra colors: `btn-pink`, `btn-purple`, `btn-orange`, `btn-green-dark`, `btn-blue-dark`
  - Social brands: `btn-github`, `btn-twitter`, `btn-youtube`, ...
  - Light variants: `btn-light-*` (مثلاً `btn-light-success`)
  - Outline variants: `btn-outline-*`
  - Fill aliases: `btn-fill-*` (مثلاً `btn-fill-primary`)
  - Size: `btn-xs`, `btn-sm`, `btn-lg`
  - Disabled: `:disabled` / `.disabled`
- متغیرهای کلیدی:
  - `--btn-primary-bg`, `--btn-primary-color`, `--btn-primary-hover-bg`, `--btn-primary-border`
  - `--btn-secondary-bg`, `--btn-outline-hover-bg`
  - رنگ‌های semantic: `--color-success`, `--color-danger`, `--color-warning`, `--color-info`
  - `--color-primary`, `--color-primary-dark`, `--color-primary-light`
- یادداشت / مثال:
  - استفاده ساده: `<button class="btn btn-primary">ارسال</button>`
  - برای پر کردن (solid brand) از `btn-fill-primary` استفاده کنید.

**Badge**
- فایل: [components/_badge.scss](wwwroot/scss/components/_badge.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `badge` (پایه)
  - رنگ‌ها: `badge-primary`, `badge-secondary`, `badge-success`, `badge-danger`, `badge-warning`, `badge-info`, `badge-accent` و رنگ‌های اضافی
  - حالت‌های solid: `badge-solid-*` و outline: `badge-outline-*`
  - اندازه: `badge-sm`, `badge-lg`
  - شکل‌ها: `badge-pill`, `badge-square`
- متغیرهای کلیدی:
  - `--badge-primary-bg`, `--badge-primary-color`
  - `--badge-danger-text`, `--badge-warning-text` (قابل override توسط تم‌ها)
  - `--color-danger`, `--color-warning`, `--color-success` (برای background/border)
- یادداشت / مثال:
  - `<span class="badge badge-primary">فعال</span>`

**Link**
- فایل: [components/_link.scss](wwwroot/scss/components/_link.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `link` (پایه) — تغییر رنگ با hover و افکت آیکون
  - واریانت‌های رنگی: `link-success`, `link-danger`, `link-warning`, `link-info`, `link-secondary`, `link-muted`
  - اندازه: `link-sm`, `link-lg`
  - حالت: `link-underline`, `link-none`, `link-disabled`
- متغیرهای کلیدی:
  - `--color-primary`, `--color-primary-dark`, `--text-primary`, `--text-secondary`
- یادداشت / مثال:
  - `<a class="link link-danger" href="#">حذف</a>`

**Menu / Dropdown**
- فایل: [components/_menu.scss](wwwroot/scss/components/_menu.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `menu` (container عمودی)
  - `menu-horizontal` (منوی افقی compact)
  - `menu-item` (آیتم)، `menu-item-submenu`, `menu-divider`, `menu-label`
  - `.dropdown`, `.dropdown-menu`, `.dropdown-trigger` برای dropdownهای JS-محور
- متغیرهای کلیدی:
  - `--menu-bg`, `--menu-item-hover-bg`, `--menu-item-active-bg`, `--menu-item-active-color`
  - `--border-color`, `--bg-primary` (برای سطح منو)
- یادداشت / مثال:
  - برای منوهای افقی از کلاس `menu-horizontal` استفاده شود تا آیتم‌ها فشرده بمانند.

**Select / Custom Select**
- فایل: [components/_select.scss](wwwroot/scss/components/_select.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `.select-wrapper`, `.select` (عنصر native)
  - `.custom-select` شامل `.select-trigger`, `.select-dropdown`, `.select-option`
  - حالات: `.is-invalid`, `.is-valid`, `.select-sm`, `.select-lg`, `.select-multi`
- متغیرهای کلیدی:
  - `--select-bg`, `--select-dropdown-bg`, `--input-border`, `--input-focus-border`, `--input-focus-ring`, `--input-placeholder`
- یادداشت / مثال:
  - Custom JS-enhanced select از `.custom-select` استفاده می‌کند؛ multi-select با کلاس `select-multi`.

**Group Input / Forms**
- فایل: [components/_group-input.scss](wwwroot/scss/components/_group-input.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `form-input`, `form-input-sm`, `form-input-lg`, `form-textarea`
  - `input-group`, `input-group-prepend`, `input-group-append`, `input-group-icon`
  - `form-group`, `form-label`, `form-hint`, `form-error`, `form-check` و `form-check-inline`
  - `input-icon-wrapper` (آیکون داخل ورودی) و `input-group-btn`
- متغیرهای کلیدی:
  - `--text-primary`, `--text-secondary`, `--color-danger`, `--color-success`, `--border-color`, `--bg-tertiary`
- یادداشت / مثال:
  - گروه ورودی‌ها با `input-group` جهت افزودن addon یا دکمه کنار ورودی استفاده می‌شود.

**Switch**
- فایل: [components/_switch.scss](wwwroot/scss/components/_switch.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `switch` (wrapper)
  - `.switch-input` (checkbox hidden), `.switch-track`, `.switch-thumb`, `.switch-label`
  - رنگ‌ها: `.switch-success`, `.switch-danger`, `.switch-warning`, `.switch-info`, `.switch-secondary`
  - اندازه: `.switch-sm`, `.switch-lg`
- متغیرهای کلیدی:
  - `--switch-bg`, `--switch-checked-bg`, `--switch-thumb-bg`, `--color-primary`, `--color-success`, `--color-danger`

**Social Button**
- فایل: [components/_social-button.scss](wwwroot/scss/components/_social-button.scss#L1)
- کلاس‌ها / واریانت‌ها:
  - `btn-social` (پایه), `btn-social-telegram`, `btn-social-twitter`, `btn-social-instagram`, ...
  - سایز: `btn-social-sm`, `btn-social-lg`, `btn-social-icon-only`
  - گروه: `btn-social-group`
- متغیرهای کلیدی:
  - `--color-telegram`, `--color-twitter`, `--color-instagram`, `--color-facebook`, ...

----

**چند نکته عملی**
- محل افزودن partial جدید: `wwwroot/scss/components/_your-component.scss` و سپس `@import 'components/your-component'` داخل `wwwroot/scss/admin.scss`.
- تم‌ها در `wwwroot/scss/themes/*` متغیرهای `--btn-*`, `--badge-*`, `--input-*` را override می‌کنند — برای افزودن پشتیبانی تم برای کامپوننت جدید، متغیر مرتبط را در فایل تم اضافه کنید.
- برای لیست کامل متغیرها و مقادیر پیش‌فرض به `wwwroot/scss/config/_variables.scss` مراجعه کنید.

اگر مایل باشی من این فایل را به صورت یک جدول دقیق‌تر (کلاس | شرح | متغیرها | مثال) تبدیل کنم یا نمونه HTML کامل برای هر کامپوننت اضافه کنم، اعلام کن تا انجام دهم.

---

**Tailwind & build notes**

- **نسخه توصیه‌شده Tailwind:** Tailwind CSS v3.x — پیشنهاد می‌شود از `v3.4+` استفاده کنید. این کامپوننت‌ها از قابلیت‌هایی مانند مقدار دلخواه (arbitrary values) و کلاس‌های `text-[var(...)]` استفاده می‌کنند که در Tailwind v3 پشتیبانی می‌شود.
- **ترتیب بیلد پیشنهادی:**
  1. کامپایل SCSS -> CSS با Dart Sass (`sass`).
  2. اجرای PostCSS + Tailwind برای اعمال utilityها و پاک‌سازی کلاس‌های استفاده‌نشده.
  3. مینیمایز/بهینه‌سازی خروجی و قرار دادن در `wwwroot/css/`.

نمونه `tailwind.config.js` (مقداری و قابل گسترش):
```js
module.exports = {
  content: [
    './**/*.html',
    './wwwroot/js/**/*.js',
    './wwwroot/scss/**/*.scss'
  ],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}
```

نمونه اسکریپت‌های `package.json` برای خط بیلد CSS:
```json
{
  "scripts": {
    "build:sass": "sass wwwroot/scss/admin.scss:wwwroot/css/admin.css --no-source-map",
    "build:postcss": "postcss wwwroot/css/admin.css -o wwwroot/css/admin.css",
    "build:css": "npm run build:sass && npm run build:postcss"
  }
}
```

نکات عملی:
- متغیرهای SCSS (مثل `--btn-primary-bg`, `--badge-primary`) در partialها استفاده می‌شوند؛ overrideهای تم را در `wwwroot/scss/themes/` قرار دهید.
- برای آیکون‌های SVG از `fill-current` استفاده کنید تا رنگ آنها از رنگ متن/بدج به ارث برسد (نمونه در `student-exams.html`).
- ترتیب بیلد: ابتدا SCSS کامپایل شود سپس PostCSS/Tailwind اجرا شود تا PostCSS سعی نکند SCSS خام را پارس کند.
- اگر کلاس‌هایی به صورت داینامیک در JS تولید می‌کنید، آنها را در `safelist` در `tailwind.config.js` قرار دهید یا به صورت string مستقیم در قالب‌ها بنویسید تا Purge آن‌ها را حذف نکند.

نمونه‌های سریع استفاده:
- Badge: `<span class="badge badge-success">موفقیت</span>`
- Button (کوچک): `<button class="btn btn-success btn-sm">شرکت</button>`
- Link: `<a class="link link-info" href="#">مشاهده</a>`

می‌خواهی من همین حالا این تغییر را کامیت و پوش کنم؟
