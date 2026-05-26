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
  }

  function openDropdown(dd) {
    autoFlip(dd);
    dd.classList.add('is-open');
  }

  function closeDropdown(dd) {
    dd.classList.remove('is-open');
  }

  function closeAll(except) {
    document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
      if (d !== except) closeDropdown(d);
    });
  }

  function initDropdown(dd) {
    var isClick = dd.dataset.trigger === 'click';

    if (isClick) {
      // ---- Click trigger ----
      var trigger = dd.querySelector('.dropdown-trigger') || dd.firstElementChild;
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var opening = !dd.classList.contains('is-open');
        closeAll(dd);
        if (opening) openDropdown(dd);
        else closeDropdown(dd);
      });

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

    // Global click: close all click-triggered dropdowns
    document.addEventListener('click', function () {
      document.querySelectorAll('.dropdown[data-trigger="click"].is-open').forEach(closeDropdown);
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
})();
