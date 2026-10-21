
/*
 * TWOTERM — Central Navigation System
 * File: nav.js
 *
 * Responsibilities:
 * - Organize platform features
 * - Create consistent navigation
 * - Support desktop and mobile layouts
 * - Keep existing authentication code untouched
 * - Avoid duplicate navigation if loaded twice
 */

(() => {
  "use strict";

  // Prevent duplicate initialization.
  if (window.TWOTERM_NAV) return;

  const NAV = {
    brand: "TWOTERM",

    // Main application navigation.
    main: [
      {
        id: "home",
        label: "Home",
        icon: "⌂",
        href: "index.html"
      },
      {
        id: "friends",
        label: "Friends",
        icon: "♧",
        href: "friends.html"
      },
      {
        id: "create",
        label: "Create",
        icon: "+",
        href: "create.html",
        primary: true
      },
      {
        id: "messages",
        label: "Messages",
        icon: "✉",
        href: "messages.html"
      },
      {
        id: "profile",
        label: "Profile",
        icon: "◎",
        href: "profile.html"
      }
    ],

    // Video discovery and viewing.
    videos: [
      { id: "for-you", label: "For You", href: "index.html?feed=for-you" },
      { id: "following", label: "Following", href: "index.html?feed=following" },
      { id: "discover", label: "Discover", href: "discover.html" }
    ],

    // Features accessed through the central Create button.
    create: [
      { id: "video", label: "Create Video", href: "create-video.html" },
      { id: "live", label: "Go Live", href: "live.html" },
      { id: "edit", label: "Edit Video", href: "edit-video.html" },
      { id: "camera", label: "Camera", href: "camera.html" }
    ],

    // Social features.
    social: [
      { id: "friends", label: "Friends", href: "friends.html" },
      { id: "followers", label: "Followers", href: "followers.html" },
      { id: "following-users", label: "Following", href: "following.html" },
      { id: "notifications", label: "Notifications", href: "notifications.html" },
      { id: "messages", label: "Messages", href: "messages.html" }
    ],

    // Creator tools and monetization.
    creator: [
      { id: "creator-dashboard", label: "Creator Dashboard", href: "creator-dashboard.html" },
      { id: "verification", label: "Creator Verification", href: "verification.html" },
      { id: "tips", label: "Tips and Gifts", href: "tips.html" },
      { id: "earnings", label: "Earnings", href: "earnings.html" },
      { id: "withdrawals", label: "Withdrawals", href: "withdrawals.html" },
      { id: "live-studio", label: "Live Studio", href: "live.html" }
    ],

    // Personal account tools.
    account: [
      { id: "profile", label: "My Profile", href: "profile.html" },
      { id: "edit-profile", label: "Edit Profile", href: "edit-profile.html" },
      { id: "settings", label: "Settings", href: "settings.html" },
      { id: "privacy", label: "Privacy and Security", href: "privacy.html" },
      { id: "help", label: "Help and Support", href: "help.html" }
    ]
  };

  // Make the navigation configuration available to other scripts.
  window.TWOTERM_NAV = {
    config: NAV,

    // Render a navigation group into an existing HTML element.
    renderGroup(container, items) {
      const target =
        typeof container === "string"
          ? document.querySelector(container)
          : container;

      if (!target) {
        console.warn("TWOTERM navigation target not found:", container);
        return;
      }

      target.replaceChildren();

      items.forEach((item) => {
        const link = document.createElement("a");

        link.href = item.href;
        link.className = "twoterm-nav-link";
        link.dataset.navId = item.id;

        if (item.primary) {
          link.classList.add("twoterm-nav-primary");
        }

        const icon = document.createElement("span");
        icon.className = "twoterm-nav-icon";
        icon.textContent = item.icon || "";

        const label = document.createElement("span");
        label.className = "twoterm-nav-label";
        label.textContent = item.label;

        link.append(icon, label);
        target.appendChild(link);
      });

      this.setActivePage(target);
    },

    // Highlight the link matching the current page.
    setActivePage(container = document) {
      const currentFile =
        window.location.pathname.split("/").pop() || "index.html";

      container.querySelectorAll("[data-nav-id]").forEach((link) => {
        const linkUrl = new URL(link.href, window.location.href);
        const linkFile = linkUrl.pathname.split("/").pop();

        const samePage = linkFile === currentFile;
        const sameFeed =
          linkFile === "index.html" &&
          linkUrl.searchParams.get("feed") ===
            new URLSearchParams(window.location.search).get("feed");

        const active = samePage && (
          linkUrl.searchParams.has("feed") ? sameFeed : true
        );

        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },

    // Initialize navigation slots already present in a page.
    init() {
      document.querySelectorAll("[data-twoterm-nav]").forEach((slot) => {
        const group = slot.dataset.twotermNav;

        if (Object.prototype.hasOwnProperty.call(NAV, group)) {
          this.renderGroup(slot, NAV[group]);
        }
      });

      this.setActivePage();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.TWOTERM_NAV.init();
    }, { once: true });
  } else {
    window.TWOTERM_NAV.init();
  }
})();
