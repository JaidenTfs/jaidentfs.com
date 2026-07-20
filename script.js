/* ============================================================
   script.js
   ------------------------------------------------------------
   Builds the portfolio cards + filter controls from the
   "projects" array in data.js, and drives the sticky music
   player at the bottom of the page. You shouldn't need to
   edit this file to add new music -- just edit data.js.
   ============================================================ */

/* ---------- Flatten data.js into the two lists the player needs ---------- */

let projectList = [];
let audioList = [];

function buildAudioLists() {
  projectList = [];
  audioList = [];

  projects.forEach((project, projectIndex) => {
    projectList.push({
      title: project.title,
      imagePath: project.icon,
      audioPath: project.audioPath
    });

    project.tracks.forEach((track) => {
      audioList.push({
        title: track.title,
        projectIndex: projectIndex,
        songFile: track.file,
        interactive: track.interactive || null
      });
    });
  });
}

/* Give every track a flat, stable index into audioList so the
   player and the rendered HTML agree on "which song is this". */
function buildTrackIndex() {
  let counter = 0;
  const map = []; // map[projectIndex] = [audioIndex, audioIndex, ...]
  projects.forEach((project, projectIndex) => {
    map[projectIndex] = [];
    project.tracks.forEach(() => {
      map[projectIndex].push(counter);
      counter++;
    });
  });
  return map;
}

/* ---------- Filters ---------- */

let activeGenre = "all";
let activeCategory = "all";
let activeYear = "all";

function getAllGenres() {
  const genres = new Set();
  projects.forEach((p) => p.genres.forEach((g) => genres.add(g)));
  return Array.from(genres).sort();
}

function getAllCategories() {
  const categories = new Set();
  projects.forEach((p) => {
    if (p.category) categories.add(p.category);
  });
  return Array.from(categories).sort();
}

function getAllYears() {
  const years = new Set();
  projects.forEach((p) => {
    if (p.year) years.add(p.year);
  });
  return Array.from(years).sort((a, b) => b - a);
}

function projectMatchesFilters(project) {
  if (activeGenre !== "all" && !project.genres.includes(activeGenre)) {
    return false;
  }
  if (activeCategory !== "all" && project.category !== activeCategory) {
    return false;
  }
  if (activeYear !== "all" && String(project.year) !== String(activeYear)) {
    return false;
  }
  return true;
}

function renderFilters() {
  const container = document.getElementById("filters");
  if (!container) return;

  const genres = getAllGenres();
  const categories = getAllCategories();
  const years = getAllYears();

  let html = '<div class="filter-group">';

  html += '<span class="filter-label">Genre:</span>';
  html += `<button type="button" class="filter-btn genre-btn ${activeGenre === "all" ? "active" : ""}" data-genre="all">All</button>`;
  genres.forEach((g) => {
    const isActive = activeGenre === g;
    html += `<button type="button" class="filter-btn genre-btn ${isActive ? "active" : ""}" data-genre="${g}">${capitalize(g)}</button>`;
  });

  html += '</div><div class="filter-group">';

  html += '<span class="filter-label">Type:</span>';
  html += `<button type="button" class="filter-btn category-btn ${activeCategory === "all" ? "active" : ""}" data-category="all">All</button>`;
  categories.forEach((c) => {
    const isActive = activeCategory === c;
    html += `<button type="button" class="filter-btn category-btn ${isActive ? "active" : ""}" data-category="${c}">${c}</button>`;
  });

  html += '</div><div class="filter-group">';

  html += '<span class="filter-label">Year:</span>';
  html += `<select id="year-select" class="filter-select">`;
  html += `<option value="all">All</option>`;
  years.forEach((y) => {
    html += `<option value="${y}" ${String(activeYear) === String(y) ? "selected" : ""}>${y}</option>`;
  });
  html += `</select>`;

  html += '</div><div class="filter-group">';

  html += `<button type="button" class="filter-btn" id="expand-all-btn">Expand All</button>`;
  html += `<button type="button" class="filter-btn" id="collapse-all-btn">Collapse All</button>`;

  html += "</div>";

  container.innerHTML = html;

  container.querySelectorAll(".genre-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeGenre = btn.dataset.genre;
      renderFilters();
      applyFilters();
    });
  });

  container.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderFilters();
      applyFilters();
    });
  });

  const yearSelect = document.getElementById("year-select");
  if (yearSelect) {
    yearSelect.addEventListener("change", () => {
      activeYear = yearSelect.value;
      applyFilters();
    });
  }

  const expandAllBtn = document.getElementById("expand-all-btn");
  if (expandAllBtn) expandAllBtn.addEventListener("click", expandAllVisible);

  const collapseAllBtn = document.getElementById("collapse-all-btn");
  if (collapseAllBtn) collapseAllBtn.addEventListener("click", collapseAllVisible);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ---------- Rendering project cards ---------- */

let currentQueue = []; // global audio indices, in the order currently visible on screen
let expandedProjects = new Set(); // project ids whose track list is currently open
let autoExpandedProjectId = null; // project id the player itself opened, if any

/* How many fixed columns the portfolio grid currently uses. Kept in
   sync with the CSS breakpoints in styles.css (.portfolio-columns). */
function getColumnCount() {
  const w = window.innerWidth;
  if (w >= 1050) return 3;
  if (w >= 740) return 2;
  return 1;
}

let lastColumnCount = null;

function buildProjectCardHtml(project, projectIndex, trackIndexMap) {
  const firstTrackIndex = trackIndexMap[projectIndex][0];
  const genreTags = project.genres
    .map((g) => `<span class="tag-link" data-filter-genre="${g}">${capitalize(g)}</span>`)
    .join(", ");
  const categoryLabel = project.jamName ? `${project.category} (${project.jamName})` : project.category;
  const categoryTag = project.category
    ? `<span class="tag-link" data-filter-category="${project.category}">${categoryLabel}</span>`
    : null;
  const tagLine = [genreTags || null, categoryTag, project.year || null]
    .filter(Boolean)
    .join(" &middot; ");

  const isExpanded = expandedProjects.has(project.id);
  const trackCount = project.tracks.length;
  const trackWord = trackCount === 1 ? "track" : "tracks";
  const toggleTitle = isExpanded ? "Hide tracks" : `Show ${trackCount} ${trackWord}`;

  let html = `<div class="project reveal" id="${project.id}">`;

  html += `<button type="button" class="track-toggle${isExpanded ? " expanded" : ""}" data-toggle-project="${project.id}" data-track-count="${trackCount}" aria-expanded="${isExpanded}" title="${toggleTitle}" aria-label="${toggleTitle}">`;
  html += `<span class="track-toggle-icon">&#9662;</span>`;
  html += `</button>`;

  html += `<div class="project-banner"></div>`;
  html += `<div class="project-details">`;
  html += `<img src="${project.icon}" alt="${project.title} Icon" class="project-icon" title="Listen with music player" data-audio-index="${firstTrackIndex}">`;
  const titleHtml = project.link
    ? `<a href="${project.link}" target="_blank">${project.title}</a>`
    : project.title;
  html += `<h3${project.linkLabel ? ` title="${project.linkLabel}"` : ""}>${titleHtml}</h3>`;
  if (tagLine) html += `<p class="project-tags">${tagLine}</p>`;
  html += `<p>${project.description}</p>`;
  html += `</div>`;

  html += `<div class="track-list${isExpanded ? " expanded" : ""}">`;
  project.tracks.forEach((track, i) => {
    const audioIndex = trackIndexMap[projectIndex][i];
    currentQueue.push(audioIndex);
    html += `<div class="track">`;
    html += `<h4 title="Listen with music player" data-audio-index="${audioIndex}">${track.title}</h4>`;
    html += `<p>${track.description}</p>`;

    if (track.interactive) {
      html += `<div class="variation-controls">`;
      html += `<button type="button" class="variation-btn active" data-audio-index="${audioIndex}" data-variation-file="${track.file}">${track.interactive.mainLabel || "Main"}</button>`;
      track.interactive.variations.forEach((v) => {
        html += `<button type="button" class="variation-btn" data-audio-index="${audioIndex}" data-variation-file="${v.file}">${v.label}</button>`;
      });
      if (track.interactive.layer) {
        html += `<button type="button" class="layer-toggle-btn" data-audio-index="${audioIndex}" data-layer-file="${track.interactive.layer.file}">+ ${track.interactive.layer.label}</button>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
  });
  html += `</div>`;

  html += `</div>`;
  return html;
}

/* Renders each visible project into a fixed column (round-robin by
   data order) instead of relying on CSS column-count. column-count
   continuously rebalances column heights, which is what was causing
   a project to visually jump to a different column whenever another
   project's track list expanded or collapsed. Locking each project
   into one column means expanding it only ever pushes down whatever
   is below it in that SAME column -- other columns don't move. */
function renderProjects(trackIndexMap) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const visibleProjects = projects.filter(projectMatchesFilters);
  currentQueue = [];

  if (visibleProjects.length === 0) {
    container.innerHTML = '<div class="project-about"><p>No projects match those filters.</p></div>';
    return;
  }

  const numColumns = getColumnCount();
  lastColumnCount = numColumns;
  const columns = Array.from({ length: numColumns }, () => []);
  let visibleIndex = 0;

  projects.forEach((project, projectIndex) => {
    if (!projectMatchesFilters(project)) return;
    columns[visibleIndex % numColumns].push(buildProjectCardHtml(project, projectIndex, trackIndexMap));
    visibleIndex++;
  });

  let html = '<div class="portfolio-columns">';
  columns.forEach((colCards) => {
    html += `<div class="portfolio-column">${colCards.join("")}</div>`;
  });
  html += "</div>";

  container.innerHTML = html;
  observeReveals(container);
  highlightNowPlaying();
}

/* Opens or closes a single project's track list, updating both the DOM
   (for a smooth CSS transition) and the tracked state (so it survives
   the next re-render, e.g. from a filter change).
   Pass { auto: true } when this is the player doing it automatically
   (so a later manual toggle knows it can take over "ownership" of the
   state) rather than the person clicking the toggle button themselves. */
function setTrackListExpanded(projectId, expanded, { auto = false } = {}) {
  if (expanded) {
    expandedProjects.add(projectId);
  } else {
    expandedProjects.delete(projectId);
  }

  if (!auto && autoExpandedProjectId === projectId) {
    // The person just manually touched the project we last auto-expanded --
    // it's theirs now, don't auto-collapse it later.
    autoExpandedProjectId = null;
  }

  const projectEl = document.getElementById(projectId);
  if (!projectEl) return;

  const trackList = projectEl.querySelector(".track-list");
  const toggleBtn = projectEl.querySelector(".track-toggle");
  if (trackList) trackList.classList.toggle("expanded", expanded);
  if (toggleBtn) {
    toggleBtn.classList.toggle("expanded", expanded);
    toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    const count = toggleBtn.dataset.trackCount;
    const label = toggleBtn.querySelector(".track-toggle-label");
    if (label) {
      label.textContent = expanded ? "Hide tracks" : `Show ${count} ${count === "1" ? "track" : "tracks"}`;
    }
  }
}

function expandAllVisible() {
  document.querySelectorAll("#projects-container .project").forEach((el) => {
    setTrackListExpanded(el.id, true);
  });
}

function collapseAllVisible() {
  document.querySelectorAll("#projects-container .project").forEach((el) => {
    setTrackListExpanded(el.id, false);
  });
}

function applyFilters() {
  const trackIndexMap = buildTrackIndex();
  renderProjects(trackIndexMap);
}

/* Click delegation: genre/category tags apply that filter, the track-list
   toggle opens/closes that project's tracks, anything else with
   data-audio-index plays that track. */
function setupProjectClickHandler() {
  const container = document.getElementById("projects-container");
  if (!container) return;
  container.addEventListener("click", (e) => {
    const genreTag = e.target.closest("[data-filter-genre]");
    if (genreTag) {
      activeGenre = genreTag.dataset.filterGenre;
      renderFilters();
      applyFilters();
      return;
    }

    const categoryTag = e.target.closest("[data-filter-category]");
    if (categoryTag) {
      activeCategory = categoryTag.dataset.filterCategory;
      renderFilters();
      applyFilters();
      return;
    }

    const toggleBtn = e.target.closest("[data-toggle-project]");
    if (toggleBtn) {
      const projectId = toggleBtn.dataset.toggleProject;
      setTrackListExpanded(projectId, !expandedProjects.has(projectId));
      return;
    }

    const variationBtn = e.target.closest("[data-variation-file]");
    if (variationBtn) {
      const index = parseInt(variationBtn.dataset.audioIndex, 10);
      selectVariation(index, variationBtn.dataset.variationFile, variationBtn);
      return;
    }

    const layerBtn = e.target.closest("[data-layer-file]");
    if (layerBtn) {
      const index = parseInt(layerBtn.dataset.audioIndex, 10);
      toggleLayer(index, layerBtn.dataset.layerFile, layerBtn);
      return;
    }

    const audioTarget = e.target.closest("[data-audio-index]");
    if (audioTarget) {
      const index = parseInt(audioTarget.dataset.audioIndex, 10);
      if (!isNaN(index)) {
        loadTrackButton(index);
      }
    }
  });
}

/* ============================================================
   Music player (same behavior as before, now reading from the
   projectList / audioList built out of data.js)
   ============================================================ */

let audioIndex = localStorage.getItem("audioIndex") !== null ? parseInt(localStorage.getItem("audioIndex")) : 0;
let isPlaying = localStorage.getItem("isPlaying") === "true";
let updateTimer;

let project_image = document.querySelector(".project-image");
let audio_title = document.querySelector(".audio-title-2");
let project_title = document.querySelector(".project-title");
let audio_info = document.querySelector(".audio-info");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let currAudio = document.createElement("audio");
let playerEl = document.querySelector(".player");

/* ---------- Optional interactive variations + layer (opt-in per track) ----------
   Only kicks in for tracks that define an `interactive` object in data.js
   (see the documented example near the bottom of data.js). Everything
   else on the site is unaffected if a track doesn't have one. */
let secondaryAudio = document.createElement("audio");
let layerAudio = document.createElement("audio");
let layerOn = false;
let crossfadeTimer = null;

function stopInteractiveLayer() {
  layerAudio.pause();
  layerOn = false;
}

/* Crossfades the currently playing track into a different variation
   file (or back to the main file). Only meaningful while the track
   with this audioIndex is the one actually loaded as currAudio. */
function selectVariation(index, file, btnEl) {
  if (index !== audioIndex) return; // only act on the currently loaded track
  if (crossfadeTimer) return; // a crossfade is already in progress, ignore rapid clicks

  const basePath = projectList[audioList[index].projectIndex].audioPath;
  const newSrc = basePath + file;
  if (currAudio.src.endsWith(file)) return; // already on this variation

  const controlsEl = btnEl.closest(".variation-controls");
  const startVolume = currAudio.volume;
  const fadeMs = 900;
  const steps = 30;
  let step = 0;

  secondaryAudio.pause();
  secondaryAudio.src = newSrc;
  secondaryAudio.loop = true;
  secondaryAudio.volume = 0;
  secondaryAudio.play().catch(() => {});

  crossfadeTimer = setInterval(() => {
    step++;
    const t = step / steps;
    currAudio.volume = startVolume * (1 - t);
    secondaryAudio.volume = startVolume * t;

    if (step >= steps) {
      clearInterval(crossfadeTimer);
      crossfadeTimer = null;
      currAudio.pause();

      const finished = secondaryAudio;
      secondaryAudio = currAudio;
      currAudio = finished;
      currAudio.volume = startVolume;

      if (layerOn) {
        layerAudio.currentTime = currAudio.currentTime;
      }
      if (controlsEl) {
        controlsEl.querySelectorAll(".variation-btn").forEach((b) => {
          b.classList.toggle("active", b.dataset.variationFile === file);
        });
      }
    }
  }, fadeMs / steps);
}

/* Adds or removes the toggleable instrument layer, looping alongside
   whatever variation is currently playing. Re-syncs its position to
   the main track every time it's turned on to keep drift in check --
   it isn't sample-accurate, but stays close over normal listening. */
function toggleLayer(index, file, btnEl) {
  if (index !== audioIndex) return;

  if (layerOn) {
    stopInteractiveLayer();
    btnEl.classList.remove("active");
    return;
  }

  const basePath = projectList[audioList[index].projectIndex].audioPath;
  layerAudio.src = basePath + file;
  layerAudio.loop = true;
  layerAudio.currentTime = currAudio.currentTime;
  layerAudio.volume = currAudio.volume;
  layerAudio.play().catch(() => {});
  layerOn = true;
  btnEl.classList.add("active");
}

function updateSeekFill(percent) {
  paintSliderFill(seek_slider, percent);
}

function updateVolumeFill(percent) {
  paintSliderFill(volume_slider, percent);
}

function paintSliderFill(slider, percent) {
  const clamped = Math.max(0, Math.min(100, percent));
  slider.style.background =
    `linear-gradient(to right, var(--player-accent, var(--light-orange)) ${clamped}%, var(--dark-blue) ${clamped}%)`;
}

/* Resets a track's variation/layer buttons back to "Main theme,
   layer off" in the DOM -- keeps the UI honest with the fact that
   loadTrack() always resets actual playback to the plain main file. */
function resetVariationControls(index) {
  const trackEl = document.querySelector(`.track h4[data-audio-index="${index}"]`);
  if (!trackEl) return;
  const controls = trackEl.closest(".track");
  if (!controls) return;

  controls.querySelectorAll(".variation-btn").forEach((b, i) => {
    b.classList.toggle("active", i === 0); // first button is always "Main"
  });
  controls.querySelectorAll(".layer-toggle-btn").forEach((b) => {
    b.classList.remove("active");
  });
}

function loadTrack(index) {
  clearInterval(updateTimer);
  clearInterval(crossfadeTimer);
  crossfadeTimer = null;
  stopInteractiveLayer();
  secondaryAudio.pause();
  resetVariationControls(index);
  resetValues();
  currAudio.src = projectList[audioList[index].projectIndex].audioPath + audioList[index].songFile;
  currAudio.load();

  updateTimer = setInterval(seekUpdate, 1000);
  currAudio.addEventListener("ended", nextAudio);

  updateScreen();
}

function loadTrackButton(index) {
  audioIndex = index;
  clearInterval(updateTimer);
  clearInterval(crossfadeTimer);
  crossfadeTimer = null;
  stopInteractiveLayer();
  secondaryAudio.pause();
  resetVariationControls(index);
  resetValues();
  currAudio.src = projectList[audioList[index].projectIndex].audioPath + audioList[index].songFile;
  currAudio.load();

  updateTimer = setInterval(seekUpdate, 1000);
  currAudio.addEventListener("ended", nextAudio);

  updateScreen();
  playAudio();
}

function resetValues() {
  curr_time.textContent = "00:00";
  seek_slider.value = 0;
  updateSeekFill(0);
}

function playpauseAudio() {
  if (!isPlaying) playAudio();
  else pauseAudio();
}

function playAudio() {
  currAudio.play();
  if (layerOn) layerAudio.play().catch(() => {});
  isPlaying = true;
  playpause_btn.innerHTML = "<img src='media/pause-button.png' class='audio-buttons' alt='Pause Button'>";
  if (playerEl) playerEl.classList.add("is-playing");
}

function pauseAudio() {
  currAudio.pause();
  if (layerOn) layerAudio.pause();
  isPlaying = false;
  playpause_btn.innerHTML = "<img src='media/play-button.png' class='audio-buttons' alt='Play Button' width='22px'>";
  if (playerEl) playerEl.classList.remove("is-playing");
}

/* Returns the queue to navigate through: the currently filtered/visible
   tracks on the portfolio page, or the full library everywhere else
   (or if nothing's been rendered into a queue yet). */
function getPlaybackQueue() {
  return currentQueue.length ? currentQueue : audioList.map((_, i) => i);
}

function nextAudio() {
  const queue = getPlaybackQueue();
  const pos = queue.indexOf(audioIndex);
  const nextPos = pos === -1 ? 0 : (pos + 1) % queue.length;
  audioIndex = queue[nextPos];
  loadTrack(audioIndex);
  playAudio();
}

function prevAudio() {
  const queue = getPlaybackQueue();
  const pos = queue.indexOf(audioIndex);
  const prevPos = pos === -1 ? 0 : (pos - 1 + queue.length) % queue.length;
  audioIndex = queue[prevPos];
  loadTrack(audioIndex);
  playAudio();
}

function seekTo() {
  let seekto = currAudio.duration * (seek_slider.value / 100);
  currAudio.currentTime = seekto;
  localStorage.setItem("seekto", seekto);
  updateSeekFill(seek_slider.value);
}

function setVolume() {
  currAudio.volume = volume_slider.value / 100;
  if (layerOn) layerAudio.volume = currAudio.volume;
  localStorage.setItem("volume", volume_slider.value);
  updateVolumeFill(volume_slider.value);
}

function muteVolume() {
  currAudio.volume = 0;
}

function unmuteVolume() {
  currAudio.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(currAudio.duration)) {
    seekPosition = currAudio.currentTime * (100 / currAudio.duration);
    seek_slider.value = seekPosition;
    updateSeekFill(seekPosition);

    let currentMinutes = Math.floor(currAudio.currentTime / 60);
    let currentSeconds = Math.floor(currAudio.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(currAudio.duration / 60);
    let durationSeconds = Math.floor(currAudio.duration - durationMinutes * 60);

    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;
    if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
    if (durationMinutes < 10) durationMinutes = "0" + durationMinutes;

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;

    let seekto = currAudio.duration * (seek_slider.value / 100);
    localStorage.setItem("seekto", seekto);

    localStorage.setItem("seekPosition", seekPosition);
    localStorage.setItem("currentMinutes", currentMinutes);
    localStorage.setItem("currentSeconds", currentSeconds);
    localStorage.setItem("durationMinutes", durationMinutes);
    localStorage.setItem("durationSeconds", durationSeconds);
    localStorage.setItem("audioDuration", currAudio.duration);

    updateScreen();
  }
}

function updateScreen() {
  project_image.src = projectList[audioList[audioIndex].projectIndex].imagePath;
  audio_title.innerHTML = audioList[audioIndex].title;
  project_title.textContent = projectList[audioList[audioIndex].projectIndex].title;

  localStorage.setItem("audioIndex", audioIndex);
  localStorage.setItem("isPlaying", isPlaying);

  applyPlayerTheme(projects[audioList[audioIndex].projectIndex]);
  highlightNowPlaying();
}

/* Lets a project optionally recolor the player to match its vibe
   (see the "theme" field documented in data.js). Falls back to the
   site's normal palette for any project that doesn't define one. */
function applyPlayerTheme(project) {
  if (!playerEl) return;
  const theme = project && project.theme;
  if (theme) {
    playerEl.style.setProperty("--player-bg", theme.background || "");
    playerEl.style.setProperty("--player-accent", theme.accent || "");
  } else {
    playerEl.style.removeProperty("--player-bg");
    playerEl.style.removeProperty("--player-accent");
  }
}

let lastHighlightedProjectId = null;

/* Outlines whichever project card the currently playing track belongs
   to, marks that specific track's row, and auto-opens its track list
   if it was collapsed -- closing whichever one we last auto-opened,
   as long as the person hasn't since opened it themselves. If the
   current project actually changed (not just the track within it),
   scrolls it into view once its layout has settled.
   Safe to call on pages with no #projects-container (does nothing). */
function highlightNowPlaying() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.querySelectorAll(".project.now-playing").forEach((el) => {
    el.classList.remove("now-playing");
  });
  container.querySelectorAll(".track.now-playing").forEach((el) => {
    el.classList.remove("now-playing");
  });

  const currentTrack = audioList[audioIndex];
  if (!currentTrack) return;

  const project = projects[currentTrack.projectIndex];
  if (!project) return;

  const projectChanged = project.id !== lastHighlightedProjectId;
  lastHighlightedProjectId = project.id;

  const projectEl = document.getElementById(project.id);
  if (projectEl) {
    projectEl.classList.add("now-playing");

    const trackEl = projectEl.querySelector(`.track-list [data-audio-index="${audioIndex}"]`);
    const trackRow = trackEl ? trackEl.closest(".track") : null;
    if (trackRow) trackRow.classList.add("now-playing");
  }

  if (autoExpandedProjectId && autoExpandedProjectId !== project.id) {
    setTrackListExpanded(autoExpandedProjectId, false, { auto: true });
  }

  if (!expandedProjects.has(project.id)) {
    setTrackListExpanded(project.id, true, { auto: true });
    autoExpandedProjectId = project.id;
  } else if (autoExpandedProjectId !== project.id) {
    // Already open on its own (the person opened it manually) -- leave
    // it alone and don't claim it as ours to auto-collapse later.
    autoExpandedProjectId = null;
  }

  if (projectChanged && projectEl) {
    // Wait for the track-list expand transition to mostly settle
    // before measuring where to scroll to.
    setTimeout(() => scrollProjectIntoView(projectEl), 380);
  }
}

function scrollProjectIntoView(el) {
  const rect = el.getBoundingClientRect();
  const alreadyInView = rect.top >= 60 && rect.bottom <= window.innerHeight - 100;
  if (!alreadyInView) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function getTimestamps() {
  let seekto = parseFloat(localStorage.getItem("seekto"));
  currAudio.currentTime = seekto;
  seek_slider.value = (seekto / currAudio.duration) * 100;
  updateSeekFill(seek_slider.value);
  curr_time.textContent = localStorage.getItem("currentMinutes") + ":" + localStorage.getItem("currentSeconds");
  total_duration.textContent = localStorage.getItem("durationMinutes") + ":" + localStorage.getItem("durationSeconds");
}

/* ---------- Reveal-on-scroll animations ---------- */

let revealObserver = null;

function getRevealObserver() {
  if (revealObserver) return revealObserver;
  if (!("IntersectionObserver" in window)) return null;
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  return revealObserver;
}

function observeReveals(scope) {
  const root = scope || document;
  const observer = getRevealObserver();

  if (!observer) {
    // No IntersectionObserver support -- just show everything immediately.
    root.querySelectorAll(".reveal:not(.reveal-visible)").forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  // Wait a frame before observing newly-inserted elements (e.g. portfolio
  // cards rendered via innerHTML). Without this, the browser can decide
  // they're already "intersecting" before it ever paints their hidden
  // state, so they'd just appear instantly with no visible fade-in.
  requestAnimationFrame(() => {
    root.querySelectorAll(".reveal:not(.reveal-visible)").forEach((el) => observer.observe(el));
  });
}

/* ---------- Shrinking header on scroll ---------- */

function initHeaderShrink() {
  const header = document.querySelector("header");
  if (!header) return;

  const SHRINK_KEY = "headerShrunk";
  // Hysteresis: shrink and expand at different scroll positions so
  // scrolling right at "the" threshold can't flip the state back and
  // forth every frame (which is what caused the fast flicker).
  const SHRINK_AT = 120;
  const EXPAND_AT = 40;

  let isShrunk = localStorage.getItem(SHRINK_KEY) === "true";
  if (isShrunk) header.classList.add("header-shrunk");

  let ticking = false;

  function applyScrollState() {
    const y = window.scrollY;
    if (!isShrunk && y > SHRINK_AT) {
      isShrunk = true;
    } else if (isShrunk && y < EXPAND_AT) {
      isShrunk = false;
    } else {
      ticking = false;
      return; // nothing crossed a threshold, don't touch the DOM
    }
    header.classList.toggle("header-shrunk", isShrunk);
    localStorage.setItem(SHRINK_KEY, isShrunk ? "true" : "false");
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyScrollState);
    },
    { passive: true }
  );
}

/* Spacebar toggles play/pause instead of scrolling the page.
   Skipped while typing in a form field or focused on a slider,
   so the contact form and the range inputs still behave normally. */
function handleSpacebarShortcut(e) {
  if (e.code !== "Space" && e.key !== " ") return;

  const active = document.activeElement;
  const tag = active ? active.tagName : "";
  const isFormField =
    tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" ||
    (active && active.isContentEditable);
  if (isFormField) return;

  e.preventDefault();
  playpauseAudio();
}

/* Takes the person to whichever project the currently playing track
   belongs to -- expanding and scrolling to it if already on the
   portfolio page, or navigating there (with a URL hash) otherwise. */
function goToCurrentProject() {
  const currentTrack = audioList[audioIndex];
  if (!currentTrack) return;
  const project = projects[currentTrack.projectIndex];
  if (!project) return;

  const container = document.getElementById("projects-container");
  if (container) {
    setTrackListExpanded(project.id, true);
    const el = document.getElementById(project.id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    window.location.href = "portfolio#" + encodeURIComponent(project.id);
  }
}

/* On the portfolio page, if the URL was opened with a #project-id hash
   (e.g. via goToCurrentProject() navigating from another page), expand
   and scroll to that project once the cards have rendered. */
function openProjectFromHash() {
  if (!location.hash) return;
  const id = decodeURIComponent(location.hash.slice(1));
  const el = document.getElementById(id);
  if (!el) return;
  setTrackListExpanded(id, true);
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* Re-render the portfolio grid if the number of columns should change
   (crossing a responsive breakpoint) -- column-count isn't driven by
   CSS anymore (see renderProjects), so this has to happen in JS. */
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (getColumnCount() !== lastColumnCount) {
      applyFilters();
    }
  }, 150);
});

document.addEventListener("keydown", handleSpacebarShortcut);
initHeaderShrink();
observeReveals();

/* ---------- Boot everything ---------- */

buildAudioLists();

/* Don't let the very first highlightNowPlaying() call (during boot)
   trigger a scroll -- only genuine changes afterward (skipping to a
   different project, clicking a different project's art, etc.)
   should do that. */
if (audioList[audioIndex]) {
  lastHighlightedProjectId = projects[audioList[audioIndex].projectIndex].id;
}

renderFilters();
applyFilters();
setupProjectClickHandler();
openProjectFromHash();

if (audio_info) {
  audio_info.addEventListener("click", goToCurrentProject);
}

seek_slider.addEventListener("input", seekTo);
volume_slider.addEventListener("input", setVolume);

/* Restore the volume the person had set on whatever page they were on
   before, so it carries over as they browse the site. */
const savedVolume = localStorage.getItem("volume");
if (savedVolume !== null) {
  volume_slider.value = savedVolume;
}
currAudio.volume = volume_slider.value / 100;
updateVolumeFill(volume_slider.value);

loadTrack(audioIndex);

let seekUpdater = localStorage.getItem("seekto");
if (typeof seekUpdater !== "undefined" && seekUpdater !== null) {
  getTimestamps();
}

updateScreen();

/* Start paused on a fresh visit. If the person was already playing
   music and clicked to another page (e.g. index -> portfolio),
   isPlaying was saved as true, so we pick back up where they left off
   instead of forcing a restart every time they navigate. */
if (isPlaying) {
  playAudio();
} else {
  pauseAudio();
}
