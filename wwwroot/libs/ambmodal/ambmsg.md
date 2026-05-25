# 📚 AmbMsg v1.1 — مستندات کامل فارسی

> **فریم‌ورک مودال و Toast مبتنی بر Attribute — سازگار با Bootstrap 5.3 API**
>
> نسخه ۱.۱ | MIT License | بدون وابستگی | سبک و قدرتمند

---

## 📑 فهرست مطالب

1. [شروع سریع](#شروع-سریع)
2. [سه روش استفاده](#سه-روش-استفاده)
3. [تنظیمات (Options)](#تنظیمات-options)
4. [Attributeهای داده‌ای](#attributeهای-دادهای)
5. [API جاوااسکریپت — مودال](#api-جاوااسکریپت--مودال)
6. [Toast — اعلان‌های خودکار](#toast--اعلانهای-خودکار)
7. [Alert — پیام‌های هشدار](#alert--پیامهای-هشدار)
8. [Confirm — تأیید عملیات](#confirm--تأیید-عملیات)
9. [Container خودکار](#container-خودکار)
10. [انیمیشن‌ها](#انیمیشنها)
11. [موقعیت‌ها (Positions)](#موقعیتها-positions)
12. [سایزها (Sizes)](#سایزها-sizes)
13. [تم‌ها (Themes)](#تمها-themes)
14. [پشتیبانی RTL فارسی/عربی](#پشتیبانی-rtl-فارسیعربی)
15. [Loading State](#loading-state)
16. [رویدادها و Callbackها](#رویدادها-و-callbackها)
17. [سفارشی‌سازی CSS](#سفارشیسازی-css)
18. [سازگاری با Bootstrap](#سازگاری-با-bootstrap)
19. [نمونه‌های کامل](#نمونههای-کامل)

---

## شروع سریع

### نصب و راه‌اندازی

```html
<!-- 1. اضافه کردن CSS -->
<link rel="stylesheet" href="ambmsg.css">

<!-- 2. اضافه کردن JavaScript قبل از بسته شدن body -->
<script src="ambmsg.js"></script>
```

### ساده‌ترین مثال

```html
<!-- دکمه trigger -->
<button data-amb-toggle="modal" data-amb-target="#myModal">
    باز کردن مودال
</button>

<!-- محتوای مودال (مخفی) -->
<div id="myModal" style="display:none;"
     data-amb-title="عنوان مودال"
     data-amb-footer='<button class="amb-btn amb-btn-primary" data-amb-dismiss="modal">تایید</button>'>
    <p>محتوای اصلی مودال اینجا قرار می‌گیرد.</p>
</div>
```

---

## سه روش استفاده

AmbMsg از **سه روش** مختلف پشتیبانی می‌کند:

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
AmbMsg.open('my-modal-id', {
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
const modal = AmbMsg.Modal.getOrCreateInstance(document.getElementById('myModal'));
modal.show();

// فقط دریافت نمونه موجود
const existing = AmbMsg.Modal.getInstance('myModal');
```

---

## تنظیمات (Options)

### تمام تنظیمات قابل استفاده

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `title` | string | `''` | عنوان مودال (HTML مجاز است) |
| `body` | string | `''` | محتوای اصلی (HTML مجاز است) |
| `footer` | string | `''` | فوتر مودال (HTML مجاز است) |
| `size` | string | `'md'` | `sm`, `md`, `lg`, `xl`, `xxl`, `full`, `custom` |
| `position` | string | `'center'` | `center`, `top-left`, `top-center`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right` |
| `animOpen` | string | `'zoom-in'` | انیمیشن باز شدن |
| `animClose` | string | `'zoom-out'` | انیمیشن بسته شدن |
| `duration` | number | `300` | مدت زمان انیمیشن (میلی‌ثانیه) |
| `easing` | string | `'ease-in-out'` | تابع easing |
| `backdrop` | boolean/string | `true` | `true` = قابل کلیک، `'static'` = غیرقابل کلیک، `false` = بدون پس‌زمینه |
| `backdropColor` | string | `''` | رنگ سفارشی پس‌زمینه (مثال: `'rgba(0,0,0,.8)'`) |
| `keyboard` | boolean | `true` | بسته شدن با کلید Escape |
| `autoFocus` | boolean | `true` | فوکوس خودکار روی اولین المنت |
| `autoClose` | number | `0` | بسته شدن خودکار بعد از X میلی‌ثانیه (0 = غیرفعال) |
| `showHeader` | boolean | `true` | نمایش/عدم نمایش هدر مودال |
| `showCloseIcon` | boolean | `true` | نمایش/عدم نمایش آیکون بستن در هدر |
| `draggable` | boolean | `false` | قابلیت جابجایی با موس/تاچ |
| `rtl` | boolean | `false` | راست به چپ (فارسی/عربی) |
| `theme` | string | `''` | تم: `''` (روشن) یا `'dark'` |
| `width` | string | `''` | عرض سفارشی (مثال: `'650px'`) |
| `mobileBreakpoint` | number | `576` | breakpoint موبایل (پیکسل) |
| `mobileSize` | string | `''` | سایز در موبایل (مثال: `'full'`) |
| `noDefaultStyle` | boolean | `false` | حذف استایل‌های پیش‌فرض |
| `alertType` | string | `''` | نوع هدر هشدار: `success`, `error`, `warning`, `info` |

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

| Attribute | مقادیر | پیش‌فرض | توضیح |
|-----------|--------|---------|--------|
| `data-amb-title` | رشته | `''` | عنوان مودال |
| `data-amb-size` | `sm` `md` `lg` `xl` `xxl` `full` `custom` | `md` | سایز |
| `data-amb-position` | نام موقعیت | `center` | موقعیت |
| `data-amb-anim-open` | نام انیمیشن | `zoom-in` | انیمیشن باز |
| `data-amb-anim-close` | نام انیمیشن | `zoom-out` | انیمیشن بسته |
| `data-amb-duration` | عدد (ms) | `300` | مدت انیمیشن |
| `data-amb-easing` | CSS easing | `ease-in-out` | easing |
| `data-amb-backdrop` | `true` `false` `static` | `true` | backdrop |
| `data-amb-backdrop-color` | رنگ CSS | `''` | رنگ backdrop |
| `data-amb-keyboard` | `true` `false` | `true` | کلید Escape |
| `data-amb-auto-focus` | `true` `false` | `true` | فوکوس خودکار |
| `data-amb-auto-close` | عدد (ms) | `0` | بسته شدن خودکار |
| `data-amb-show-header` | `true` `false` | `true` | نمایش/عدم نمایش هدر |
| `data-amb-show-close-icon` | `true` `false` | `true` | نمایش/عدم نمایش آیکون بستن هدر |
| `data-amb-draggable` | `true` `false` | `false` | قابل جابجایی |
| `data-amb-rtl` | `true` `false` | `false` | راست به چپ |
| `data-amb-theme` | `dark` `''` | `''` | تم |
| `data-amb-width` | عرض CSS | `''` | عرض سفارشی |
| `data-amb-mobile-breakpoint` | عدد (px) | `576` | breakpoint موبایل |
| `data-amb-mobile-size` | نام سایز | `''` | سایز در موبایل |
| `data-amb-no-default-style` | (وجود attribute) | `false` | حذف استایل |
| `data-amb-footer` | HTML | `''` | محتوای فوتر |

### دکمه‌های Trigger

```html
<!-- روش استاندارد -->
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
<!-- بستن مودال -->
<button data-amb-dismiss="modal">بستن</button>
```

---

## API جاوااسکریپت — مودال

### متدهای سراسری

```javascript
// ایجاد و باز کردن مودال
AmbMsg.open(id, options);

// ایجاد بدون باز کردن
AmbMsg.create(id, options);

// بستن مودال
AmbMsg.close(id);

// حذف کامل مودال از DOM
AmbMsg.destroy(id);

// تنظیم پیش‌فرض‌های سراسری
AmbMsg.config({ size: 'lg', theme: 'dark' });
```

### متدهای Instance

```javascript
const modal = AmbMsg.open('my-modal', { title: 'عنوان' });

modal.show();               // نمایش
modal.hide();               // مخفی
modal.toggle();             // toggle
modal.dispose();            // حذف کامل
modal.setLoading(true);     // نمایش spinner
modal.setLoading(false);    // مخفی spinner
modal.config(options);      // بروزرسانی تنظیمات

// پراپرتی‌ها
modal.isVisible;            // boolean
modal.element;              // المنت wrapper
modal.id;                   // شناسه مودال
modal._body;                // المنت body (برای بروزرسانی محتوا)
modal._dialog;              // المنت dialog
```

### Bootstrap Compatible

```javascript
// مانند Bootstrap 5.3
const modal = AmbMsg.Modal.getInstance('myModal');
const modal2 = AmbMsg.Modal.getOrCreateInstance('myModal', options);
```

---

## Toast — اعلان‌های خودکار

Toast ها پیام‌های کوچک خودکار هستند که در گوشه صفحه نمایش داده می‌شوند و بعد از مدتی ناپدید می‌شوند.

### روش‌های Toast

```javascript
// متدهای AmbMsg.AmbToast
AmbMsg.AmbToast.show(message, type, duration);
AmbMsg.AmbToast.success('عملیات موفق!', 3000);
AmbMsg.AmbToast.error('خطا رخ داد!', 4000);
AmbMsg.AmbToast.warning('هشدار!', 2000);
AmbMsg.AmbToast.info('اطلاعیه', 5000);

// میانبرهای سراسری (در همه جا در دسترس)
ToastSuccess('ذخیره شد!');
ToastError('خطا!');
ToastWarning('هشدار!');
ToastInfo('اطلاع‌رسانی');
FireToast('success', 'پیام', 3000);
```

### پارامترهای Toast

| پارامتر | نوع | پیش‌فرض | توضیح |
|---------|-----|---------|--------|
| `message` | string | الزامی | متن پیام |
| `type` | string | `'info'` | `success`, `error`, `warning`, `info` |
| `duration` | number | `5000` | زمان نمایش (ms)، صفر = دائمی |

---

## Alert — پیام‌های هشدار

Alert ها مودال‌های اطلاع‌رسانی هستند که نیاز به تأیید کاربر دارند.

### روش‌های Alert

```javascript
// Alert عمومی
AmbMsg.alert({
    type: 'success',          // 'success', 'error', 'warning', 'info'
    title: 'موفقیت',
    message: 'اطلاعات ذخیره شد!',
    btnText: 'باشه',
    size: 'md',
    theme: 'dark',
    rtl: true,
    autoClose: 2000
});

// میانبرها
AmbMsg.success('موفقیت!', 'عملیات انجام شد');
AmbMsg.error('خطا!', 'مشکلی پیش آمده');
AmbMsg.warning('هشدار!', 'لطفاً توجه کنید');
AmbMsg.info('اطلاع', 'نسخه جدید موجود است');

// میانبرهای سراسری
AlertSuccess('موفقیت', 'ذخیره شد');
AlertError('خطا', 'مشکل سرور', { rtl: true });
AlertWarning('هشدار', 'جلسه به پایان می‌رسد');
AlertInfo('اطلاع', 'ویژگی جدید');

// با پارامتر options
FireAlert('error', 'عنوان', 'پیام', { rtl: true, theme: 'dark' });
```

### Alert با لیست پیام‌ها

```javascript
// چند پیام خطا (آرایه)
AmbMsg.error(
    'خطاهای اعتبارسنجی',
    [
        'نام کاربری الزامی است',
        'ایمیل نامعتبر است',
        'رمز عبور حداقل ۸ کاراکتر باشد'
    ],
    {
        rtl: true,
        btnText: 'باشه',
        theme: 'dark'
    }
);

// با میانبر سراسری
AlertError('خطاهای فرم', [
    'فیلد نام الزامی است',
    'شماره تلفن نادرست است'
], { rtl: true, btnText: 'تصحیح' });
```

---

## Confirm — تأیید عملیات

```javascript
AmbMsg.confirm({
    title: 'حذف آیتم',
    message: 'آیا مطمئنید که می‌خواهید این آیتم را حذف کنید؟',
    confirmText: 'بله، حذف کن',
    cancelText: 'انصراف',
    size: 'sm',
    theme: '',
    rtl: true,
    onConfirm: () => {
        console.log('تأیید شد');
        ToastSuccess('آیتم حذف شد');
    },
    onCancel: () => {
        console.log('لغو شد');
    }
});
```

---

## Container خودکار

AmbMsg به‌صورت خودکار DOM را اسکن می‌کند و container های خاص را به Toast و Alert تبدیل می‌کند. این قابلیت برای پیام‌های سمت سرور ایده‌آل است.

### Toast Container

```html
<div class="amb-toast-container" data-amb-toast-step="300">
    <div class="amb-toast-item"
         data-amb-toast-type="success"
         data-amb-toast-msg="✅ ذخیره شد"
         data-amb-toast-duration="3000">
    </div>
    <div class="amb-toast-item"
         data-amb-toast-type="error"
         data-amb-toast-msg="❌ خطا در اتصال">
    </div>
</div>
```

| Attribute | توضیح |
|-----------|--------|
| `data-amb-toast-type` | نوع toast: `success`, `error`, `warning`, `info` |
| `data-amb-toast-msg` | متن پیام |
| `data-amb-toast-duration` | مدت نمایش (اختیاری، پیش‌فرض: ۵۰۰۰) |
| `data-amb-toast-step` | تأخیر بین هر toast (پیش‌فرض: ۲۰۰) |

### Alert Container

```html
<div class="amb-alert-container" data-amb-alert-step="500">
    <div class="amb-alert-item"
         data-amb-alert-type="error"
         data-amb-alert-title="خطای اعتبارسنجی"
         data-amb-alert-msg="نام کاربری الزامی است"
         data-amb-alert-rtl="true"
         data-amb-alert-theme="dark"
         data-amb-alert-btn="باشه">
    </div>
    <div class="amb-alert-item"
         data-amb-alert-type="success"
         data-amb-alert-title="موفقیت"
         data-amb-alert-msg="اطلاعات ذخیره شد"
         data-amb-alert-rtl="true"
         data-amb-alert-auto-close="2000">
    </div>
</div>
```

| Attribute | توضیح |
|-----------|--------|
| `data-amb-alert-type` | نوع alert |
| `data-amb-alert-title` | عنوان |
| `data-amb-alert-msg` | پیام |
| `data-amb-alert-btn` | متن دکمه (پیش‌فرض: OK) |
| `data-amb-alert-rtl` | راست به چپ |
| `data-amb-alert-theme` | تم (`dark`) |
| `data-amb-alert-size` | سایز |
| `data-amb-alert-anim` | انیمیشن |
| `data-amb-alert-auto-close` | بسته شدن خودکار (ms) |

---

## انیمیشن‌ها

| نام انیمیشن | توضیح |
|-------------|--------|
| `fade` | محو ساده |
| `zoom-in` | بزرگ شدن از ۰.۷ (پیش‌فرض باز) |
| `zoom-out` | کوچک شدن از ۱.۳ (پیش‌فرض بسته) |
| `slide-up` | از پایین به بالا |
| `slide-down` | از بالا به پایین |
| `slide-left` | از راست به چپ |
| `slide-right` | از چپ به راست |
| `flip-x` | چرخش سه‌بعدی محور X |
| `flip-y` | چرخش سه‌بعدی محور Y |
| `bounce` | جهش ارتجاعی |
| `rotate` | چرخش + مقیاس |
| `none` | بدون انیمیشن |

```javascript
// ترکیب‌های پیشنهادی
AmbMsg.open('modal', { animOpen: 'slide-up',  animClose: 'slide-down' });
AmbMsg.open('modal', { animOpen: 'bounce',    animClose: 'fade' });
AmbMsg.open('modal', { animOpen: 'flip-x',    animClose: 'flip-y' });
AmbMsg.open('modal', { animOpen: 'zoom-in',   animClose: 'fade' });
```

---

## موقعیت‌ها (Positions)

```
┌─────────────┬─────────────┬─────────────┐
│  top-left   │ top-center  │  top-right  │
├─────────────┼─────────────┼─────────────┤
│ center-left │   center    │ center-right│
├─────────────┼─────────────┼─────────────┤
│bottom-left  │bottom-center│ bottom-right│
└─────────────┴─────────────┴─────────────┘
```

```javascript
AmbMsg.open('modal', { position: 'center' });       // پیش‌فرض
AmbMsg.open('modal', { position: 'top-right' });    // مناسب اعلان
AmbMsg.open('modal', { position: 'bottom-center' }); // مناسب موبایل
```

---

## سایزها (Sizes)

| سایز | حداکثر عرض | کاربرد |
|------|------------|--------|
| `sm` | 300px | تأییدیه، هشدارهای کوتاه |
| `md` | 500px | پیش‌فرض، اکثر موارد |
| `lg` | 800px | فرم‌های بزرگ |
| `xl` | 1140px | محتوای سنگین |
| `xxl` | 1400px | جداول بزرگ |
| `full` | ۱۰۰٪ | تمام‌صفحه |
| `custom` | دلخواه | با `width` |

```javascript
// ریسپانسیو: full در موبایل، lg در دسکتاپ
AmbMsg.open('modal', {
    size: 'lg',
    mobileSize: 'full',
    mobileBreakpoint: 768
});

// سایز سفارشی
AmbMsg.open('modal', { size: 'custom', width: '650px' });
```

---

## تم‌ها (Themes)

```javascript
// تم روشن (پیش‌فرض)
AmbMsg.open('modal', { theme: '' });

// تم تاریک
AmbMsg.open('modal', { theme: 'dark' });
```

```html
<!-- از طریق attribute -->
<div data-amb-theme="dark">...</div>
```

---

## پشتیبانی RTL فارسی/عربی

```javascript
// مودال فارسی با تم تاریک
AmbMsg.open('modal', {
    title: 'عنوان مودال',
    body: '<p>محتوای فارسی راست‌چین</p>',
    rtl: true,
    theme: 'dark'
});

// هشدار فارسی
AlertError('خطا', 'مشکلی پیش آمده است', {
    rtl: true,
    btnText: 'باشه'
});

// تأییدیه فارسی
AmbMsg.confirm({
    title: 'حذف',
    message: 'آیا مطمئنید؟',
    confirmText: 'بله',
    cancelText: 'خیر',
    rtl: true
});
```

```html
<!-- از طریق attribute -->
<div id="persianModal" style="display:none;"
     data-amb-title="مودال فارسی"
     data-amb-rtl="true"
     data-amb-theme="dark"
     data-amb-footer='<button class="amb-btn amb-btn-primary" data-amb-dismiss="modal">باشه</button>'>
    <p>متن فارسی راست‌چین</p>
</div>
```

---

## Loading State

```javascript
const modal = AmbMsg.open('loading-modal', {
    title: 'در حال پردازش...',
    body: '<p>لطفاً صبر کنید</p>',
    backdrop: 'static',
    keyboard: false
});

// نمایش spinner
modal.setLoading(true);

// بعد از اتمام عملیات
fetch('/api/save', { method: 'POST' })
    .then(res => res.json())
    .then(() => {
        modal.setLoading(false);
        modal._body.innerHTML = '<p>✅ ذخیره شد!</p>';
        setTimeout(() => modal.hide(), 1500);
    })
    .catch(() => {
        modal.setLoading(false);
        AmbMsg.error('خطا', 'مشکل در ذخیره‌سازی');
        modal.hide();
    });
```

---

## رویدادها و Callbackها

### رویدادهای DOM

```javascript
const modal = AmbMsg.open('evt-modal', { title: 'تست رویداد' });
const wrapper = modal.element;

// قبل از نمایش (قابل لغو)
wrapper.addEventListener('show.amb.modal', (e) => {
    console.log('در حال باز شدن...');
    // e.preventDefault()  →  لغو باز شدن
});

// بعد از نمایش کامل
wrapper.addEventListener('shown.amb.modal', () => {
    console.log('کاملاً باز شد');
});

// قبل از بستن (قابل لغو)
wrapper.addEventListener('hide.amb.modal', (e) => {
    if (!confirm('بسته شود؟')) e.preventDefault();
});

// بعد از بسته شدن کامل
wrapper.addEventListener('hidden.amb.modal', () => {
    console.log('بسته شد');
});

// کلیک روی backdrop
wrapper.addEventListener('backdropclick.amb.modal', () => {
    console.log('backdrop کلیک شد');
});
```

### Callbackها در options

```javascript
AmbMsg.open('modal', {
    title: 'با callback',
    body: '<p>محتوا</p>',
    onload:          (m) => console.log('شروع باز شدن'),
    afterload:       (m) => console.log('کاملاً باز شد'),
    onclose:         (m) => { /* return false برای لغو */ },
    afterclose:      (m) => console.log('بسته شد'),
    onbackdropclick: (m) => console.log('backdrop')
});
```

---

## سفارشی‌سازی CSS

### متغیرهای CSS

```css
:root {
    --amb-radius: 0.5rem;           /* گوشه‌های گرد */
    --amb-shadow: 0 10px 40px rgba(0,0,0,.2);  /* سایه */
    --amb-duration: 300ms;          /* سرعت انیمیشن */
    --amb-easing: ease-in-out;      /* نوع انیمیشن */

    /* رنگ‌های تم روشن */
    --amb-bg: #fff;
    --amb-color: #212529;
    --amb-border: #dee2e6;
    --amb-header-bg: #f8f9fa;
    --amb-footer-bg: #f8f9fa;
}
```

### کلاس‌های CSS

```css
.amb-backdrop      /* پس‌زمینه overlay */
.amb-wrapper       /* پوشش کلی */
.amb-dialog        /* دیالوگ مودال */
.amb-header        /* هدر */
.amb-body          /* بدنه */
.amb-footer        /* فوتر */
.amb-title         /* عنوان */
.amb-close         /* دکمه بستن */
.amb-draggable     /* مودال قابل جابجایی */
.amb-loading       /* overlay loading */
.amb-spinner       /* spinner */
.amb-dark          /* تم تاریک */
.amb-rtl           /* راست به چپ */
```

---

## سازگاری با Bootstrap

AmbMsg همان API Bootstrap 5.3 را پشتیبانی می‌کند:

```javascript
// Bootstrap
const modal = bootstrap.Modal.getInstance(element);
// AmbMsg
const modal = AmbMsg.Modal.getInstance('modal-id');

// هر دو این متدها یکسان هستند
modal.show();
modal.hide();
modal.toggle();
modal.dispose();
```

---

## نمونه‌های کامل

### فرم ثبت‌نام فارسی

```javascript
AmbMsg.open('register-form', {
    title: 'ثبت‌نام',
    body: `
        <form id="regForm">
            <label>نام: <input type="text" id="regName" required></label><br><br>
            <label>ایمیل: <input type="email" id="regEmail" required></label><br><br>
            <label>رمز عبور: <input type="password" id="regPass" required></label>
        </form>
    `,
    footer: `
        <button class="amb-btn amb-btn-outline" data-amb-dismiss="modal">انصراف</button>
        <button class="amb-btn amb-btn-primary" id="submitReg">ثبت‌نام</button>
    `,
    size: 'md',
    rtl: true,
    backdrop: 'static',
    afterload: () => {
        document.getElementById('submitReg').onclick = () => {
            const name = document.getElementById('regName').value;
            if (!name) {
                AlertError('خطا', 'نام الزامی است', { rtl: true, btnText: 'باشه' });
                return;
            }
            AmbMsg.success('موفقیت!', `${name} عزیز، ثبت‌نام شما انجام شد!`, { rtl: true });
            AmbMsg.close('register-form');
        };
    }
});
```

### ارسال داده با loading

```javascript
async function submitData(data) {
    const modal = AmbMsg.open('submit-modal', {
        title: 'ارسال اطلاعات',
        body: '<p>لطفاً صبر کنید...</p>',
        backdrop: 'static',
        keyboard: false,
        rtl: true
    });

    modal.setLoading(true);

    try {
        await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
        modal.setLoading(false);
        modal._body.innerHTML = '<p>✅ اطلاعات با موفقیت ذخیره شد!</p>';
        setTimeout(() => modal.hide(), 2000);
        ToastSuccess('ذخیره شد!');
    } catch (err) {
        modal.setLoading(false);
        AmbMsg.error('خطا', 'مشکل در ارتباط با سرور', { rtl: true, btnText: 'باشه' });
        modal.hide();
    }
}
```

### جریان کامل تأیید → loading → نتیجه

```javascript
AmbMsg.confirm({
    title: 'حذف فایل',
    message: 'آیا مطمئنید می‌خواهید این فایل را حذف کنید؟',
    confirmText: 'بله، حذف کن',
    cancelText: 'انصراف',
    rtl: true,
    onConfirm: async () => {
        const modal = AmbMsg.open('delete-modal', {
            title: 'در حال حذف...',
            body: '<p>لطفاً صبر کنید</p>',
            backdrop: 'static',
            rtl: true
        });
        modal.setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        modal.setLoading(false);
        modal._body.innerHTML = '<p>✅ فایل حذف شد!</p>';
        setTimeout(() => modal.hide(), 1500);
        setTimeout(() => ToastSuccess('فایل با موفقیت حذف شد'), 2000);
    }
});
```

### پیام‌های سرور با Container خودکار (PHP)

```html
<!-- خطاهای اعتبارسنجی از PHP -->
<div class="amb-toast-container" data-amb-toast-step="300">
    <?php foreach ($errors as $err): ?>
        <div class="amb-toast-item"
             data-amb-toast-type="error"
             data-amb-toast-msg="<?= htmlspecialchars($err) ?>">
        </div>
    <?php endforeach; ?>
</div>

<!-- پیام موفقیت -->
<?php if ($success): ?>
<div class="amb-alert-container" data-amb-alert-step="300">
    <div class="amb-alert-item"
         data-amb-alert-type="success"
         data-amb-alert-title="موفقیت"
         data-amb-alert-msg="<?= htmlspecialchars($successMsg) ?>"
         data-amb-alert-rtl="true"
         data-amb-alert-btn="باشه">
    </div>
</div>
<?php endif; ?>
```

---

## مرجع سریع

```javascript
// Toast
ToastSuccess('پیام');
ToastError('پیام');
ToastWarning('پیام');
ToastInfo('پیام');

// Alert
AlertSuccess('عنوان', 'پیام');
AlertError('عنوان', 'پیام');
AlertWarning('عنوان', 'پیام');
AlertInfo('عنوان', 'پیام');

// Confirm
AmbMsg.confirm({ title: '...', message: '...', onConfirm: () => {} });

// Modal
AmbMsg.open('id', { title: '...', body: '...' });
AmbMsg.close('id');
AmbMsg.destroy('id');
AmbMsg.config({ theme: 'dark' });
```

---

## مستندات بیشتر

| فایل | توضیح |
|------|--------|
| [docs/00-quick-reference.md](docs/00-quick-reference.md) | مرجع سریع انگلیسی |
| [docs/01-complete-api-documentation.md](docs/01-complete-api-documentation.md) | مستندات کامل API |
| [docs/02-javascript-usage.md](docs/02-javascript-usage.md) | استفاده با JavaScript |
| [docs/03-html-attribute-usage.md](docs/03-html-attribute-usage.md) | استفاده با HTML Attribute |
| [docs/04-auto-attribute-documentation.md](docs/04-auto-attribute-documentation.md) | Container خودکار |
