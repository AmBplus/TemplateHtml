/*!
 * AmbMsg v1.1 | MIT License
 * Attribute-driven modal framework — Bootstrap 5.3 API compatible
 * (Patched: Memory leaks, Stacked modals, Drag/Anim conflicts, CSP, etc.)
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.AmbMsg = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    /* ── Helpers ──────────────────────────────────── */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const attr = (el, name) => el.getAttribute(name);
    const hasAttr = (el, name) => el.hasAttribute(name);
    const uid = () => 'amb-' + Math.random().toString(36).slice(2, 8);

    const merge = (...objs) => Object.assign({}, ...objs);

    const emit = (el, name, detail = {}) => {
        const e = new CustomEvent(name + '.amb.modal', { bubbles: true, cancelable: true, detail });
        return el.dispatchEvent(e);
    };

    const afterAnim = (el, fn) => {
        const dur = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 0;
        let fired = false;
        const done = () => {
            if (fired) return;
            fired = true;
            fn();
        };
        if (dur > 0) {
            el.addEventListener('animationend', done, { once: true });
            // فال‌بک: در صورت عدم اجرای انیمیشن، کد هنگ نکند
            setTimeout(done, dur + 50); 
        } else {
            done();
        }
    };

    const focusFirst = (el) => {
        const sel = 'input:not([disabled]),select:not([disabled]),textarea:not([disabled]),' +
            'button:not([disabled]):not(.amb-close),[tabindex]:not([tabindex="-1"]),a[href]';
        const first = $(sel, el);
        if (first) first.focus();
        else el.focus();
    };

    const trapFocus = (el, e) => {
        const focusable = $$('button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
            'textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),a[href]', el)
            .filter(n => n.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
            e.preventDefault();
            (e.shiftKey ? last : first).focus();
        }
    };

    const applyVars = (wrapper, cfg, backdrop) => {
        if (cfg.duration) wrapper.style.setProperty('--amb-duration', cfg.duration + 'ms');
        if (cfg.easing) wrapper.style.setProperty('--amb-easing', cfg.easing);
        if (cfg.backdropColor) {
            const bd = backdrop || $('.amb-backdrop', wrapper.parentNode) || wrapper.previousElementSibling;
            if (bd) bd.style.background = cfg.backdropColor;
        }
    };

    let _z = 1050;
    const nextZ = () => (_z += 10);

    const _registry = new Map();
    let _openModalCount = 0; // برای مدیریت اسکرول‌بار در مودال‌های تو در تو
    const _modalStack = [];  // برای مدیریت دکمه Escape در مودال‌های تو در تو

    const DEFAULTS = {
        title: '',
        body: '',
        footer: '',
        showHeader: true,
        showCloseIcon: true,
        size: 'md',
        position: 'center',
        animOpen: 'zoom-in',
        animClose: 'zoom-out',
        duration: 300,
        easing: 'ease-in-out',
        backdrop: true,
        backdropColor: '',
        keyboard: true,
        autoFocus: true,
        autoClose: 0,
        draggable: false,
        rtl: false,
        theme: '',
        width: '',
        mobileBreakpoint: 576,
        mobileSize: '',
        noDefaultStyle: false,
        alertType: '',
        onload: null,
        afterload: null,
        onclose: null,
        afterclose: null,
        onbackdropclick: null,
    };

    /* ════════════════ ICON LIBRARY ════════════════ */
    const ICONS = {
        close: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
    </svg>`,

        alert: {
            success: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            error: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        },

        bullet: {
            success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
            error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        },

        header: {
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        },
    };

    /* ── Build DOM ────────────────────────────────── */
    const buildDOM = (id, cfg, wrapper) => {
        const pos = cfg.position.replace(/\s+/g, '-');
        const sizeClass = cfg.size === 'custom' ? '' : 'amb-' + cfg.size;
        const themeClass = cfg.theme === 'dark' ? 'amb-dark' : '';
        const rtlClass = cfg.rtl ? 'amb-rtl' : '';

        const backdrop = cfg.backdrop !== false ? (() => {
            const bd = document.createElement('div');
            bd.className = 'amb-backdrop' + (themeClass ? ' ' + themeClass : '');
            return bd;
        })() : null;

        wrapper.className = ['amb-wrapper', 'amb-pos-' + pos, themeClass, rtlClass].filter(Boolean).join(' ');
        wrapper.setAttribute('role', 'dialog');
        wrapper.setAttribute('aria-modal', 'true');
        wrapper.setAttribute('aria-describedby', id + '-body');
        if (cfg.showHeader !== false) wrapper.setAttribute('aria-labelledby', id + '-title');
        wrapper.tabIndex = -1;

        const dialog = document.createElement('div');
        dialog.className = ['amb-dialog', sizeClass, cfg.draggable ? 'amb-draggable' : ''].filter(Boolean).join(' ');
        dialog.tabIndex = -1;
        if (cfg.width) dialog.style.maxWidth = cfg.width;

        if (cfg.showHeader !== false) {
            const header = document.createElement('div');
            header.className = 'amb-header';

            if (cfg.alertType && ICONS.header[cfg.alertType]) {
                header.classList.add('amb-alert-' + cfg.alertType);
                const alertIcon = document.createElement('span');
                alertIcon.className = 'amb-header-icon';
                alertIcon.innerHTML = ICONS.header[cfg.alertType];
                header.append(alertIcon);
            }

            const title = document.createElement('h5');
            title.className = 'amb-title';
            title.id = id + '-title';
            title.innerHTML = cfg.title;
            header.append(title);

            if (cfg.showCloseIcon !== false) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'amb-close';
                closeBtn.setAttribute('aria-label', 'Close');
                closeBtn.innerHTML = ICONS.close;
                closeBtn.dataset.ambDismiss = 'modal';
                header.append(closeBtn);
            }

            dialog.append(header);
        }

        const body = document.createElement('div');
        body.className = 'amb-body';
        body.id = id + '-body';
        body.innerHTML = cfg.body;

        dialog.append(body);

        if (cfg.footer) {
            const footer = document.createElement('div');
            footer.className = 'amb-footer';
            footer.innerHTML = cfg.footer;
            dialog.append(footer);
        }

        wrapper.innerHTML = '';
        wrapper.append(dialog);
        return { backdrop, wrapper, dialog, body };
    };

    /* ── Draggable logic ──────────────────────────── */
    const makeDraggable = (dialog) => {
        const header = $('.amb-header', dialog);
        if (!header) return;
        let ox = 0, oy = 0, dx = 0, dy = 0;
        const onMove = (e) => {
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            dx = cx - ox; dy = cy - oy;
            // استفاده از margin به جای transform تا با انیمیشن‌ها تداخل نکند
            dialog.style.marginLeft = dx + 'px';
            dialog.style.marginTop = dy + 'px';
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
        };
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.amb-close')) return;
            ox = e.clientX - dx; oy = e.clientY - dy;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
        header.addEventListener('touchstart', (e) => {
            if (e.target.closest('.amb-close')) return;
            ox = e.touches[0].clientX - dx; oy = e.touches[0].clientY - dy;
            document.addEventListener('touchmove', onMove, { passive: true });
            document.addEventListener('touchend', onUp);
        }, { passive: true });
    };

    /* ══════════════ Modal Class ═════════════════ */
    class Modal {
        constructor(target, options = {}) {
            if (typeof target === 'string' && !target.startsWith('#')) {
                this._id = target;
                this._el = document.getElementById(target);
            } else if (typeof target === 'string') {
                this._id = target.slice(1);
                this._el = document.getElementById(this._id);
            } else {
                this._el = target;
                this._id = target.id || uid();
                if (!target.id) target.id = this._id;
            }

            if (!this._el) {
                this._el = document.createElement('div');
                this._el.id = this._id;
                this._el.style.display = 'none';
                document.body.append(this._el);
            }

            const src = this._el;
            const fromAttr = src ? {
                title: attr(src, 'data-amb-title') || '',
                body: src.innerHTML || '',
                size: attr(src, 'data-amb-size') || undefined,
                position: attr(src, 'data-amb-position') || undefined,
                animOpen: attr(src, 'data-amb-anim-open') || undefined,
                animClose: attr(src, 'data-amb-anim-close') || undefined,
                duration: attr(src, 'data-amb-duration') ? +attr(src, 'data-amb-duration') : undefined,
                easing: attr(src, 'data-amb-easing') || undefined,
                backdrop: hasAttr(src, 'data-amb-backdrop') ? attr(src, 'data-amb-backdrop') === 'false' ? false : attr(src, 'data-amb-backdrop') || true : undefined,
                backdropColor: attr(src, 'data-amb-backdrop-color') || undefined,
                keyboard: hasAttr(src, 'data-amb-keyboard') ? attr(src, 'data-amb-keyboard') !== 'false' : undefined,
                autoFocus: hasAttr(src, 'data-amb-auto-focus') ? attr(src, 'data-amb-auto-focus') !== 'false' : undefined,
                autoClose: attr(src, 'data-amb-auto-close') ? +attr(src, 'data-amb-auto-close') : undefined,
                showHeader: hasAttr(src, 'data-amb-show-header') ? attr(src, 'data-amb-show-header') !== 'false' : undefined,
                showCloseIcon: hasAttr(src, 'data-amb-show-close-icon') ? attr(src, 'data-amb-show-close-icon') !== 'false' : undefined,
                draggable: attr(src, 'data-amb-draggable') === 'true',
                rtl: attr(src, 'data-amb-rtl') === 'true',
                theme: attr(src, 'data-amb-theme') || undefined,
                alertType: attr(src, 'data-amb-alert-type') || undefined,
                width: attr(src, 'data-amb-width') || undefined,
                mobileBreakpoint: attr(src, 'data-amb-mobile-breakpoint') ? +attr(src, 'data-amb-mobile-breakpoint') : undefined,
                mobileSize: attr(src, 'data-amb-mobile-size') || undefined,
                noDefaultStyle: hasAttr(src, 'data-amb-no-default-style'),
            } : {};

            Object.keys(fromAttr).forEach(k => fromAttr[k] === undefined && delete fromAttr[k]);

            this.cfg = merge(DEFAULTS, fromAttr, options);
            this._sourceHTML = src.innerHTML;
            this._sourceClassName = src.className;
            this._sourceStyle = src.getAttribute('style');
            this._sourceA11yAttrs = {
                role: src.getAttribute('role'),
                ariaModal: src.getAttribute('aria-modal'),
                ariaLabelledby: src.getAttribute('aria-labelledby'),
                ariaDescribedby: src.getAttribute('aria-describedby'),
                tabIndex: src.getAttribute('tabindex'),
            };
            this._visible = false;
            this._autoCloseTimer = null;
            this._trapHandler = null;
            this._keyHandler = null;
            
            // رفرنس برای پاکسازی نشت حافظه
            this._resizeHandler = () => this._applyMobileSize();

            this._build();
            _registry.set(this._id, this);
        }

        _build() {
            const { backdrop, wrapper, dialog, body } = buildDOM(this._id, this.cfg, this._el);
            this._backdrop = backdrop;
            this._wrapper = wrapper;
            this._dialog = dialog;
            this._body = body;

            const z = nextZ();
            if (backdrop) {
                backdrop.style.zIndex = z;
                backdrop.style.display = 'none';
                document.body.append(backdrop);
            }
            wrapper.style.zIndex = z + 1;
            wrapper.style.display = 'none';

            if (this.cfg.draggable) makeDraggable(dialog);

            this._applyMobileSize();
            window.addEventListener('resize', this._resizeHandler);

            wrapper.addEventListener('click', (e) => {
                if (e.target.closest('[data-amb-dismiss="modal"]')) { this.hide(); return; }
                if (e.target === wrapper) {
                    emit(wrapper, 'backdropclick', { id: this._id });
                    if (typeof this.cfg.onbackdropclick === 'function') this.cfg.onbackdropclick(this);
                    if (this.cfg.backdrop === true) this.hide();
                }
            });
        }

        _applyMobileSize() {
            const bp = this.cfg.mobileBreakpoint;
            const ms = this.cfg.mobileSize;
            if (!ms) return;
            const isMobile = window.innerWidth <= bp;
            const sizes = ['amb-sm', 'amb-md', 'amb-lg', 'amb-xl', 'amb-xxl', 'amb-full'];
            sizes.forEach(s => this._dialog.classList.remove(s));
            this._dialog.classList.add('amb-' + (isMobile ? ms : this.cfg.size));
        }

        show() {
            if (this._visible) return this;
            const { cfg, _wrapper: w, _backdrop: bd, _dialog: d } = this;

            if (typeof cfg.onload === 'function') cfg.onload(this);
            if (!emit(w, 'show', { id: this._id, relatedTarget: this._triggerEl })) return this;
            
            this._visible = true;
            _openModalCount++;
            _modalStack.push(this);

            // مدیریت اسکرول‌بار فقط برای اولین مودال
            if (_openModalCount === 1) {
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                if (scrollbarWidth > 0) document.body.style.paddingRight = scrollbarWidth + 'px';
                document.body.style.overflow = 'hidden';
            }

            // ریست کردن جابجایی دراگ در صورت باز شدن مجدد
            d.style.marginLeft = '';
            d.style.marginTop = '';

            if (bd) {
                bd.style.display = '';
                requestAnimationFrame(() => bd.classList.add('amb-show'));
            }
            w.style.display = '';
            requestAnimationFrame(() => w.classList.add('amb-show'));

            if (cfg.animOpen && cfg.animOpen !== 'none') {
                applyVars(w, cfg, bd);
                d.classList.add('amb-anim-' + cfg.animOpen);
                afterAnim(d, () => {
                    d.classList.remove('amb-anim-' + cfg.animOpen);
                    if (typeof cfg.afterload === 'function') cfg.afterload(this);
                    emit(w, 'shown', { id: this._id, relatedTarget: this._triggerEl });
                });
            } else {
                if (typeof cfg.afterload === 'function') cfg.afterload(this);
                emit(w, 'shown', { id: this._id, relatedTarget: this._triggerEl });
            }

            if (cfg.autoFocus) setTimeout(() => focusFirst(d), 50);

            this._trapHandler = (e) => { if (e.key === 'Tab') trapFocus(d, e); };
            document.addEventListener('keydown', this._trapHandler);

            if (cfg.keyboard) {
                // فقط بالاترین مودال با Escape بسته شود
                this._keyHandler = (e) => { 
                    if (e.key === 'Escape' && _modalStack.length > 0 && _modalStack[_modalStack.length - 1] === this) this.hide(); 
                };
                document.addEventListener('keydown', this._keyHandler);
            }

            if (cfg.autoClose > 0) {
                this._autoCloseTimer = setTimeout(() => this.hide(), cfg.autoClose);
            }

            return this;
        }

        hide() {
            if (!this._visible) return this;
            const { cfg, _wrapper: w, _backdrop: bd, _dialog: d } = this;

            if (typeof cfg.onclose === 'function' && cfg.onclose(this) === false) return this;
            if (!emit(w, 'hide', { id: this._id, relatedTarget: this._triggerEl })) return this;
            
            this._visible = false;
            _openModalCount--;
            const stackIndex = _modalStack.indexOf(this);
            if (stackIndex > -1) _modalStack.splice(stackIndex, 1);

            clearTimeout(this._autoCloseTimer);
            document.removeEventListener('keydown', this._trapHandler);
            document.removeEventListener('keydown', this._keyHandler);

            const done = () => {
                w.classList.remove('amb-show');
                w.style.display = 'none';
                if (bd) {
                    bd.classList.remove('amb-show');
                    bd.style.display = 'none';
                }
                
                // برگرداندن اسکرول‌بار فقط زمانی که هیچ مودالی باز نباشد
                if (_openModalCount <= 0) {
                    _openModalCount = 0; // جلوگیری از منفی شدن
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }
                
                if (typeof cfg.afterclose === 'function') cfg.afterclose(this);
                emit(w, 'hidden', { id: this._id, relatedTarget: this._triggerEl });
                if (this._triggerEl && typeof this._triggerEl.focus === 'function') {
                    this._triggerEl.focus();
                }
                this._triggerEl = null;
            };

            if (cfg.animClose && cfg.animClose !== 'none') {
                applyVars(w, cfg, bd);
                d.classList.add('amb-anim-close-' + cfg.animClose);
                if (bd) bd.classList.remove('amb-show');
                afterAnim(d, () => { d.classList.remove('amb-anim-close-' + cfg.animClose); done(); });
            } else {
                done();
            }

            return this;
        }

        toggle() { return this._visible ? this.hide() : this.show(); }
        config(options) { this.cfg = merge(this.cfg, options); return this; }

        dispose() {
            const removeDOM = () => {
                if (this._backdrop) this._backdrop.remove();
                if (this._el) {
                    this._el.className = this._sourceClassName;
                    if (this._sourceStyle === null) this._el.removeAttribute('style');
                    else this._el.setAttribute('style', this._sourceStyle);
                    const a11y = this._sourceA11yAttrs;
                    const restoreAttr = (name, value) => {
                        if (value == null) this._el.removeAttribute(name);
                        else this._el.setAttribute(name, value);
                    };
                    restoreAttr('role', a11y.role);
                    restoreAttr('aria-modal', a11y.ariaModal);
                    restoreAttr('aria-labelledby', a11y.ariaLabelledby);
                    restoreAttr('aria-describedby', a11y.ariaDescribedby);
                    restoreAttr('tabindex', a11y.tabIndex);
                    this._el.innerHTML = this._sourceHTML;
                }
                _registry.delete(this._id);
                window.removeEventListener('resize', this._resizeHandler);
            };
            if (this._visible) {
                // حذف امن المان‌ها پس از پایان انیمیشن بستن
                this._wrapper.addEventListener('hidden.amb.modal', removeDOM, { once: true });
                setTimeout(removeDOM, this.cfg.duration + 100);
                this.hide();
            } else {
                removeDOM();
            }
        }

        setLoading(state) {
            let overlay = $('.amb-loading', this._dialog);
            if (state) {
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'amb-loading';
                    overlay.innerHTML = '<div class="amb-spinner"></div>';
                    this._dialog.append(overlay);
                }
            } else {
                if (overlay) overlay.remove();
            }
            return this;
        }

        get isVisible() { return this._visible; }
        get element() { return this._wrapper; }
        get id() { return this._id; }

        static getInstance(el) {
            const id = typeof el === 'string' ? el : (el && el.id);
            return id ? _registry.get(id) || null : null;
        }

        static getOrCreateInstance(el, options) {
            return Modal.getInstance(el) || new Modal(el, options);
        }
    }

    /* ══════════════ Public API ═════════════════ */
    const create = (id, options = {}) => {
        if (_registry.has(id)) return _registry.get(id);
        // از ایجاد ID تکراری در DOM جلوگیری می‌کند
        const existing = document.getElementById(id);
        if (existing) return new Modal(existing, options);
        const src = document.createElement('div');
        src.id = id;
        src.style.display = 'none';
        document.body.append(src);
        return new Modal(id, options);
    };

    const open = (id, options) => {
        let m = _registry.get(id);
        if (!m) {
            m = create(id, options);
        } else if (options) {
            m.config(options);
        }
        if (!m._visible) m.show();
        return m;
    };

    const close = (id) => { const m = _registry.get(id); if (m) m.hide(); };
    const destroy = (id) => { const m = _registry.get(id); if (m) m.dispose(); };
    const config = (options) => Object.assign(DEFAULTS, options);

    /* ── Confirm ─────────────────────────────────── */
    const confirm = (opts = {}) => {
        const id = uid();
        const confirmText = opts.confirmText || 'Confirm';
        const cancelText = opts.cancelText || 'Cancel';
        const m = create(id, {
            title: opts.title || 'Confirm',
            body: `<div class="amb-confirm-body">
        <p class="amb-confirm-msg">${opts.message || ''}</p>
        <div class="amb-confirm-btns">
          <button class="amb-btn amb-btn-outline" data-amb-action="cancel">${cancelText}</button>
          <button class="amb-btn amb-btn-primary" data-amb-action="confirm">${confirmText}</button>
        </div>
      </div>`,
            size: opts.size || 'md',
            animOpen: opts.animOpen || 'zoom-in',
            animClose: opts.animClose || 'zoom-out',
            theme: opts.theme || '',
            rtl: opts.rtl || false,
            backdrop: 'static',
            keyboard: false,
        });

        m._wrapper.addEventListener('click', (e) => {
            const action = e.target.closest('[data-amb-action]');
            if (!action) return;
            if (action.dataset.ambAction === 'confirm') {
                if (typeof opts.onConfirm === 'function') opts.onConfirm();
            } else {
                if (typeof opts.onCancel === 'function') opts.onCancel();
            }
            m.hide();
            setTimeout(() => m.dispose(), 400);
        });

        m.show();
        return m;
    };

    /* ── Alert ── */
    const alert = (opts = {}) => {
        const id = uid();
        const type = opts.type || 'info';
        const btnText = opts.btnText || 'OK';
        const m = create(id, {
            title: opts.title || type.charAt(0).toUpperCase() + type.slice(1),
            body: `<div class="amb-alert-body amb-alert-${type}">
        <p class="amb-alert-msg">${opts.message || ''}</p>
      </div>`,
            footer: `<button class="amb-btn amb-btn-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'}" data-amb-dismiss="modal">${btnText}</button>`,
            size: opts.size || 'md',
            animOpen: opts.animOpen || 'bounce',
            animClose: opts.animClose || 'zoom-out',
            theme: opts.theme || '',
            rtl: opts.rtl || false,
            autoClose: opts.autoClose || 0,
            backdrop: 'static',
            alertType: type,
        });

        m._wrapper.addEventListener('hidden.amb.modal', () => setTimeout(() => m.dispose(), 100), { once: true });
        m.show();
        return m;
    };

    /* ── Alert List ── */
    const alertList = (opts = {}) => {
        const id = uid();
        const type = opts.type || 'info';
        const messages = Array.isArray(opts.messages) ? opts.messages : [opts.message || ''];
        const bulletIcon = ICONS.bullet[type] || ICONS.bullet.info;

        const listItems = messages.map(msg => `
      <li class="amb-message-item">
        <span class="amb-bullet-icon">${bulletIcon}</span>
        <span>${msg}</span>
      </li>
    `).join('');

        const bodyHTML = `<div class="amb-alert-${type}"><ul class="amb-message-list">${listItems}</ul></div>`;

        const m = create(id, {
            title: opts.title || type.charAt(0).toUpperCase() + type.slice(1),
            body: bodyHTML,
            footer: `<button class="amb-btn amb-btn-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'}" data-amb-dismiss="modal">${opts.btnText || 'OK'}</button>`,
            size: opts.size || 'md',
            animOpen: opts.animOpen || 'bounce',
            animClose: opts.animClose || 'zoom-out',
            theme: opts.theme || '',
            rtl: opts.rtl || false,
            autoClose: opts.autoClose || 0,
            backdrop: 'static',
            alertType: type,
        });

        m._wrapper.addEventListener('hidden.amb.modal', () => setTimeout(() => m.dispose(), 100), { once: true });
        m.show();
        return m;
    };

    const setLoading = (id, state) => {
        const m = _registry.get(id);
        if (m) m.setLoading(state);
    };

    /* ── Shortcuts ────────────────────────────────── */
    const success = (title, messages, opts = {}) => {
        if (Array.isArray(title)) return alertList({ type: 'success', messages: title, ...(messages || {}) });
        return alertList({ type: 'success', title, messages, ...opts });
    };
    const error = (title, messages, opts = {}) => {
        if (Array.isArray(title)) return alertList({ type: 'error', messages: title, ...(messages || {}) });
        return alertList({ type: 'error', title, messages, ...opts });
    };
    const warning = (title, messages, opts = {}) => {
        if (Array.isArray(title)) return alertList({ type: 'warning', messages: title, ...(messages || {}) });
        return alertList({ type: 'warning', title, messages, ...opts });
    };
    const info = (title, messages, opts = {}) => {
        if (Array.isArray(title)) return alertList({ type: 'info', messages: title, ...(messages || {}) });
        return alertList({ type: 'info', title, messages, ...opts });
    };

    /* ── alertSingle: نمایش یک پیام alert از نوع مشخص ─── */
    const alertSingle = (type, title, message, opts = {}) => {
        const typeTitle = title || (type === 'error' ? 'خطا!' : type === 'warning' ? 'هشدار!' : type === 'success' ? 'موفقیت!' : 'اطلاعات');
        const fn = { error, warning, success, info }[type] || info;
        fn(typeTitle, [message], opts);
    };

    /* ── AmbToast ────────────────────────────────── */
    const AmbToast = {
        _container: null,
        _getContainer() {
            if (!this._container) {
                this._container = document.createElement('div');
                this._container.className = 'amb-toast-global-container';
                this._container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;max-width:400px;pointer-events:none;';
                document.body.appendChild(this._container);
            }
            return this._container;
        },

        show(message, type = 'info', duration = 5000) {
            const colors = {
                success: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', icon: ICONS.header.success },
                error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: ICONS.header.error },
                warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: ICONS.header.warning },
                info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: ICONS.header.info }
            };
            const c = colors[type] || colors.info;

            const el = document.createElement('div');
            el.className = 'amb-toast-global';
            el.style.cssText = `display:flex;align-items:center;gap:12px;padding:14px 16px;background:${c.bg};border:1px solid ${c.border};border-radius:8px;color:${c.text};box-shadow:0 4px 12px rgba(0,0,0,.1);pointer-events:auto;opacity:0;transform:translateX(100%);transition:all .3s ease;font-size:14px;`;
            
            // رفع مشکل CSP و onclick اینلاین
            el.innerHTML = `<span style="flex-shrink:0;color:${c.text}">${c.icon}</span><span style="flex:1">${message}</span><button class="amb-toast-close-btn" style="flex-shrink:0;background:none;border:none;cursor:pointer;opacity:.6;padding:4px;color:${c.text}">${ICONS.close}</button>`;
            
            const closeBtn = el.querySelector('.amb-toast-close-btn');
            closeBtn.addEventListener('click', () => {
                clearTimeout(el._hideTimer); // جلوگیری از اجرای تایمر پس از بستن دستی
                el.style.opacity = '0'; 
                el.style.transform = 'translateX(100%)';
                setTimeout(() => el.remove(), 300);
            });

            this._getContainer().appendChild(el);
            requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; });
            
            if (duration > 0) {
                el._hideTimer = setTimeout(() => { 
                    el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; 
                    setTimeout(() => el.remove(), 300); 
                }, duration);
            }
            return el;
        },

        success(message, duration) { return this.show(message, 'success', duration); },
        error(message, duration) { return this.show(message, 'error', duration); },
        warning(message, duration) { return this.show(message, 'warning', duration); },
        info(message, duration) { return this.show(message, 'info', duration); }
    };

    /* ── Global Shortcuts (انتقال به قبل از initFromDOM) ────────────────────────── */
    window.AlertSuccess = (title, messages, opts) => success(title, messages, opts);
    window.AlertError = (title, messages, opts) => error(title, messages, opts);
    window.AlertWarning = (title, messages, opts) => warning(title, messages, opts);
    window.AlertInfo = (title, messages, opts) => info(title, messages, opts);

    window.ToastSuccess = (msg, dur) => AmbToast.success(msg, dur);
    window.ToastError = (msg, dur) => AmbToast.error(msg, dur);
    window.ToastWarning = (msg, dur) => AmbToast.warning(msg, dur);
    window.ToastInfo = (msg, dur) => AmbToast.info(msg, dur);

    window.FireToast = (type, msg, dur) => AmbToast.show(msg, type, dur);
    window.FireAlert = (type, title, messages, opts) => {
        const map = { success, error, warning, info };
        return (map[type] || info)(title, messages, opts);
    };

    /* ── Init from DOM ──────────────────────────── */
    const initFromDOM = () => {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-amb-toggle="modal"]');
            if (!btn) return;
            const targetSel = attr(btn, 'data-amb-target') || attr(btn, 'data-amb-id');
            if (!targetSel) return;
            const id = targetSel.replace('#', '');
            const srcEl = document.getElementById(id);
            let m = _registry.get(id);
            if (!m && srcEl) m = new Modal(srcEl);
            if (!m) return;
            m._triggerEl = btn;
            m.toggle();
        });

        $$('[data-amb="modal"]').forEach(el => {
            if (!el.id) el.id = uid();
            if (!_registry.has(el.id)) new Modal(el);
        });

        $$('.amb-toast-container').forEach(container => {
            const items = $$('.amb-toast-item', container);
            const step = parseInt(attr(container, 'data-amb-toast-step')) || 200;

            items.forEach((item, index) => {
                const type = attr(item, 'data-amb-toast-type') || 'info';
                const message = attr(item, 'data-amb-toast-msg') || '';

                setTimeout(() => {
                    AmbToast.show(message, type);
                }, index * step);
            });

            container.remove();
        });

        $$('.amb-alert-container').forEach(container => {
            const items = $$('.amb-alert-item', container);
            const step = parseInt(attr(container, 'data-amb-alert-step')) || 200;

            items.forEach((item, index) => {
                const type = attr(item, 'data-amb-alert-type') || 'info';
                const message = attr(item, 'data-amb-alert-msg') || '';
                const title = attr(item, 'data-amb-alert-title') || '';
                const rtl = attr(item, 'data-amb-alert-rtl') === 'true';
                const theme = attr(item, 'data-amb-alert-theme') || '';
                const btnText = attr(item, 'data-amb-alert-btn') || 'باشه';

                setTimeout(() => {
                    alertSingle(type, title, message, { rtl, theme, btnText });
                }, index * step);
            });

            container.remove();
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFromDOM);
    } else {
        initFromDOM();
    }

    return { Modal, create, open, close, destroy, config, confirm, alert, alertList, success, error, warning, info, setLoading, ICONS, AmbToast };
});
