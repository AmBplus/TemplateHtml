// Profile Page Management
class ProfileManager {
  constructor() {
    this.isEditMode = false;
    this.originalData = {};
    this.currentData = {};
    this.init();
  }

  init() {
    this.loadUserData();
    this.setupEditToggle();
    this.setupImageUpload();
    this.setupFormValidation();
  }

  loadUserData() {
    // Mock data - Replace with actual API call
    this.originalData = {
      firstName: 'علی',
      lastName: 'احمدی',
      phone: '09123456789',
      major: 'پزشکی عمومی',
      studentId: '401234567',
      nationalId: '0123456789',
      profileImage: null
    };

    this.currentData = { ...this.originalData };
    this.populateForm();
  }

  populateForm() {
    document.getElementById('firstName').value = this.currentData.firstName;
    document.getElementById('lastName').value = this.currentData.lastName;
    document.getElementById('phone').value = this.currentData.phone;
    document.getElementById('major').value = this.currentData.major;
    document.getElementById('studentId').value = this.currentData.studentId;
    document.getElementById('nationalId').value = this.currentData.nationalId;
  }

  setupEditToggle() {
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    editBtn?.addEventListener('click', () => this.enterEditMode());
    saveBtn?.addEventListener('click', () => this.saveChanges());
    cancelBtn?.addEventListener('click', () => this.cancelEdit());
  }

  enterEditMode() {
    this.isEditMode = true;
    
    // Show/hide buttons
    document.getElementById('edit-btn')?.classList.add('hidden');
    document.getElementById('save-btn')?.classList.remove('hidden');
    document.getElementById('cancel-btn')?.classList.remove('hidden');

    // Enable inputs
    const inputs = document.querySelectorAll('.profile-input');
    inputs.forEach(input => {
      input.removeAttribute('readonly');
      input.classList.remove('bg-[var(--bg-secondary)]');
      input.classList.add('bg-[var(--bg-primary)]');
    });

    // Enable image upload
    document.getElementById('image-upload-btn')?.classList.remove('hidden');
  }

  exitEditMode() {
    this.isEditMode = false;
    
    // Show/hide buttons
    document.getElementById('edit-btn')?.classList.remove('hidden');
    document.getElementById('save-btn')?.classList.add('hidden');
    document.getElementById('cancel-btn')?.classList.add('hidden');

    // Disable inputs
    const inputs = document.querySelectorAll('.profile-input');
    inputs.forEach(input => {
      input.setAttribute('readonly', 'readonly');
      input.classList.add('bg-[var(--bg-secondary)]');
      input.classList.remove('bg-[var(--bg-primary)]');
      window.Utils.clearError(input);
    });

    // Disable image upload
    document.getElementById('image-upload-btn')?.classList.add('hidden');
  }

  cancelEdit() {
    this.currentData = { ...this.originalData };
    this.populateForm();
    this.exitEditMode();
    window.Utils.showToast('تغییرات لغو شد', 'info');
  }

  setupFormValidation() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    // Real-time validation
    const phoneInput = document.getElementById('phone');
    const nationalIdInput = document.getElementById('nationalId');

    phoneInput?.addEventListener('blur', () => {
      if (this.isEditMode) {
        this.validatePhone(phoneInput);
      }
    });

    nationalIdInput?.addEventListener('blur', () => {
      if (this.isEditMode) {
        this.validateNationalId(nationalIdInput);
      }
    });
  }

  validatePhone(input) {
    const result = window.Utils.Validators.mobilePhone(input.value);
    
    if (!result.valid) {
      window.Utils.showError(input, result.message);
      return false;
    }
    
    window.Utils.clearError(input);
    return true;
  }

  validateNationalId(input) {
    const result = window.Utils.Validators.nationalId(input.value);
    
    if (!result.valid) {
      window.Utils.showError(input, result.message);
      return false;
    }
    
    window.Utils.clearError(input);
    return true;
  }

  validateForm() {
    let isValid = true;
    const errors = [];

    // Validate first name
    const firstName = document.getElementById('firstName');
    const firstNameResult = window.Utils.Validators.required(firstName.value, 'نام');
    if (!firstNameResult.valid) {
      window.Utils.showError(firstName, firstNameResult.message);
      errors.push(firstNameResult.message);
      isValid = false;
    } else {
      window.Utils.clearError(firstName);
    }

    // Validate last name
    const lastName = document.getElementById('lastName');
    const lastNameResult = window.Utils.Validators.required(lastName.value, 'نام خانوادگی');
    if (!lastNameResult.valid) {
      window.Utils.showError(lastName, lastNameResult.message);
      errors.push(lastNameResult.message);
      isValid = false;
    } else {
      window.Utils.clearError(lastName);
    }

    // Validate phone
    const phone = document.getElementById('phone');
    if (!this.validatePhone(phone)) {
      errors.push('شماره تلفن نامعتبر است');
      isValid = false;
    }

    // Validate national ID
    const nationalId = document.getElementById('nationalId');
    if (!this.validateNationalId(nationalId)) {
      errors.push('کد ملی نامعتبر است');
      isValid = false;
    }

    return { isValid, errors };
  }

  async saveChanges() {
    const validation = this.validateForm();
    
    if (!validation.isValid) {
      window.Utils.showToast('لطفاً خطاهای فرم را برطرف کنید', 'error');
      return;
    }

    // Collect form data
    this.currentData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      phone: document.getElementById('phone').value,
      major: document.getElementById('major').value,
      studentId: document.getElementById('studentId').value,
      nationalId: document.getElementById('nationalId').value,
      profileImage: this.currentData.profileImage
    };

    // Show loading state
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>در حال ذخیره...</span>';
    saveBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.originalData = { ...this.currentData };
      this.exitEditMode();
      
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
      
      window.Utils.showToast('اطلاعات با موفقیت ذخیره شد', 'success');
      
      // Here you would make an actual API call:
      // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(this.currentData) });
    }, 1500);
  }

  setupImageUpload() {
    const imageInput = document.getElementById('profile-image-input');
    const uploadBtn = document.getElementById('image-upload-btn');
    const previewImg = document.getElementById('profile-preview');

    uploadBtn?.addEventListener('click', () => {
      imageInput?.click();
    });

    imageInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        window.Utils.showToast('لطفاً یک فایل تصویری انتخاب کنید', 'error');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        window.Utils.showToast('حجم فایل نباید بیشتر از ۲ مگابایت باشد', 'error');
        return;
      }

      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (previewImg) {
          previewImg.src = e.target.result;
          this.currentData.profileImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      window.Utils.showToast('تصویر انتخاب شد', 'success');
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
  });
} else {
  window.profileManager = new ProfileManager();
}
