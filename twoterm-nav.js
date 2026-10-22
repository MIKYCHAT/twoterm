
/* TWOTERM navigation controller
   Keep beside index.html.
   Authentication and feature rendering stay in index.html.
*/
(() => {
  "use strict";

  const NAV_SELECTOR = "[data-nav]";
  let lastNavigation = "";

  function setActive(key) {
    document.querySelectorAll(NAV_SELECTOR).forEach((button) => {
      button.classList.toggle("active", button.dataset.nav === key);

      if (button.dataset.nav === key) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function closeFeatureMenu() {
    const menu = document.getElementById("featureMenu");
    const toggle = document.getElementById("featureMenuToggle");

    if (menu) menu.hidden = true;

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function navigate(key, extraId = null) {
    if (!key) return;

    lastNavigation = key;
    setActive(key);
    closeFeatureMenu();

    window.dispatchEvent(
      new CustomEvent("twoterm:navigate", {
        detail: { key, extraId }
      })
    );
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest(NAV_SELECTOR);

    if (!button || !button.dataset.nav) return;

    navigate(
      button.dataset.nav,
      button.dataset.extraId || null
    );
  });

  window.TWOTERMNav = {
    go(key, extraId = null) {
      navigate(key, extraId);
    },

    current() {
      return lastNavigation;
    }
  };
})();
