(function () {
  var storageKey = "theme";
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var label = toggle ? toggle.querySelector("[data-theme-label]") : null;
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getSetting() {
    var stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return "system";
  }

  function resolveTheme(setting) {
    if (setting === "system") {
      return mediaQuery.matches ? "dark" : "light";
    }
    return setting;
  }

  function updateHighlight(theme) {
    var light = document.getElementById("highlight_theme_light");
    var dark = document.getElementById("highlight_theme_dark");
    if (!light || !dark) {
      return;
    }
    if (theme === "dark") {
      light.media = "none";
      dark.media = "";
    } else {
      dark.media = "none";
      light.media = "";
    }
  }

  function updateToggle(theme) {
    if (!toggle) {
      return;
    }
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    if (label) {
      label.textContent = theme === "dark" ? "Dark" : "Light";
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    updateToggle(theme);
    updateHighlight(theme);
  }

  function setThemeSetting(setting) {
    if (setting === "system") {
      localStorage.removeItem(storageKey);
    } else if (setting === "light" || setting === "dark") {
      localStorage.setItem(storageKey, setting);
    }
    applyTheme(resolveTheme(getSetting()));
  }

  window.determineThemeSetting = getSetting;
  window.determineComputedTheme = function () {
    return resolveTheme(getSetting());
  };
  window.setThemeSetting = setThemeSetting;

  applyTheme(resolveTheme(getSetting()));

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = resolveTheme(getSetting());
      var next = current === "dark" ? "light" : "dark";
      setThemeSetting(next);
    });
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", function () {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(resolveTheme("system"));
      }
    });
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(function () {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(resolveTheme("system"));
      }
    });
  }
})();
