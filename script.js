(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Header: transparent over the hero, solid once the page scrolls
  var header = document.getElementById("site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Day / night mode: follows the system until the visitor picks one, then remembers it
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  function labelTheme() {
    if (themeBtn) themeBtn.setAttribute("aria-label", root.getAttribute("data-theme") === "night" ? "Switch to day mode" : "Switch to night mode");
  }
  labelTheme();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "night" ? "day" : "night";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("zcs-theme", next); } catch (e) {}
      labelTheme();
    });
  }
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var follow = function (e) {
      var saved = null;
      try { saved = localStorage.getItem("zcs-theme"); } catch (err) {}
      if (!saved) { root.setAttribute("data-theme", e.matches ? "night" : "day"); labelTheme(); }
    };
    if (mq.addEventListener) mq.addEventListener("change", follow);
  }

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // Contact form: compose an email to the studio inbox
  var form = document.getElementById("contact-form");
  var errorBox = document.getElementById("form-error");
  var TO = "contact@zebraconsultancyservices.com";

  function showError(msg, field) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  if (form) {
    form.addEventListener("input", function (e) {
      if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
      errorBox.hidden = true;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim();
      var email = f.email.value.trim();
      if (!name) return showError("Add your name so we know who to reply to.", f.name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError("Add a valid email address so we can reply.", f.email);

      var business = f.business.value.trim();
      var need = f.need.value;
      var message = f.message.value.trim();

      var subject = "Website enquiry: " + need + (business ? " for " + business : "");
      var body = [
        "Name: " + name,
        "Email: " + email,
        business ? "Business: " + business : null,
        "Looking for: " + need,
        "",
        message || "(No extra details)"
      ].filter(function (l) { return l !== null; }).join("\n");

      window.location.href = "mailto:" + TO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
