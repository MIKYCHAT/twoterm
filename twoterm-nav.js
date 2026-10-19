
/* TWOTERM shared navigation
   Safe to add as a separate file.
   Does not replace Supabase login or LiveKit code.
*/
(() => {
  "use strict";

  const pages = [
    ["Home & Video Feed", "index.html", "01"],
    ["Account", "account.html", "02"],
    ["My Profile", "profile.html", "03"],
    ["Feed", "feed.html", "04"],
    ["Video Feed", "video-feed.html", "05"],
    ["Messages", "inbox.html", "06"],
    ["Notifications", "notifications.html", "07"],
    ["Go LIVE", "live.html", "08"],
    ["Gifts", "gifts.html", "09"],
    ["Payments", "payments.html", "10"],
    ["Discover", "discover.html", "11"],
    ["Creator Tools", "creator-tools.html", "12"],
    ["Community", "community.html", "13"],
    ["Safety Center", "safety.html", "14"],
    ["Admin Dashboard", "admin.html", "15"],
    ["Performance", "performance.html", "16"],
    ["Mobile App", "mobile-app.html", "17"],
    ["Business & Revenue", "business-revenue.html", "18"],
    ["Advanced Features", "advanced-features.html", "19"],
    ["Backend Status", "backend-status.html", "20"],
    ["Security Center", "security-center.html", "21"]
  ];

  const currentFile = location.pathname.split("/").pop() || "index.html";

  const style = document.createElement("style");
  style.textContent = `
    #twoterm-global-nav {
      position: relative;
      z-index: 9999;
      margin: 12px auto;
      max-width: 1100px;
      padding: 12px;
      border: 1px solid #49335f;
      border-radius: 14px;
      background: #171022;
      color: #fff;
      font: 14px Arial, sans-serif;
    }
    #twoterm-global-nav .ttn-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    #twoterm-global-nav .ttn-brand {
      color: #f0abfc;
      font-size: 18px;
      font-weight: 700;
      text-decoration: none;
    }
    #twoterm-global-nav button {
      padding: 9px 13px;
      border: 0;
      border-radius: 8px;
      background: #7c3aed;
      color: white;
      cursor: pointer;
      font-weight: 600;
    }
    #twoterm-global-nav .ttn-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    #twoterm-global-nav .ttn-links[hidden] {
      display: none;
    }
    #twoterm-global-nav .ttn-links a {
      display: inline-block;
      padding: 9px 10px;
      border-radius: 8px;
      background: #281c39;
      color: #eee5ff;
      text-decoration: none;
    }
    #twoterm-global-nav .ttn-links a:hover,
    #twoterm-global-nav .ttn-links a[aria-current="page"] {
      background: #6d28d9;
      color: #fff;
    }
    #twoterm-global-nav .ttn-note {
      margin: 10px 0 0;
      color: #c4b5d8;
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);

  function buildNavigation() {
    if (document.getElementById("twoterm-global-nav")) return;

    const nav = document.createElement("nav");
    nav.id = "twoterm-global-nav";
    nav.setAttribute("aria-label", "TWOTERM site navigation");

    const top = document.createElement("div");
    top.className = "ttn-top";

    const brand = document.createElement("a");
    brand.className = "ttn-brand";
    brand.href = "index.html";
    brand.textContent = "TWOTERM";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = "☰ All Sections";
    toggle.setAttribute("aria-expanded", "false");

    const links = document.createElement("div");
    links.className = "ttn-links";
    links.hidden = true;

    pages.forEach(([label, href, number]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = number + " · " + label;

      if (href === currentFile) {
        link.setAttribute("aria-current", "page");
      }

      links.appendChild(link);
    });

    // Section 22 will be added once its exact page and requirements are known.
    const note = document.createElement("p");
    note.className = "ttn-note";
    note.textContent =
      "Navigation connects pages; each feature still needs its own backend integration and permission checks.";

    toggle.addEventListener("click", () => {
      links.hidden = !links.hidden;
      toggle.setAttribute("aria-expanded", String(!links.hidden));
    });

    top.append(brand, toggle);
    nav.append(top, links, note);

    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildNavigation);
  } else {
    buildNavigation();
  }
})();
