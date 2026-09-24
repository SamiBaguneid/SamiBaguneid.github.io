/* Lymm Counselling — small progressive enhancements. No dependencies. */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile navigation */
  var toggle = document.getElementById("nav-toggle");
  var panel = document.getElementById("mobile-nav");
  if (toggle && panel) {
    var label = document.getElementById("nav-toggle-label");
    var iconOpen = toggle.querySelector(".nav-icon-open");
    var iconClose = toggle.querySelector(".nav-icon-close");

    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      if (label) label.textContent = open ? "Close" : "Menu";
      if (iconOpen) iconOpen.classList.toggle("hidden", open);
      if (iconClose) iconClose.classList.toggle("hidden", !open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close the panel if the viewport grows to desktop width.
    var desktop = window.matchMedia("(min-width: 64rem)");
    var onDesktop = function (mq) {
      if (mq.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);
  }

  /* Header border once the page scrolls */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Gentle scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Signal to the fail-safe script embedded in index.html's <head> that
     site.js ran, so its reveal timeout fallback knows not to fire. */
  window.__siteReady = true;

  /* Contact form: submit in the background, fall back to a normal POST */
  var form = document.getElementById("contact-form");
  if (form && window.fetch && window.FormData) {
    var wrap = document.getElementById("form-wrap");
    var success = document.getElementById("form-success");
    var error = document.getElementById("form-error");
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button && button.querySelector("[data-label]");

    var showError = function () {
      error.innerHTML =
        "Sorry, your message couldn't be sent just now. Please try again, or email me directly at " +
        '<a class="font-semibold text-teal-900 underline underline-offset-4" href="mailto:admin@lymmcounselling.org.uk">admin@lymmcounselling.org.uk</a>.';
      error.classList.add("bg-peach-100", "p-4");
    };

    var clearError = function () {
      // Keep the alert container rendered (not display:none) so it stays in
      // the accessibility tree and screen readers reliably announce it when
      // it's populated later; just clear its text and visual styling so it
      // stays visually empty.
      error.textContent = "";
      error.classList.remove("bg-peach-100", "p-4");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearError();
      if (button) button.disabled = true;
      if (buttonLabel) buttonLabel.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          wrap.hidden = true;
          success.innerHTML =
            '<div class="py-6 text-center">' +
            '<p class="mx-auto grid size-14 place-items-center rounded-full bg-teal-50 font-display text-2xl text-teal-700" aria-hidden="true">&#10003;</p>' +
            '<p class="mt-5 font-display text-2xl font-semibold text-teal-900">Thank you for getting in touch</p>' +
            '<p class="mx-auto mt-3 max-w-sm text-ink-muted">Your message has been sent. I’ll get back to you soon to arrange your free initial session.</p>' +
            "</div>";
          success.setAttribute("tabindex", "-1");
          success.focus();
        })
        .catch(function () {
          showError();
        })
        .then(function () {
          if (button) button.disabled = false;
          if (buttonLabel) buttonLabel.textContent = "Send message";
        });
    });
  }
})();
