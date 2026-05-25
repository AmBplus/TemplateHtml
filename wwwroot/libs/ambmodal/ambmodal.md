# 📚 AmbModal v1.0 — مستندات کامل

> **یک فریم‌ورک مودال مبتنی بر Attribute، سازگار با Bootstrap 5.3 API**
> 
> MIT License | بدون وابستگی | سبک و قدرتمند

---

## 📑 فهرست مطالب

1. [شروع سریع](#شروع-سریع)
2. [روش‌های استفاده](#روشهای-استفاده)
3. [تنظیمات (Options)](#تنظیمات-options)
4. [Attributeهای داده‌ای](#attributeهای-دادهای)
5. [API جاوااسکریپت](#api-جاوااسکریپت)
6. [انیمیشن‌ها](#انیمیشنها)
7. [موقعیت‌ها (Positions)](#موقعیتها-positions)
8. [سایزها (Sizes)](#سایزها-sizes)
9. [تم‌ها (Themes)](#تمها-themes)
10. [Backdrop & Keyboard](#backdrop--keyboard)
11. [رویدادها (Events)](#رویدادها-events)
12. [متدهای کمکی](#متدهای-کمکی)
13. [Toast Timer](#toast-timer)
14. [سفارشی‌سازی CSS](#سفارشیسازی-css)
15. [سازگاری با Bootstrap](#سازگاری-با-bootstrap)
16. [نمونه‌های کامل](#نمونههای-کامل)

---

## شروع سریع

### نصب و راه‌اندازی

```html
<!-- 1. اضافه کردن CSS -->
<link rel="stylesheet" href="./ambmodal.css">

<!-- 2. اضافه کردن JavaScript قبل از بسته شدن body -->
<script src="./ambmodal.js"></script>
```

### ساده‌ترین مثال

```html
<!-- دکمه trigger -->
<button data-amb-toggle="modal" data-amb-target="#myModal">
    Open Modal
</button>

<!-- محتوای مودال (مخفی) -->
<div id="myModal" style="display:none;"
     data-amb-title="عنوان مودال"
     data-amb-footer="<button class='amb-btn amb-btn-primary' data-amb-dismiss='modal'>تایید</button>">
    <p>محتوای اصلی مودال اینجا قرار می‌گیرد.</p>
</div>
```

---

## روش‌های استفاده

AmbModal از **سه روش** مختلف پشتیبانی می‌کند:

### ۱. روش Attribute-Driven (بدون JavaScript)

```html
<button data-amb-toggle="modal" data-amb-target="#modal1">
    باز کردن مودال
</button>

<div id="modal1" style="display:none;"
     data-amb-title="مودال ساده"
     data-amb-size="md"
     data-amb-position="center"
     data-amb-anim-open="zoom-in"
     data-amb-anim-close="zoom-out"
     data-amb-backdrop="true"
     data-amb-keyboard="true">
    <p>این مودال با data attributes ساخته شده است.</p>
</div>
```

### ۲. روش Programmatic (جاوااسکریپت)

```javascript
// ایجاد و نمایش مستقیم
AmbModal.open('my-modal-id', {
    title: 'عنوان مودال',
    body: '<p>محتوای HTML</p>',
    footer: '<button class="amb-btn amb-btn-primary" data-amb-dismiss="modal">بستن</button>',
    size: 'md',
    animOpen: 'zoom-in'
});
```

### ۳. روش Bootstrap Compatible

```javascript
// دریافت نمونه موجود یا ایجاد جدید
const modal = AmbModal.Modal.getOrCreateInstance(document.getElementById('myModal'));
modal.show();

// فقط دریافت نمونه موجود
const existing = AmbModal.Modal.getInstance('myModal');
```

---

## تنظیمات (Options)

### تمام تنظیمات قابل استفاده

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `title` | string | `''` | عنوان مودال (HTML مجاز است) |
| `body` | string | `''` | محتوای اصلی (HTML مجاز است) |
| `footer` | string | `''` | فوتر مودال (HTML مجاز است) |
| `size` | string | `'md'` | سایز: `sm`, `md`, `lg`, `xl`, `xxl`, `full`, `custom` |
| `position` | string | `'center'` | موقعیت: `center`, `top-left`, `top-center`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right` |
| `animOpen` | string | `'zoom-in'` | انیمیشن باز شدن |
| `animClose` | string | `'zoom-out'` | انیمیشن بسته شدن |
| `duration` | number | `300` | مدت زمان انیمیشن (میلی‌ثانیه) |
| `easing` | string | `'ease-in-out'` | تابع easing |
| `backdrop` | boolean/string | `true` | `true` = قابل کلیک, `'static'` = غیرقابل کلیک, `false` = بدون پس‌زمینه |
| `backdropColor` | string | `''` | رنگ سفارشی پس‌زمینه (مثال: `'rgba(0,0,0,.8)'`) |
| `keyboard` | boolean | `true` | بسته شدن با کلید Escape |
| `autoFocus` | boolean | `true` | فوکوس خودکار روی اولین المنت |
| `autoClose` | number | `0` | بسته شدن خودکار بعد از X میلی‌ثانیه (0 = غیرفعال) |
| `draggable` | boolean | `false` | قابلیت جابجایی با موس/تاچ |
| `rtl` | boolean | `false` | راست به چپ |
| `theme` | string | `''` | تم: `''` (روشن) یا `'dark'` |
| `width` | string | `''` | عرض سفارشی (مثال: `'650px'`, `'80vw'`) |
| `mobileBreakpoint` | number | `576` | breakpoint موبایل (پیکسل) |
| `mobileSize` | string | `''` | سایز در موبایل (مثال: `'full'`) |
| `noDefaultStyle` | boolean | `false` | حذف استایل‌های پیش‌فرض |

### Callbackها

| پارامتر | امضا | توضیح |
|---------|------|--------|
| `onload` | `function(modal)` | قبل از نمایش |
| `afterload` | `function(modal)` | بعد از اتمام انیمیشن باز شدن |
| `onclose` | `function(modal)` | قبل از بسته شدن (return false جلوگیری می‌کند) |
| `afterclose` | `function(modal)` | بعد از اتمام انیمیشن بسته شدن |
| `onbackdropclick` | `function(modal)` | هنگام کلیک روی backdrop |

---

## Attributeهای داده‌ای

تمامی تنظیمات از طریق `data-amb-*` attributes قابل تنظیم هستند:

```html
<div id="myModal"
     data-amb-title="عنوان مودال"
     data-amb-size="lg"
     data-amb-position="top-center"
     data-amb-anim-open="slide-up"
     data-amb-anim-close="slide-down"
     data-amb-duration="500"
     data-amb-easing="ease-out"
     data-amb-backdrop="static"
     data-amb-backdrop-color="rgba(0,0,0,.9)"
     data-amb-keyboard="false"
     data-amb-auto-focus="false"
     data-amb-auto-close="5000"
     data-amb-draggable="true"
     data-amb-rtl="true"
     data-amb-theme="dark"
     data-amb-width="700px"
     data-amb-mobile-breakpoint="768"
     data-amb-mobile-size="full"
     data-amb-no-default-style>
    <!-- محتوا -->
</div>
```

### دکمه‌های Trigger

```html
<!-- استاندارد -->
<button data-amb-toggle="modal" data-amb-target="#myModal">
    Open
</button>

<!-- با data-amb-id هم کار می‌کند -->
<button data-amb-toggle="modal" data-amb-id="myModal">
    Open
</button>
```

### دکمه‌های Dismiss

```html
<!-- در فوتر -->
<button data-amb-dismiss="modal">بستن</button>

<!-- در هر جای محتوا -->
<button class="amb-btn amb-btn-outline" data-amb-dismiss="modal">
    Cancel
</button>
```

---

## API جاوااسکریپت

### AmbModal (Global Object)

```javascript
const Amb = window.AmbModal;
```

### متدهای اصلی

#### `AmbModal.open(id, options)`
ایجاد و/یا نمایش یک مودال

```javascript
const modal = AmbModal.open('my-modal', {
    title: 'ثبت نام',
    body: '<form>...</form>',
    footer: '<button class="amb-btn amb-btn-primary">ارسال</button>',
    size: 'md',
    backdrop: 'static',
    onload: function(modal) {
        console.log('در حال باز شدن...');
    },
    afterload: function(modal) {
        console.log('باز شد!');
    }
});
```

#### `AmbModal.create(id, options)`
فقط ایجاد (بدون نمایش)

```javascript
const modal = AmbModal.create('my-modal', {
    title: 'مودال مخفی',
    body: '<p>این مودال نمایش داده نمی‌شود تا زمانی که show() صدا زده شود.</p>'
});

// بعداً نمایش بده
modal.show();
```

#### `AmbModal.close(id)`
بستن مودال با شناسه

```javascript
AmbModal.close('my-modal');
```

#### `AmbModal.destroy(id)`
حذف کامل مودال از DOM و registry

```javascript
AmbModal.destroy('my-modal');
```

### Modal Instance Methods

```javascript
const modal = AmbModal.open('my-modal');

modal.show();           // نمایش
modal.hide();           // مخفی کردن
modal.toggle();         // تغییر وضعیت
modal.dispose();        // حذف کامل
modal.setLoading(true); // نمایش/مخفی کردن loading overlay

// به‌روزرسانی تنظیمات (نیاز به rebuild دارد)
modal.config({
    title: 'عنوان جدید',
    theme: 'dark'
});

// پراپرتی‌ها
modal.isVisible;  // boolean
modal.element;    // wrapper element
modal.id;         // شناسه
```

### Bootstrap Compatible API

```javascript
// دریافت نمونه موجود
const instance = AmbModal.Modal.getInstance('myModal');
// یا با element
const instance = AmbModal.Modal.getInstance(document.getElementById('myModal'));

// دریافت یا ایجاد نمونه
const instance = AmbModal.Modal.getOrCreateInstance(element, options);
```

---

## انیمیشن‌ها

### ۱۲ نوع انیمیشن باز شدن

| نام | توضیح | کلاس CSS |
|-----|------|----------|
| `fade` | محو شدن ساده | `amb-anim-fade` |
| `zoom-in` | بزرگ شدن از 0.7 | `amb-anim-zoom-in` |
| `zoom-out` | کوچک شدن از 1.3 | `amb-anim-zoom-out` |
| `slide-up` | آمدن از پایین | `amb-anim-slide-up` |
| `slide-down` | آمدن از بالا | `amb-anim-slide-down` |
| `slide-left` | آمدن از راست | `amb-anim-slide-left` |
| `slide-right` | آمدن از چپ | `amb-anim-slide-right` |
| `flip-x` | چرخش سه‌بعدی حول X | `amb-anim-flip-x` |
| `flip-y` | چرخش سه‌بعدی حول Y | `amb-anim-flip-y` |
| `bounce` | الاستیک/فنری | `amb-anim-bounce` |
| `rotate` | چرخش + بزرگ شدن | `amb-anim-rotate` |
| `none` | بدون انیمیشن | - |

### انیمیشن بسته شدن

از همان نام‌های بالا استفاده کنید. به‌صورت خودکار معکوس اجرا می‌شوند:

```javascript
AmbModal.open('modal', {
    animOpen: 'slide-left',
    animClose: 'slide-right'  // ← معکوس slide-left
});
```

یا از مقادیر `close-*` استفاده نکنید (خودکار تشخیص داده می‌شود).

### نمونه ترکیب‌های پیشنهادی

```javascript
// ورود از پایین، خروج به پایین
{ animOpen: 'slide-up', animClose: 'slide-down' }

// ورود از راست، خروج به راست
{ animOpen: 'slide-left', animClose: 'slide-right' }

// زوم این + فید اوت
{ animOpen: 'zoom-in', animClose: 'fade' }

// Flip سه‌بعدی
{ animOpen: 'flip-x', animClose: 'flip-y' }
```

---

## موقعیت‌ها (Positions)

۹ موقعیت مختلف:

```
top-left    top-center    top-right
center-left   center    center-right
bottom-left bottom-center bottom-right
```

```javascript
// مثال‌ها
{ position: 'top-right' }     // بالا-راست
{ position: 'bottom-center' } // پایین-وسط
{ position: 'center-left' }   // وسط-چپ
```

---

## سایزها (Sizes)

| نام | حداکثر عرض | کاربرد |
|-----|-----------|--------|
| `sm` | 300px | مودال‌های کوچک (تاییدیه، هشدار) |
| `md` | 500px | پیش‌فرض، مناسب اکثر موارد |
| `lg` | 800px | فرم‌های بزرگ |
| `xl` | 1140px | محتوای حجیم |
| `xxl` | 1400px | جداول بزرگ |
| `full` | 100% | تمام‌صفحه |
| `custom` | سفارشی | با `width` تنظیم می‌شود |

```javascript
// سایز پیش‌فرض
{ size: 'md' }

// فول اسکرین
{ size: 'full' }

// سفارشی
{ size: 'custom', width: '650px' }
```

---

## تم‌ها (Themes)

### تم روشن (پیش‌فرض)
```javascript
{ theme: '' }  // یا مشخص نکنید
```

### تم تاریک
```javascript
{ theme: 'dark' }
```

### تنظیم تم از طریق Attribute
```html
<div data-amb-theme="dark">...</div>
```

### اضافه کردن کلاس dark به wrapper
```javascript
modal.element.classList.add('amb-dark');
```

### متغیرهای CSS تم تاریک
```css
.amb-dark, [data-amb-theme="dark"] {
    --amb-bg: #1e1e2e;
    --amb-color: #cdd6f4;
    --amb-border: #313244;
    --amb-header-bg: #181825;
    --amb-footer-bg: #181825;
    --amb-close-color: #6c7086;
    --amb-close-hover: #cdd6f4;
    --amb-scrollbar: #45475a;
    --amb-backdrop: rgba(0,0,0,.7);
    --amb-shadow: 0 8px 32px rgba(0,0,0,.4);
}
```

---

## Backdrop & Keyboard

### تنظیمات Backdrop

```javascript
// حالت پیش‌فرض: کلیک بیرون = بسته شدن
{ backdrop: true }

// کلیک بیرون = بی‌اثر
{ backdrop: 'static' }

// بدون پس‌زمینه
{ backdrop: false }

// رنگ سفارشی پس‌زمینه
{ backdropColor: 'rgba(255, 0, 0, 0.3)' }
```

### Keyboard (کلید Escape)

```javascript
// فعال (پیش‌فرض)
{ keyboard: true }

// غیرفعال
{ keyboard: false }
```

### نمونه Static Backdrop با Escape غیرفعال
```javascript
AmbModal.open('important-modal', {
    title: '⚠️ هشدار مهم',
    body: '<p>این پیام باید تایید شود.</p>',
    backdrop: 'static',
    keyboard: false
});
```

---

## رویدادها (Events)

### رویدادهای استاندارد

```javascript
const modal = AmbModal.open('my-modal');
const wrapper = modal.element;

// قبل از نمایش (قابل cancel)
wrapper.addEventListener('show.amb.modal', function(e) {
    console.log('در حال باز شدن...');
    // e.preventDefault() = جلوگیری از نمایش
});

// بعد از اتمام انیمیشن باز شدن
wrapper.addEventListener('shown.amb.modal', function(e) {
    console.log('کاملا باز شد');
});

// قبل از بسته شدن (قابل cancel)
wrapper.addEventListener('hide.amb.modal', function(e) {
    console.log('در حال بسته شدن...');
    // e.preventDefault() = جلوگیری از بسته شدن
});

// بعد از اتمام انیمیشن بسته شدن
wrapper.addEventListener('hidden.amb.modal', function(e) {
    console.log('کاملا بسته شد');
});

// کلیک روی backdrop
wrapper.addEventListener('backdropclick.amb.modal', function(e) {
    console.log('backdrop کلیک شد');
});
```

### نمونه عملی: تایید قبل از بسته شدن

```javascript
const modal = AmbModal.open('form-modal', {
    title: 'فرم ثبت نام',
    body: '<input type="text" id="name" value="">',
    onclose: function(m) {
        const name = document.getElementById('name').value;
        if (name && !confirm('اطلاعات ذخیره نشده. خارج شوید؟')) {
            return false; // جلوگیری از بسته شدن
        }
    }
});
```

---

## متدهای کمکی

### Confirm Dialog

```javascript
AmbModal.confirm({
    title: 'حذف آیتم',
    message: 'آیا از حذف این آیتم اطمینان دارید؟',
    confirmText: 'بله، حذف کن',  // پیش‌فرض: 'Confirm'
    cancelText: 'لغو',          // پیش‌فرض: 'Cancel'
    size: 'sm',
    theme: 'dark',
    rtl: true,
    onConfirm: function() {
        // عملیات تایید
        AmbModal.alert({ message: 'حذف شد!', type: 'success' });
    },
    onCancel: function() {
        console.log('لغو شد');
    }
});
```

### Alert Dialog

```javascript
// موفقیت
AmbModal.alert({
    message: 'عملیات با موفقیت انجام شد!',
    type: 'success',
    title: 'موفق',
    btnText: 'باشه',
    autoClose: 2000  // بسته شدن خودکار بعد از 2 ثانیه
});

// خطا
AmbModal.alert({
    message: 'مشکلی پیش آمده است!',
    type: 'error',
    theme: 'dark'
});

// هشدار
AmbModal.alert({
    message: 'جلسه شما به زودی منقضی می‌شود.',
    type: 'warning',
    autoClose: 3000
});

// اطلاعات
AmbModal.alert({
    message: 'نسخه جدید در دسترس است.',
    type: 'info'
});
```

### Loading State

```javascript
const modal = AmbModal.open('data-modal', {
    title: 'در حال بارگذاری',
    body: '<p>لطفا منتظر بمانید...</p>',
    backdrop: 'static',
    keyboard: false
});

// نمایش loading
modal.setLoading(true);

// بعد از اتمام کار
setTimeout(() => {
    modal.setLoading(false);
    modal._body.innerHTML = '<p>✅ داده‌ها با موفقیت بارگذاری شدند.</p>';
}, 3000);
```

---

## Toast Timer

### نمونه Toast با AmbModal

```javascript
function showToast(type, message, duration = 3000) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    // ایجاد modal کوچک به عنوان toast
    const id = 'toast-' + Date.now();
    const modal = AmbModal.open(id, {
        body: `<div style="display:flex;align-items:center;gap:8px;font-size:14px;">
                <span>${icons[type]}</span> ${message}
              </div>`,
        size: 'sm',
        position: 'top-right',
        animOpen: 'slide-right',
        animClose: 'fade',
        backdrop: false,
        autoClose: duration,
        onload: function(m) {
            m._dialog.style.cssText = 'min-width:250px;padding:12px 16px;';
        }
    });
}

// استفاده
showToast('success', 'ذخیره شد!', 2500);
showToast('error', 'خطا در اتصال!', 3000);
```

---

## سفارشی‌سازی CSS

### متغیرهای CSS

```css
:root {
    /* می‌توانید این مقادیر را بازنویسی کنید */
    --amb-z: 1050;
    --amb-duration: 300ms;
    --amb-easing: ease-in-out;
    --amb-radius: 0.5rem;
    --amb-shadow: 0 8px 32px rgba(0,0,0,.18);
    --amb-backdrop: rgba(0,0,0,.5);
    
    /* تم روشن */
    --amb-bg: #fff;
    --amb-color: #212529;
    --amb-border: #dee2e6;
    --amb-header-bg: #f8f9fa;
    --amb-footer-bg: #f8f9fa;
    --amb-close-color: #6c757d;
    --amb-close-hover: #212529;
    --amb-scrollbar: #ced4da;
}
```

### نمونه سفارشی‌سازی

```css
/* گرد کردن بیشتر گوشه‌ها */
:root {
    --amb-radius: 1rem;
}

/* سایه بیشتر */
:root {
    --amb-shadow: 0 20px 60px rgba(0,0,0,.3);
}

/* انیمیشن کندتر */
.amb-dialog {
    --amb-duration: 500ms;
}
```

### کلاس‌های CSS مفید

```css
.amb-backdrop      /* پس‌زمینه */
.amb-wrapper       /* wrapper اصلی */
.amb-dialog        /* خود مودال */
.amb-header        /* هدر */
.amb-body          /* بدنه */
.amb-footer        /* فوتر */
.amb-title         /* عنوان */
.amb-close         /* دکمه بستن */
.amb-draggable     /* مودال قابل جابجایی */
.amb-loading       /* overlay بارگذاری */
.amb-spinner       /* اسپینر */
```

---

## سازگاری با Bootstrap

AmbModal با Bootstrap 5.3 API سازگار است:

```javascript
// معادل Bootstrap:
// const modal = bootstrap.Modal.getInstance(element);
const modal = AmbModal.Modal.getInstance(element);

// معادل Bootstrap:
// const modal = bootstrap.Modal.getOrCreateInstance(element);
const modal = AmbModal.Modal.getOrCreateInstance(element, options);

// معادل Bootstrap:
// modal.show();
modal.show();

// معادل Bootstrap:
// modal.hide();
modal.hide();

// معادل Bootstrap:
// modal.toggle();
modal.toggle();

// معادل Bootstrap:
// modal.dispose();
modal.dispose();
```

---

## نمونه‌های کامل

### ۱. فرم ثبت‌نام با اعتبارسنجی

```html
<button onclick="openRegisterForm()">ثبت نام</button>

<script>
function openRegisterForm() {
    AmbModal.open('register-form', {
        title: 'فرم ثبت نام',
        body: `
            <form id="registerForm">
                <label>نام: <input type="text" id="regName" required></label><br><br>
                <label>ایمیل: <input type="email" id="regEmail" required></label>
            </form>
        `,
        footer: `
            <button class="amb-btn amb-btn-outline" data-amb-dismiss="modal">لغو</button>
            <button class="amb-btn amb-btn-primary" id="submitReg">ثبت نام</button>
        `,
        size: 'md',
        backdrop: 'static',
        onload: function(m) {
            setTimeout(() => {
                document.getElementById('submitReg').onclick = function() {
                    const name = document.getElementById('regName').value;
                    if (!name) {
                        AmbModal.alert({ message: 'نام الزامی است!', type: 'error' });
                        return;
                    }
                    AmbModal.alert({ 
                        message: `${name} عزیز، ثبت نام با موفقیت انجام شد!`, 
                        type: 'success' 
                    });
                    m.hide();
                };
            }, 100);
        }
    });
}
</script>
```

### ۲. گالری تصاویر با Drag

```html
<button onclick="openGallery()">گالری تصاویر</button>

<script>
function openGallery() {
    AmbModal.open('gallery', {
        title: '🖼️ گالری تصاویر',
        body: `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <img src="https://picsum.photos/200/150?random=1" style="width:100%;border-radius:8px;">
                <img src="https://picsum.photos/200/150?random=2" style="width:100%;border-radius:8px;">
                <img src="https://picsum.photos/200/150?random=3" style="width:100%;border-radius:8px;">
                <img src="https://picsum.photos/200/150?random=4" style="width:100%;border-radius:8px;">
            </div>
        `,
        size: 'lg',
        draggable: true,
        animOpen: 'bounce',
        position: 'center'
    });
}
</script>
```

### ۳. ویزارد چند مرحله‌ای

```javascript
let currentStep = 1;
const totalSteps = 3;

function openWizard() {
    showStep(currentStep);
}

function showStep(step) {
    const steps = {
        1: {
            title: 'مرحله ۱: اطلاعات شخصی',
            body: '<label>نام: <input type="text"></label>',
            footer: `<button class="amb-btn amb-btn-primary" id="nextStep">بعدی ←</button>`
        },
        2: {
            title: 'مرحله ۲: آدرس',
            body: '<label>آدرس: <textarea></textarea></label>',
            footer: `
                <button class="amb-btn amb-btn-outline" id="prevStep">← قبلی</button>
                <button class="amb-btn amb-btn-primary" id="nextStep">بعدی ←</button>
            `
        },
        3: {
            title: 'مرحله ۳: تایید',
            body: '<p>✅ اطلاعات شما ثبت شد!</p>',
            footer: `<button class="amb-btn amb-btn-success" data-amb-dismiss="modal">اتمام</button>`
        }
    };
    
    const data = steps[step];
    AmbModal.open('wizard', {
        title: data.title,
        body: data.body,
        footer: data.footer,
        size: 'md',
        backdrop: 'static',
        onload: function(m) {
            setTimeout(() => {
                const nextBtn = document.getElementById('nextStep');
                const prevBtn = document.getElementById('prevStep');
                
                if (nextBtn) {
                    nextBtn.onclick = () => {
                        currentStep++;
                        m.hide();
                        setTimeout(() => showStep(currentStep), 300);
                    };
                }
                if (prevBtn) {
                    prevBtn.onclick = () => {
                        currentStep--;
                        m.hide();
                        setTimeout(() => showStep(currentStep), 300);
                    };
                }
            }, 100);
        }
    });
}
```

---

## نکات و ترفندها

### ۱. استفاده از HTML در title و body
```javascript
AmbModal.open('modal', {
    title: '<span style="color:red;">⚠️</span> هشدار',
    body: '<strong>متن bold</strong> و <em>ایتالیک</em>'
});
```

### ۲. چند مودال همزمان
```javascript
AmbModal.open('modal1', { title: 'اول' });
AmbModal.open('modal2', { title: 'دوم' });
// هر دو نمایش داده می‌شوند، z-index خودکار مدیریت می‌شود
```

### ۳. تغییر محتوا بعد از نمایش
```javascript
const modal = AmbModal.open('dynamic-modal', {
    title: 'در حال بارگذاری...',
    body: '<p>⏳ لطفا صبر کنید</p>'
});

// بعدا محتوا رو عوض کن
setTimeout(() => {
    modal._dialog.querySelector('.amb-title').innerHTML = 'آماده!';
    modal._body.innerHTML = '<p>✅ بارگذاری کامل شد</p>';
}, 2000);
```

### ۴. مودال responsive
```javascript
AmbModal.open('responsive-modal', {
    size: 'lg',
    mobileSize: 'full',      // تمام صفحه در موبایل
    mobileBreakpoint: 768    // breakpoint سفارشی
});
```

---

## راهنمای رفع اشکال

| مشکل | راه حل |
|------|--------|
| مودال نمایش داده نمی‌شود | مطمئن شوید ID منحصر به فرد است و CSS/JS به درستی لود شده‌اند |
| انیمیشن کار نمی‌کند | نام انیمیشن را چک کنید (مثال: `'zoom-in'` نه `'zoomIn'`) |
| backdrop کلیک نمی‌شود | `backdrop: 'static'` را با `backdrop: true` جایگزین کنید |
| Escape کار نمی‌کند | مطمئن شوید `keyboard: true` است |
| چند مودال تداخل دارند | هر مودال باید ID یکتا داشته باشد |

---

## مرورگرهای پشتیبانی شده

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

---

## مجوز

MIT License — استفاده در پروژه‌های شخصی و تجاری آزاد است.

---

> **نکته:** این مستندات را برای ارجاع‌های بعدی ذخیره کنید. AmbModal سبک، سریع و کاملاً قابل شخصی‌سازی است. برای سوالات بیشتر، به کد منبع یا issue tracker مراجعه کنید.