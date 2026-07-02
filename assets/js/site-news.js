(function () {
  var list = document.querySelector("[data-news-list]");
  if (!list || typeof fetch !== "function") {
    return;
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url);
  }

  function createItem(item) {
    var article = document.createElement("article");
    article.className = "news-item";

    var date = document.createElement("span");
    date.className = "news-date";
    date.textContent = item.displayDate || item.date || "";

    var body = document.createElement("p");
    if (item.tag) {
      var tag = document.createElement("span");
      tag.className = "news-tag";
      tag.textContent = item.tag;
      body.appendChild(tag);
      body.appendChild(document.createTextNode(" "));
    }

    if (item.url) {
      var link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.title || item.summary || item.url;
      if (isExternal(item.url)) {
        link.target = "_blank";
        link.rel = "external noopener";
      }
      body.appendChild(link);
    } else {
      var strong = document.createElement("strong");
      strong.textContent = item.title || "Update";
      body.appendChild(strong);
    }

    if (item.summary) {
      body.appendChild(document.createTextNode(" — " + item.summary));
    }

    if (Array.isArray(item.links) && item.links.length) {
      var links = document.createElement("span");
      links.className = "news-links";
      var linkCount = 0;
      item.links.forEach(function (extraLink) {
        if (!extraLink || !extraLink.url) {
          return;
        }
        var anchor = document.createElement("a");
        anchor.href = extraLink.url;
        anchor.textContent = extraLink.label || extraLink.url;
        if (isExternal(extraLink.url)) {
          anchor.target = "_blank";
          anchor.rel = "external noopener";
        }
        links.appendChild(anchor);
        linkCount += 1;
      });
      if (linkCount) {
        body.appendChild(links);
      }
    }

    article.appendChild(date);
    article.appendChild(body);
    return article;
  }

  fetch("/assets/data/news.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load news data.");
      }
      return response.json();
    })
    .then(function (items) {
      if (!Array.isArray(items) || !items.length) {
        return;
      }
      items.sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || ""));
      });
      var fragment = document.createDocumentFragment();
      items.slice(0, 6).forEach(function (item) {
        fragment.appendChild(createItem(item));
      });
      list.replaceChildren(fragment);
    })
    .catch(function () {
      // Keep the static fallback list visible when opened from file:// or offline.
    });
})();
