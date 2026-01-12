(function () {
  var storageKey = "theme";
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) {
    return;
  }

  var label = toggle.querySelector("[data-theme-label]");
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function updateLabel(theme) {
    if (!label) {
      return;
    }
    label.textContent = theme === "dark" ? "Dark" : "Light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    updateLabel(theme);
  }

  function getInitialTheme() {
    var stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return mediaQuery.matches ? "dark" : "light";
  }

  function setTheme(theme, persist) {
    applyTheme(theme);
    if (persist) {
      localStorage.setItem(storageKey, theme);
    }
  }

  setTheme(getInitialTheme(), false);

  toggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") || getInitialTheme();
    var next = current === "dark" ? "light" : "dark";
    setTheme(next, true);
  });

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", function (event) {
      if (!localStorage.getItem(storageKey)) {
        setTheme(event.matches ? "dark" : "light", false);
      }
    });
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(function (event) {
      if (!localStorage.getItem(storageKey)) {
        setTheme(event.matches ? "dark" : "light", false);
      }
    });
  }
})();
