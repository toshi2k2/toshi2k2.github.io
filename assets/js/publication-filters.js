(function () {
  var searchInput = document.querySelector("[data-pub-search]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-pub-filter]"));
  var countNode = document.querySelector("[data-pub-count]");
  var emptyNode = document.querySelector("[data-pub-empty]");
  var thematic = document.getElementById("pub-thematic");
  var chronological = document.getElementById("pub-chronological");
  var activeFilter = "all";
  var filterLabels = {
    all: "all topics",
    "3d": "3D Vision",
    efficient: "Efficient Learning",
    perception: "Perception",
    "domain-adaptation": "Domain Adaptation",
    "explainable-ai": "Explainable AI & Physics of AI",
    robustness: "Robustness",
    generative: "Generative Models",
    security: "Security & Systems"
  };

  if (!thematic || !chronological) {
    return;
  }

  function themeScoresFor(card) {
    var scoreText = card.getAttribute("data-pub-theme-scores") || "";
    var scores = {};

    scoreText.trim().split(/\s+/).forEach(function (entry) {
      var separatorIndex = entry.lastIndexOf(":");
      if (separatorIndex === -1) {
        return;
      }
      var topic = entry.slice(0, separatorIndex);
      var score = Number(entry.slice(separatorIndex + 1));
      if (topic && Number.isFinite(score)) {
        scores[topic] = score;
      }
    });

    return scores;
  }

  function decorateThemeCard(card, topic) {
    var score = themeScoresFor(card)[topic];
    if (!Number.isFinite(score)) {
      return;
    }

    card.dataset.themeMatch = String(score);
    var badge = card.querySelector(".pub-theme-match");
    if (!badge) {
      badge = document.createElement("p");
      badge.className = "pub-theme-match";
      badge.innerHTML = "<span>Theme match</span><strong></strong>";
      var heading = card.querySelector("h3");
      if (heading) {
        heading.insertAdjacentElement("afterend", badge);
      }
    }

    badge.setAttribute("aria-label", "Estimated theme matching probability: " + score + " percent");
    var scoreNode = badge.querySelector("strong");
    if (scoreNode) {
      scoreNode.textContent = score + "%";
    }
  }

  function populateThematicView() {
    var destinations = {};
    var existingTitles = {};
    var sections = Array.prototype.slice.call(thematic.querySelectorAll("[data-pub-theme]"));

    sections.forEach(function (section) {
      var topic = section.getAttribute("data-pub-theme");
      destinations[topic] = section;
      existingTitles[topic] = Object.create(null);
      Array.prototype.slice.call(section.querySelectorAll(".pub-item")).forEach(function (card) {
        existingTitles[topic][textOf(card, "h3")] = true;
      });
    });

    Array.prototype.slice.call(chronological.querySelectorAll(".pub-item[data-pub-theme-scores]")).forEach(function (card) {
      var title = textOf(card, "h3");
      var scores = themeScoresFor(card);
      Object.keys(scores).forEach(function (topic) {
        if (destinations[topic] && !existingTitles[topic][title]) {
          var clone = card.cloneNode(true);
          decorateThemeCard(clone, topic);
          destinations[topic].appendChild(clone);
          existingTitles[topic][title] = true;
        }
      });
    });

    sections.forEach(function (section) {
      var topic = section.getAttribute("data-pub-theme");
      var cards = Array.prototype.slice.call(section.querySelectorAll(".pub-item"));
      cards.forEach(function (card) {
        decorateThemeCard(card, topic);
      });
      cards.sort(function (first, second) {
        var scoreDifference = Number(second.dataset.themeMatch) - Number(first.dataset.themeMatch);
        return scoreDifference || textOf(first, "h3").localeCompare(textOf(second, "h3"));
      });
      cards.forEach(function (card) {
        section.appendChild(card);
      });
    });
  }

  populateThematicView();

  var abstracts = [
    {
      match: /honeycomb-surfels/i,
      text: "Introduces Hexels, planar hexagonal surface elements with a first-order spatial color field. They represent locally planar regions with smoothly varying appearance using fewer primitives, improving the quality-memory trade-off for novel-view synthesis, surface reconstruction, and 2D image representation."
    },
    {
      match: /fure:/i,
      text: "Recovers editable animal-fur strands from multiview images using a root-conditioned latent field and a PCA strand decoder learned from human hair. Local Gaussian Frosting cues and part priors guide the underlying body geometry. The method avoids animal-fur training datasets and substantially reduces strand-training time."
    },
    {
      match: /universal weight subspace/i,
      text: "Shows that independently trained neural networks converge to shared, low-dimensional spectral subspaces. The result gives a geometric explanation for efficient fine-tuning, model merging, and continual learning."
    },
    {
      match: /name that part/i,
      text: "Introduces ALIGN-Parts, a feed-forward system that predicts 3D part masks and aligns them to natural-language part descriptions for named 3D part segmentation."
    },
    {
      match: /can these views be one scene/i,
      text: "Evaluates whether image sets can plausibly be observations of one static 3D scene. The work shows that neural reconstruction backbones can hallucinate dense geometry on unrelated scenes, repeated views, and random noise, then introduces failure-aware consistency metrics."
    },
    {
      match: /eigenlorax/i,
      text: "Recycles pretrained adapters into principal subspaces so new tasks can be adapted by learning lightweight coefficients rather than full adapter parameters."
    },
    {
      match: /shared lora subspaces/i,
      text: "Uses shared LoRA subspaces to support continual updates while reducing forgetting and avoiding full retraining across model families."
    },
    {
      match: /source-free and image-only/i,
      text: "Adapts category-level 3D pose models to target domains using only RGB images, without source data, target 3D annotations, or depth at adaptation time."
    },
    {
      match: /bayesian approach to ood/i,
      text: "Uses interpretable, generative compositional feature dictionaries to improve image classification robustness under domain shift, corruptions, and occlusion."
    },
    {
      match: /gaussian scenes/i,
      text: "Reconstructs sparse-view scenes without known camera poses by combining 3D Gaussian representations with depth-enhanced diffusion priors."
    },
    {
      match: /perceptual taxonomy/i,
      text: "Builds a structured evaluation for hierarchical scene reasoning in vision-language models, exposing where current models diverge from human-like perception."
    },
    {
      match: /scaling 3d compositional/i,
      text: "Scales 3D compositional models for robust object classification and pose estimation under occlusion and domain shift."
    },
    {
      match: /tridiff-4d/i,
      text: "Generates 4D content efficiently through diffusion-based triplane re-posing."
    },
    {
      match: /progressive prompt detailing/i,
      text: "Improves text-to-image alignment by progressively enriching prompts with structured detail."
    },
    {
      match: /catastrophic forgetting/i,
      text: "Analyzes forgetting and remembering from a probabilistic perspective, then uses optimal relevance mapping to preserve useful prior knowledge during continual learning."
    },
    {
      match: /inemo/i,
      text: "Uses incremental neural mesh models for robust class-incremental learning."
    },
    {
      match: /animal3d/i,
      text: "Provides a dataset for 3D animal pose and shape, supporting structured animal perception research."
    },
    {
      match: /learning part segmentation from synthetic animals/i,
      text: "Introduces synthetic animal data and a syn-to-real part-segmentation benchmark, then improves domain adaptation with class-balanced Fourier data mixing."
    },
    {
      match: /adaptive neural connections/i,
      text: "Learns explicit neuron-to-neuron adjacency parameters for sparse, efficient inference while exposing weight-importance structure."
    },
    {
      match: /radar as a security/i,
      text: "Applies neural models to real-time human detection and behavior classification from radar signals."
    },
    {
      match: /offline outdoor navigation/i,
      text: "Presents a privacy-preserving offline navigation system."
    },
    {
      match: /timing attack analysis/i,
      text: "Analyzes timing attacks against AES on modern processors."
    }
  ];

  function textOf(card, selector) {
    var node = card.querySelector(selector);
    return node ? node.textContent.trim() : "";
  }

  function abstractFor(title) {
    for (var i = 0; i < abstracts.length; i += 1) {
      if (abstracts[i].match.test(title)) {
        return abstracts[i].text;
      }
    }
    return "Concise abstract unavailable; use the links below for the paper, project page, code, or BibTeX entry.";
  }

  function topicsFor(card) {
    var topics = Object.keys(themeScoresFor(card));
    return topics.length ? topics : ["other"];
  }

  function enhanceCard(card) {
    var title = textOf(card, "h3");
    var detailsBody = card.querySelector(".pub-details .details-body");
    if (detailsBody && !detailsBody.querySelector(".pub-abstract")) {
      var abstract = document.createElement("p");
      abstract.className = "pub-abstract";
      abstract.textContent = abstractFor(title);
      detailsBody.insertBefore(abstract, detailsBody.firstChild);
    }

    var topics = topicsFor(card);
    card.dataset.pubTopics = topics.join(" ");
    card.dataset.pubSearch = [
      title,
      textOf(card, ".pub-summary"),
      textOf(card, ".pub-meta"),
      detailsBody ? detailsBody.textContent : "",
      topics.join(" ")
    ].join(" ").toLowerCase();
  }

  function currentContainer() {
    return chronological.classList.contains("is-hidden") ? thematic : chronological;
  }

  function cardMatches(card, query) {
    var matchesText = !query || card.dataset.pubSearch.indexOf(query) !== -1;
    var topics = card.dataset.pubTopics || "";
    var matchesFilter = activeFilter === "all" || topics.split(" ").indexOf(activeFilter) !== -1;
    return matchesText && matchesFilter;
  }

  function updateSections(container) {
    Array.prototype.slice.call(container.querySelectorAll(".publication-section")).forEach(function (section) {
      var sectionCards = Array.prototype.slice.call(section.querySelectorAll(".pub-item"));
      var sectionTheme = section.getAttribute("data-pub-theme");
      var themeMatches = container !== thematic || activeFilter === "all" || sectionTheme === activeFilter;
      var hasVisibleCard = sectionCards.some(function (card) {
        return !card.classList.contains("is-filtered-out");
      });
      var sectionVisible = themeMatches && hasVisibleCard;
      section.classList.toggle("is-empty", !sectionVisible);
    });
  }

  function visiblePaperCount(container) {
    var visibleTitles = {};

    Array.prototype.slice.call(container.querySelectorAll(".pub-item")).forEach(function (card) {
      var section = card.closest(".publication-section");
      if (!card.classList.contains("is-filtered-out") && section && !section.classList.contains("is-empty")) {
        visibleTitles[textOf(card, "h3")] = true;
      }
    });

    return Object.keys(visibleTitles).length;
  }

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var cards = Array.prototype.slice.call(document.querySelectorAll(".pub-item"));
    cards.forEach(function (card) {
      card.classList.toggle("is-filtered-out", !cardMatches(card, query));
    });

    updateSections(thematic);
    updateSections(chronological);
    var visibleCount = visiblePaperCount(currentContainer());

    if (countNode) {
      var filterLabel = filterLabels[activeFilter] || activeFilter;
      countNode.textContent = "Showing " + visibleCount + " paper" + (visibleCount === 1 ? "" : "s") + " in " + filterLabel + ".";
    }
    if (emptyNode) {
      emptyNode.classList.toggle("is-hidden", visibleCount !== 0);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll(".pub-item")).forEach(enhanceCard);

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  function setFilterState(filter) {
    activeFilter = filter;
    filterButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-pub-filter") === activeFilter;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setFilterState(button.getAttribute("data-pub-filter") || "all");
      applyFilters();
    });
  });

  Array.prototype.slice.call(document.querySelectorAll(".toggle-button")).forEach(function (button) {
    button.addEventListener("click", function () {
      window.setTimeout(applyFilters, 0);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll(".pub-jump-links a")).forEach(function (link) {
    link.addEventListener("click", function () {
      var section = document.querySelector(link.getAttribute("href"));
      if (section && section.hasAttribute("data-pub-theme")) {
        setFilterState(section.getAttribute("data-pub-theme"));
      }
      window.setTimeout(applyFilters, 0);
    });
  });

  applyFilters();
})();
