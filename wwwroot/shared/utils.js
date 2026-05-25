// Utility Functions for Validation and Helpers

// Persian/Farsi number conversion
const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function toEnglishDigits(str) {
  if (!str) return '';
  
  let result = str.toString();
  
  // Convert Persian digits
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianNumbers[i], 'g'), i);
  }
  
  // Convert Arabic digits
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(arabicNumbers[i], 'g'), i);
  }
  
  return result;
}

function toPersianDigits(str) {
  if (!str) return '';
  
  let result = str.toString();
  
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(i, 'g'), persianNumbers[i]);
  }
  
  return result;
}

// Validation Functions
const Validators = {
  // Iranian National ID (کد ملی) validation
  nationalId: (value) => {
    const code = toEnglishDigits(value);
    
    if (!code || code.length !== 10) {
      return { valid: false, message: 'کد ملی باید ۱۰ رقم باشد' };
    }
    
    if (!/^\d{10}$/.test(code)) {
      return { valid: false, message: 'کد ملی فقط باید شامل اعداد باشد' };
    }
    
    // Check for invalid patterns
    const invalidPatterns = ['0000000000', '1111111111', '2222222222', '3333333333', 
                            '4444444444', '5555555555', '6666666666', '7777777777', 
                            '8888888888', '9999999999'];
    
    if (invalidPatterns.includes(code)) {
      return { valid: false, message: 'کد ملی نامعتبر است' };
    }
    
    // Validate check digit
    const check = parseInt(code[9]);
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(code[i]) * (10 - i);
    }
    
    const remainder = sum % 11;
    const isValid = (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
    
    return isValid 
      ? { valid: true, message: '' }
      : { valid: false, message: 'کد ملی نامعتبر است' };
  },

  // Iranian mobile phone validation
  mobilePhone: (value) => {
    const phone = toEnglishDigits(value);
    
    if (!phone) {
      return { valid: false, message: 'شماره تلفن الزامی است' };
    }
    
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Check Iranian mobile format (09xxxxxxxxx)
    const mobilePattern = /^09\d{9}$/;
    
    if (!mobilePattern.test(cleanPhone)) {
      return { valid: false, message: 'شماره تلفن همراه باید با ۰۹ شروع شود و ۱۱ رقم باشد' };
    }
    
    return { valid: true, message: '' };
  },

  // Required field validation
  required: (value, fieldName = 'این فیلد') => {
    if (!value || value.toString().trim() === '') {
      return { valid: false, message: `${fieldName} الزامی است` };
    }
    return { valid: true, message: '' };
  },

  // Email validation
  email: (value) => {
    if (!value) {
      return { valid: false, message: 'ایمیل الزامی است' };
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(value)) {
      return { valid: false, message: 'فرمت ایمیل نامعتبر است' };
    }
    
    return { valid: true, message: '' };
  },

  // Min length validation
  minLength: (value, min, fieldName = 'این فیلد') => {
    if (!value || value.length < min) {
      return { valid: false, message: `${fieldName} باید حداقل ${toPersianDigits(min)} کاراکتر باشد` };
    }
    return { valid: true, message: '' };
  },

  // Max length validation
  maxLength: (value, max, fieldName = 'این فیلد') => {
    if (value && value.length > max) {
      return { valid: false, message: `${fieldName} نباید بیشتر از ${toPersianDigits(max)} کاراکتر باشد` };
    }
    return { valid: true, message: '' };
  }
};

// Show validation error message
function showError(inputElement, message) {
  const errorElement = inputElement.parentElement.querySelector('.error-message');
  
  inputElement.classList.add('input-error');
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  } else {
    const error = document.createElement('p');
    error.className = 'error-message text-red-500 text-sm mt-1';
    error.textContent = message;
    inputElement.parentElement.appendChild(error);
  }
}

// Clear validation error
function clearError(inputElement) {
  const errorElement = inputElement.parentElement.querySelector('.error-message');
  
  inputElement.classList.remove('input-error');
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
  }
}

// Debounce function for search/filter
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '۰ بایت';
  
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return toPersianDigits((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' :
    'bg-blue-500'
  } text-white`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Export utilities
window.Utils = {
  toEnglishDigits,
  toPersianDigits,
  Validators,
  showError,
  clearError,
  debounce,
  formatFileSize,
  showToast
};
