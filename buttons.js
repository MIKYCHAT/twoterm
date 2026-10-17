
/* TWOTERM — Central Button Controller
   File: buttons.js
   Safe foundation for existing app features.
*/
(() => {
  "use strict";

  if (window.twotermButtonsLoaded) return;
  window.twotermButtonsLoaded = true;

  function notify(message) {
    let toast = document.getElementById("twoterm-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "twoterm-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");

      Object.assign(toast.style, {
        position: "fixed",
        bottom: "85px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#252530",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "12px",
        zIndex: "99999",
        maxWidth: "90%",
        textAlign: "center",
        fontSize: "14px",
        boxShadow: "0 4px 20px #0005"
      });

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  }

  window.twotermNotify = notify;

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;

    const action = button.dataset.action;

    // Other scripts can handle complex app features.
    const customActions = [
      "login", "signup", "logout", "like",
      "comment", "follow", "upload", "go-live",
      "end-live", "verify-creator", "search",
      "open-profile", "notifications", "save",
      "report", "settings", "discover"
    ];

    if (customActions.includes(action)) {
      window.dispatchEvent(new CustomEvent(
        "twoterm:action",
        { detail: { action, button } }
      ));
      return;
    }

    switch (action) {
      case "back":
        if (history.length > 1) history.back();
        else notify("You're already at the first page.");
        break;

      case "reload":
        location.reload();
        break;

      case "scroll-to": {
        const targetId = button.dataset.target;
        const target = targetId &&
          document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        } else {
          notify("That section is not available yet.");
        }
        break;
      }

      case "toggle": {
        const targetId = button.dataset.target;
        const target = targetId &&
          document.getElementById(targetId);

        if (target) {
          const isHidden = getComputedStyle(target).display === "none";
          target.hidden = false;
          target.style.display = isHidden ? "" : "none";
          button.setAttribute(
            "aria-expanded",
            String(isHidden)
          );
        } else {
          notify("Menu or section not found.");
        }
        break;
      }

      case "share": {
        const shareData = {
          title: "TWOTERM",
          text: "Watch, create and connect on TWOTERM.",
          url: location.href
        };

        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else if (navigator.clipboard &&
                     window.isSecureContext) {
            await navigator.clipboard.writeText(location.href);
            notify("Website link copied.");
          } else {
            notify("Use your browser menu to share this page.");
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            notify("Sharing failed. Please try again.");
          }
        }
        break;
      }

      default:
        notify("This action is not connected yet.");
    }
  });

  console.log("TWOTERM button controller loaded.");
})();
