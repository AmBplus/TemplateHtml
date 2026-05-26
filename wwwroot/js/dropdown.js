/**
 * dropdown.js
 * Handles .dropdown component: hover + click triggers, auto-flip positioning.
 *
 * Positioning logic:
 *   RTL: default opens LEFT  (right:0). Flips to right if not enough space.
 *   LTR: default opens RIGHT (left:0).  Flips to left  if not enough space.
 *   .dropdown-open-r / .dropdown-open-l override auto-flip entirely.
 */
(function () {
  'use strict';

  var HOVER_CLOSE_DELAY = 120; // ms before closing on mouseleave
  var _closeTimers = new WeakMap();
  // Maps for portal behavior (move menu to body to avoid overflow clipping)
  var _portalMap = new WeakMap(); // menu -> {parent, nextSibling}
  var _ddMenuMap = new WeakMap(); // dd -> menu
  var PORTAL_OFFSET = 6; // px spacing from trigger (small gap to allow comfortable hover)
  var _portalHandlers = new WeakMap();

  function getDir(el) {
    // Walk up to find the nearest dir declaration
    var node = el;
    while (node && node !== document.documentElement) {
      var d = getComputedStyle(node).direction;
      if (d === 'rtl' || d === 'ltr') return d;
      node = node.parentElement;
    }
    return getComputedStyle(document.documentElement).direction || 'ltr';
  }

  function autoFlip(dd) {
    // Force classes skip auto-flip
    if (dd.classList.contains('dropdown-open-r') || dd.classList.contains('dropdown-open-l')) {
      dd.classList.remove('dropdown-flip-to-right', 'dropdown-flip-to-left');
      return;
    }

    var menu = dd.querySelector('.dropdown-menu');
    if (!menu) return;

    var rect = dd.getBoundingClientRect();
    var vw = window.innerWidth;
    // Use scrollWidth for accurate off-screen width
    var menuW = menu.scrollWidth || menu.offsetWidth || 176;
    var dir = getDir(dd);

    dd.classList.remove('dropdown-flip-to-right', 'dropdown-flip-to-left');

    if (dir === 'rtl') {
      // Default: right:0 → menu spans [triggerRight - menuW, triggerRight]
      var leftEdge = rect.right - menuW;
      if (leftEdge < 0) {
        // Not enough space on the left → flip to right
        dd.classList.add('dropdown-flip-to-right');
      }
    } else {
      // Default: left:0 → menu spans [triggerLeft, triggerLeft + menuW]
      var rightEdge = rect.left + menuW;
      if (rightEdge > vw) {
        // Not enough space on the right → flip to left
        dd.classList.add('dropdown-flip-to-left');
      }
    }

    // If this dropdown's menu was ported to body, reposition it now
    var portedMenu = _ddMenuMap.get(dd);
    if (portedMenu) positionMenu(dd, portedMenu);
  }

  function positionMenu(dd, menu) {
    if (!menu) return;
    var rect = dd.getBoundingClientRect();
    var dir = getDir(dd);
    var menuW = menu.offsetWidth || menu.scrollWidth || 176;
    var top = rect.bottom + PORTAL_OFFSET;

    var left;
    if (dir === 'rtl') {
      if (dd.classList.contains('dropdown-flip-to-right') || dd.classList.contains('dropdown-open-r')) {
        left = rect.left; // align left edge
      } else {
        left = rect.right - menuW; // align right edge
      }
    } else {
      if (dd.classList.contains('dropdown-flip-to-left') || dd.classList.contains('dropdown-open-l')) {
        left = rect.right - menuW; // align right edge
      } else {
        left = rect.left; // align left edge
      }
    }

    menu.style.top = Math.round(top) + 'px';
    menu.style.left = Math.round(left) + 'px';
    menu.style.right = 'auto';
  }

  function openDropdown(dd) {
    var menu = dd.querySelector('.dropdown-menu');
    autoFlip(dd);

    // If menu exists and is inside an overflow:hidden container, port it to body
    if (menu && menu.parentElement !== document.body) {
      // store original parent and nextSibling
      _portalMap.set(menu, { parent: menu.parentElement, next: menu.nextSibling });
      document.body.appendChild(menu);
      menu.classList.add('is-ported');
      menu.style.position = 'fixed';
      menu.style.zIndex = 2000;
      // show via inline styles (since .dropdown.is-open > .dropdown-menu no longer matches)
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.pointerEvents = 'auto';
      menu.style.transform = 'translateY(0)';
      _ddMenuMap.set(dd, menu);
      positionMenu(dd, menu);
      // Attach handlers on the ported menu so hover between trigger and menu doesn't close it
      var onMenuEnter = function () {
        var t = _closeTimers.get(dd);
        if (t) { clearTimeout(t); _closeTimers.delete(dd); }
      };
      var onMenuLeave = function () {
        var t = setTimeout(function () {
          closeDropdown(dd);
          _closeTimers.delete(dd);
        }, HOVER_CLOSE_DELAY);
        _closeTimers.set(dd, t);
      };
      menu.addEventListener('mouseenter', onMenuEnter);
      menu.addEventListener('mouseleave', onMenuLeave);
      _portalHandlers.set(menu, { enter: onMenuEnter, leave: onMenuLeave });
    }

    dd.classList.add('is-open');
  }

  function closeDropdown(dd) {
    var menu = _ddMenuMap.get(dd) || dd.querySelector('.dropdown-menu');

    dd.classList.remove('is-open');

    if (menu && _portalMap.has(menu)) {
      // restore to original place
      var info = _portalMap.get(menu);
      if (info.next) info.parent.insertBefore(menu, info.next);
      else info.parent.appendChild(menu);
      _portalMap.delete(menu);
      _ddMenuMap.delete(dd);
      menu.classList.remove('is-ported');
      // clear inline styles we set
      menu.style.position = '';
      menu.style.top = '';
      menu.style.left = '';
      menu.style.right = '';
      menu.style.zIndex = '';
      menu.style.opacity = '';
      menu.style.visibility = '';
      menu.style.pointerEvents = '';
      menu.style.transform = '';
      // remove ported handlers if attached
      var handlers = _portalHandlers.get(menu);
      if (handlers) {
        menu.removeEventListener('mouseenter', handlers.enter);
        menu.removeEventListener('mouseleave', handlers.leave);
        _portalHandlers.delete(menu);
      }
    }
  }

  function closeAll(except) {
    document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
      if (d !== except) closeDropdown(d);
    });
  }

  function initDropdown(dd) {
    var isClick = dd.dataset.trigger === 'click';
    var isBoth = dd.dataset.trigger === 'both';

    if (isClick || isBoth) {
      // ---- Click trigger ----
      var trigger = dd.querySelector('.dropdown-trigger') || dd.firstElementChild;
      if (!trigger) return;

      // Click toggles
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var opening = !dd.classList.contains('is-open');
        closeAll(dd);
        if (opening) openDropdown(dd);
        else closeDropdown(dd);
      });

      // If both, also open on hover
      if (isBoth) {
        dd.addEventListener('mouseenter', function () {
          var t = _closeTimers.get(dd);
          if (t) { clearTimeout(t); _closeTimers.delete(dd); }
          openDropdown(dd);
        });

        dd.addEventListener('mouseleave', function () {
          var t = setTimeout(function () {
            closeDropdown(dd);
            _closeTimers.delete(dd);
          }, HOVER_CLOSE_DELAY);
          _closeTimers.set(dd, t);
        });

        // Touch devices: toggle on touchstart
        trigger.addEventListener('touchstart', function (e) {
          e.stopPropagation();
          var opening = !dd.classList.contains('is-open');
          closeAll(dd);
          if (opening) openDropdown(dd);
          else closeDropdown(dd);
        }, { passive: true });
      }

      // Prevent clicks inside menu from closing
      var menu = dd.querySelector('.dropdown-menu');
      if (menu) {
        menu.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      }
    } else {
      // ---- Hover trigger ----
      dd.addEventListener('mouseenter', function () {
        var t = _closeTimers.get(dd);
        if (t) { clearTimeout(t); _closeTimers.delete(dd); }
        openDropdown(dd);
      });

      dd.addEventListener('mouseleave', function () {
        var t = setTimeout(function () {
          closeDropdown(dd);
          _closeTimers.delete(dd);
        }, HOVER_CLOSE_DELAY);
        _closeTimers.set(dd, t);
      });
    }
  }

  function init() {
    document.querySelectorAll('.dropdown').forEach(initDropdown);

    // Global click: close all click- or both-triggered dropdowns
    document.addEventListener('click', function () {
      document.querySelectorAll('.dropdown[data-trigger="click"].is-open, .dropdown[data-trigger="both"].is-open').forEach(closeDropdown);
    });

    // Recalculate flip on resize
    window.addEventListener('resize', function () {
      document.querySelectorAll('.dropdown.is-open').forEach(autoFlip);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose an initializer so other scripts can initialize dynamically added dropdowns
  window.dropdownInit = function () {
    document.querySelectorAll('.dropdown').forEach(initDropdown);
  };
})();
