<div dir="rtl">

# AmbMsg — کتابخانه مودال و Toast مبتنی بر Attribute

[![نسخه](https://img.shields.io/badge/version-1.1-blue)](https://github.com/AmBplus/ambmsg)
[![لایسنس](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![بدون وابستگی](https://img.shields.io/badge/dependencies-none-brightgreen)]()

**AmbMsg** یک کتابخانه سبک و قدرتمند برای نمایش مودال، Toast و Alert در مرورگر است.
بدون هیچ وابستگی خارجی، با سینتکس HTML Attribute یا JavaScript کار می‌کند و با Bootstrap 5.3 سازگار است.

### ✅ ویژگی‌های کلیدی

- 📦 **بدون وابستگی** — Vanilla JavaScript خالص
- 🎨 **۱۲ انیمیشن** — fade، zoom، slide، bounce، flip، rotate
- 📐 **۹ موقعیت** — هر گوشه، لبه یا مرکز
- 📏 **۶ سایز** — sm تا full + سفارشی
- 🌙 **تم تاریک/روشن**
- 🌐 **پشتیبانی RTL** — فارسی و عربی
- 🖱 **قابل جابجایی (Draggable)**
- 🔔 **Toast خودکار** — با بسته شدن خودکار
- 📋 **Alert و Confirm** — موفقیت، خطا، هشدار، اطلاع
- 🤖 **Container خودکار** — ایده‌آل برای پیام‌های سمت سرور
- ♿ **Accessible** — tab trapping، Escape key، ARIA

---

## 🚀 نصب سریع

```html
<link rel="stylesheet" href="ambmsg.css">
<script src="ambmsg.js"></script>
```

---

## ⚡ استفاده سریع

### ۱. مودال با HTML Attribute (بدون JavaScript)

```html
<!-- دکمه باز کردن -->
<button data-amb-toggle="modal" data-amb-target="#myModal">
    باز کردن مودال
</button>

<!-- تعریف مودال -->
<div id="myModal" style="display:none;"
     data-amb-title="عنوان مودال"
     data-amb-size="md"
     data-amb-footer='<button data-amb-dismiss="modal">بستن</button>'>
    <p>محتوای مودال اینجاست!</p>
</div>
```
> نکته: هنگام ساخت مودال از روی HTML، محتوای سورس مخفی بعد از init تخلیه می‌شود تا IDهای داخلی در DOM تکراری نشوند.

### ۲. مودال و Toast با JavaScript

```javascript
// Toast سریع
ToastSuccess('ذخیره شد!');
ToastError('خطا رخ داد!');

// Alert هشدار
AlertError('خطا', 'مشکلی پیش آمده است', { rtl: true, btnText: 'باشه' });

// Confirm تأیید
AmbMsg.confirm({
    title: 'حذف آیتم',
    message: 'آیا مطمئن هستید؟',
    confirmText: 'بله',
    cancelText: 'خیر',
    rtl: true,
    onConfirm: () => ToastSuccess('حذف شد!')
});

// مودال برنامه‌نویسی
AmbMsg.open('modal-id', {
    title: 'عنوان',
    body: '<p>محتوا</p>',
    size: 'md',
    rtl: true,
    theme: 'dark'
});
```

### ۳. Container خودکار (برای پیام‌های سرور)

```html
<!-- لیست Toast از سرور -->
<div class="amb-toast-container" data-amb-toast-step="300">
    <div class="amb-toast-item" data-amb-toast-type="error" data-amb-toast-msg="نام الزامی است"></div>
    <div class="amb-toast-item" data-amb-toast-type="error" data-amb-toast-msg="ایمیل نادرست است"></div>
</div>
```
> Note: For HTML-defined modals, source markup content is cleared after init to prevent duplicate internal IDs in the DOM.

---

## 📚 مستندات

| فایل | توضیح |
|------|--------|
| [ambmsg.md](ambmsg.md) | 📖 مستندات کامل فارسی |
| [docs/00-quick-reference.md](docs/00-quick-reference.md) | ⚡ مرجع سریع |
| [docs/01-complete-api-documentation.md](docs/01-complete-api-documentation.md) | 📚 مستندات کامل API |
| [docs/02-javascript-usage.md](docs/02-javascript-usage.md) | 🟨 استفاده با JavaScript |
| [docs/03-html-attribute-usage.md](docs/03-html-attribute-usage.md) | 🟩 استفاده با HTML Attribute |
| [docs/04-auto-attribute-documentation.md](docs/04-auto-attribute-documentation.md) | 🤖 Container خودکار |

</div>

---

# AmbMsg — Attribute-Driven Modal & Toast Library

[![Version](https://img.shields.io/badge/version-1.1-blue)](https://github.com/AmBplus/ambmsg)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)]()

**AmbMsg** is a lightweight, attribute-driven modal and toast framework with zero external dependencies. It works with plain HTML attributes or JavaScript and is Bootstrap 5.3 API compatible.

### ✅ Key Features

- 📦 **Zero dependencies** — Pure Vanilla JavaScript
- 🎨 **12 animations** — fade, zoom, slide, bounce, flip, rotate
- 📐 **9 positions** — any corner, edge, or center
- 📏 **6 sizes** — sm through full + custom
- 🌙 **Dark / light theme**
- 🌐 **RTL support** — Persian & Arabic
- 🖱 **Draggable modals**
- 🔔 **Auto-dismissing toasts**
- 📋 **Alert & Confirm dialogs** — success, error, warning, info
- 🤖 **Auto containers** — perfect for server-side messages
- ♿ **Accessible** — tab trapping, Escape key, ARIA roles

---

## 🚀 Installation

Download `ambmsg.css` and `ambmsg.js` and include them in your page:

```html
<link rel="stylesheet" href="ambmsg.css">
<script src="ambmsg.js"></script>
```

No build step, no npm, no CDN required.

---

## ⚡ Quick Use

### 1. Modal via HTML Attributes (no JavaScript)

```html
<!-- Trigger button -->
<button data-amb-toggle="modal" data-amb-target="#myModal">
    Open Modal
</button>

<!-- Modal definition -->
<div id="myModal" style="display:none;"
     data-amb-title="Hello World"
     data-amb-size="md"
     data-amb-footer='<button data-amb-dismiss="modal">Close</button>'>
    <p>Modal content goes here!</p>
</div>
```

### 2. Modal & Toast via JavaScript

```javascript
// Quick toast
ToastSuccess('Saved successfully!');
ToastError('Something went wrong!');

// Alert dialog
AlertError('Error', 'Unable to connect to server');

// Confirm dialog
AmbMsg.confirm({
    title: 'Delete item',
    message: 'Are you sure?',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    onConfirm: () => ToastSuccess('Deleted!')
});

// Programmatic modal
AmbMsg.open('my-modal', {
    title: 'My Modal',
    body: '<p>Dynamic content here</p>',
    size: 'md',
    animOpen: 'slide-up',
    theme: 'dark'
});
```

### 3. Auto Containers (server-side messages)

```html
<!-- Toast queue — rendered by the server, shown automatically -->
<div class="amb-toast-container" data-amb-toast-step="300">
    <div class="amb-toast-item" data-amb-toast-type="error" data-amb-toast-msg="Name is required"></div>
    <div class="amb-toast-item" data-amb-toast-type="error" data-amb-toast-msg="Email is invalid"></div>
</div>

<!-- Alert queue -->
<div class="amb-alert-container" data-amb-alert-step="500">
    <div class="amb-alert-item"
         data-amb-alert-type="success"
         data-amb-alert-title="Success"
         data-amb-alert-msg="Registration complete!"
         data-amb-alert-btn="OK">
    </div>
</div>
```

### 4. Loading State (async operations)

```javascript
const modal = AmbMsg.open('save-modal', {
    title: 'Saving…',
    body: '<p>Please wait</p>',
    backdrop: 'static'
});
modal.setLoading(true);

fetch('/api/save', { method: 'POST' })
    .then(() => {
        modal.setLoading(false);
        modal._body.innerHTML = '<p>✅ Saved!</p>';
        setTimeout(() => modal.hide(), 1500);
    });
```

---

## 🔧 Core Options

| Option | Values | Default |
|--------|--------|---------|
| `size` | `sm` `md` `lg` `xl` `xxl` `full` `custom` | `md` |
| `position` | `center` `top-left` `top-right` `bottom-left` `bottom-right` … | `center` |
| `animOpen` | `fade` `zoom-in` `slide-up` `bounce` `flip-x` `rotate` … | `zoom-in` |
| `backdrop` | `true` `false` `'static'` | `true` |
| `theme` | `''` `'dark'` | `''` |
| `rtl` | `true` `false` | `false` |
| `draggable` | `true` `false` | `false` |
| `autoClose` | milliseconds | `0` |
| `showHeader` | `true` `false` | `true` |
| `showCloseIcon` | `true` `false` | `true` |

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [ambmsg.md](ambmsg.md) | 📖 Full documentation in Persian (فارسی) |
| [docs/00-quick-reference.md](docs/00-quick-reference.md) | ⚡ Quick reference card |
| [docs/01-complete-api-documentation.md](docs/01-complete-api-documentation.md) | 📚 Complete API reference |
| [docs/02-javascript-usage.md](docs/02-javascript-usage.md) | 🟨 JavaScript usage guide |
| [docs/03-html-attribute-usage.md](docs/03-html-attribute-usage.md) | 🟩 HTML attribute usage guide |
| [docs/04-auto-attribute-documentation.md](docs/04-auto-attribute-documentation.md) | 🤖 Auto containers documentation |

---

## 📁 File Structure

```
project/
├── ambmsg.css          # Styles (required)
├── ambmsg.js           # Core library (required)
├── ambmsg.md           # Full Persian documentation
└── docs/
    ├── 00-quick-reference.md
    ├── 01-complete-api-documentation.md
    ├── 02-javascript-usage.md
    ├── 03-html-attribute-usage.md
    └── 04-auto-attribute-documentation.md
```

## 🌐 Browser Support

Chrome 90+ · Firefox 88+ · Safari 14+ · Edge 90+

## 📄 License

MIT — free for personal and commercial use.
