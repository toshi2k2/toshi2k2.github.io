(function () {
  var searchInput = document.querySelector("[data-pub-search]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-pub-filter]"));
  var countNode = document.querySelector("[data-pub-count]");
  var emptyNode = document.querySelector("[data-pub-empty]");
  var thematic = document.getElementById("pub-thematic");
  var chronological = document.getElementById("pub-chronological");
  var activeFilter = "all";

  if (!thematic || !chronological) {
    return;
  }

  var abstracts = [
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
      text: "Adapts compositional feature dictionaries to improve image classification robustness under domain shift, corruptions, and occlusion."
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
      text: "Studies continual learning through optimal relevance mapping to reduce forgetting while preserving useful prior knowledge."
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
      text: "Studies part segmentation learned from synthetic animal data."
    },
    {
      match: /adaptive neural connections/i,
      text: "Learns adaptive sparse neural connectivity for efficient inference."
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

  function addTopic(topics, topic) {
    if (topics.indexOf(topic) === -1) {
      topics.push(topic);
    }
  }

  function inferTopics(card) {
    var text = card.textContent.toLowerCase();
    var title = textOf(card, "h3").toLowerCase();
    var section = card.closest(".publication-section");
    var sectionId = section ? section.id : "";
    var topics = [];

    if (/universal weight subspace|name that part/.test(title)) {
      addTopic(topics, "flagship");
    }
    if (/3d|part|pose|scene|animal|gaussian|reconstruction|mesh|compositional/.test(text) || /robust-vision|perception/.test(sectionId)) {
      addTopic(topics, "3d");
    }
    if (/lora|subspace|continual|adapter|efficient|sparsity|forgetting|incremental/.test(text) || sectionId === "theme-efficiency") {
      addTopic(topics, "efficient");
    }
    if (/robust|ood|domain|adaptation|occlusion|bayesian|source-free/.test(text) || sectionId === "theme-robust-vision") {
      addTopic(topics, "robustness");
    }
    if (/generative|diffusion|prompt|tridiff|gaussian scenes|text-to-image/.test(text) || sectionId === "theme-generative") {
      addTopic(topics, "generative");
    }
    if (/perceptual|taxonomy|hierarchical|vision-language|cognitive/.test(text)) {
      addTopic(topics, "cognitive");
    }
    if (!topics.length) {
      addTopic(topics, "other");
    }
    return topics;
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

    var topics = inferTopics(card);
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
    var visibleCount = 0;
    Array.prototype.slice.call(container.querySelectorAll(".publication-section")).forEach(function (section) {
      var sectionCards = Array.prototype.slice.call(section.querySelectorAll(".pub-item"));
      var sectionVisible = sectionCards.some(function (card) {
        return !card.classList.contains("is-filtered-out");
      });
      section.classList.toggle("is-empty", !sectionVisible);
      visibleCount += sectionCards.filter(function (card) {
        return !card.classList.contains("is-filtered-out");
      }).length;
    });
    return visibleCount;
  }

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var cards = Array.prototype.slice.call(document.querySelectorAll(".pub-item"));
    cards.forEach(function (card) {
      card.classList.toggle("is-filtered-out", !cardMatches(card, query));
    });

    updateSections(thematic);
    updateSections(chronological);
    var visibleCount = updateSections(currentContainer());

    if (countNode) {
      var filterLabel = activeFilter === "all" ? "all topics" : activeFilter.replace("3d", "3D");
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

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-pub-filter") || "all";
      filterButtons.forEach(function (candidate) {
        candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false");
      });
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
      window.setTimeout(applyFilters, 0);
    });
  });

  applyFilters();
})();
