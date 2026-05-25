# ✅ FormValidator — Attribute Based Validation

یک ماژول اعتبارسنجی فرم کاملاً attribute-based که بدون نوشتن JS کار می‌کند.  
خطاها از طریق **AmbModal** نمایش داده می‌شوند.

---

## 📦 نصب (ترتیب مهم است)

```html
<!-- ابتدا AmbModal -->
<script src="/wwwroot/js/amb-modal-module/amb-modal.js"></script>
<!-- سپس FormValidator -->
<script src="/wwwroot/js/form-validator-module/form-validator.js"></script>
```

---

## 🚀 استفاده سریع

```html
<!-- روی فرم: data-validate اضافه کنید -->
<form data-validate data-validate-title="خطاهای فرم">

    <!-- روی هر input: data-rules و data-label -->
    <input
        type="text"
        id="username"
        data-rules="required|min:3|max:20|alphanumeric"
        data-label="نام کاربری"
    >

    <input
        type="password"
        id="password"
        data-rules="required|min:8|strongPassword"
        data-label="رمز عبور"
    >

    <button type="submit">ورود</button>
</form>
```

---

## 📋 لیست کامل قوانین

قوانین با `|` از هم جدا می‌شوند:

| قانون | مثال | توضیح |
|-------|------|-------|
| `required` | `required` | فیلد الزامی |
| `min:N` | `min:3` | حداقل N کاراکتر |
| `max:N` | `max:50` | حداکثر N کاراکتر |
| `minVal:N` | `minVal:18` | حداقل مقدار عددی |
| `maxVal:N` | `maxVal:100` | حداکثر مقدار عددی |
| `numeric` | `numeric` | فقط عدد |
| `alpha` | `alpha` | فقط حروف (فارسی/انگلیسی) |
| `alphanumeric` | `alphanumeric` | حروف و عدد |
| `email` | `email` | فرمت ایمیل |
| `phone` | `phone` | موبایل ایرانی (09xxxxxxxxx) |
| `nationalId` | `nationalId` | کد ملی ایرانی (الگوریتم کامل) |
| `url` | `url` | فرمت URL |
| `date` | `date` | فرمت YYYY-MM-DD |
| `checked` | `checked` | checkbox/radio باید انتخاب شده باشد |
| `match:#sel` | `match:#confirm-pass` | برابری با المان دیگر |
| `regex:PATTERN` | `regex:^[A-Z]{3}$` | regex دلخواه |
| `noSpace` | `noSpace` | بدون فضای خالی |
| `persian` | `persian` | فقط حروف فارسی |
| `english` | `english` | فقط حروف انگلیسی |
| `strongPassword` | `strongPassword` | رمز قوی (8+ کاراکتر، عدد، بزرگ، کوچک) |

---

## 💡 مثال‌های پیشرفته

### regex دلخواه
```html
<!-- کد پستی ایران: 10 رقم -->
<input data-rules="required|regex:^\d{10}$" data-label="کد پستی">

<!-- فقط حروف انگلیسی بزرگ -->
<input data-rules="regex:^[A-Z]+$" data-label="کد">

<!-- pipe واقعی در regex با \| escape می‌شود -->
<input data-rules="regex:^(yes\|no)$" data-label="پاسخ">
```

### تأیید رمز عبور
```html
<input type="password" id="pass"
    data-rules="required|min:8|strongPassword"
    data-label="رمز عبور">

<input type="password" id="pass-confirm"
    data-rules="required|match:#pass"
    data-label="تکرار رمز عبور">
```

### فرم با عنوان سفارشی
```html
<form data-validate data-validate-title="لطفاً موارد زیر را اصلاح کنید">
```

---

## 🔧 API عمومی JavaScript

```javascript
// init دستی (برای فرم‌هایی که بعداً به DOM اضافه شدند)
FormValidator.init();

// اعتبارسنجی دستی یک فرم
const result = FormValidator.validateForm(document.getElementById('my-form'));
if (!result.valid) {
    console.log(result.errors); // آرایه پیام‌های خطا
}

// اعتبارسنجی یک المان
const errors = FormValidator.validateElement(inputEl);

// تغییر پیام یک قانون
FormValidator.setMessage('required', (label) => `${label} را وارد کنید`);
```

---

## 🎯 رفتار ماژول

- **هنگام submit:** همه فیلدها بررسی می‌شوند، خطاها در AmbModal نمایش داده می‌شوند
- **هنگام blur:** فیلد جاری بررسی می‌شود (inline error)
- **هنگام input:** اگر فیلد قبلاً خطا داشت، real-time بررسی می‌شود
- **border قرمز:** فیلد خطادار با `fv-invalid` مشخص می‌شود
- **border سبز:** فیلد معتبر با `fv-valid` مشخص می‌شود

---

## 📁 ساختار فایل‌ها

```
wwwroot/js/
├── amb-modal-module/
│   ├── amb-modal.js      ← وابستگی
│   └── README.md
└── form-validator-module/
    ├── form-validator.js  ← ماژول اصلی
    └── README.md          ← این فایل
```

---

*ساخته شده با ❤️ برای سامانه دانا*
