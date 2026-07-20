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
        songFile: track.file
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
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ---------- Rendering project cards ---------- */

function renderProjects(trackIndexMap) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const visibleProjects = projects.filter(projectMatchesFilters);

  if (visibleProjects.length === 0) {
    container.innerHTML = '<div class="project-about" style="column-span: all;"><p>No projects match those filters.</p></div>';
    return;
  }

  let html = "";

  projects.forEach((project, projectIndex) => {
    if (!projectMatchesFilters(project)) return;

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

    html += `<div class="project" id="${project.id}">`;
    html += `<div class="project-banner"></div>`;
    html += `<div class="project-details">`;
    html += `<img src="${project.icon}" alt="${project.title} Icon" class="project-icon" title="Listen with music player" data-audio-index="${firstTrackIndex}">`;
    html += `<h3 title="${project.linkLabel}"><a href="${project.link}" target="_blank">${project.title}</a></h3>`;
    if (tagLine) html += `<p class="project-tags">${tagLine}</p>`;
    html += `<p>${project.description}</p>`;
    html += `<br></div>`;

    project.tracks.forEach((track, i) => {
      const audioIndex = trackIndexMap[projectIndex][i];
      html += `<div><br><h4 title="Listen with music player" data-audio-index="${audioIndex}">${track.title}</h4></div><br>`;
      html += `<p>${track.description}</p>`;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

function applyFilters() {
  const trackIndexMap = buildTrackIndex();
  renderProjects(trackIndexMap);
}

/* Click delegation: genre/category tags apply that filter,
   anything else with data-audio-index plays that track. */
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

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let currAudio = document.createElement("audio");
let playerEl = document.querySelector(".player");

function updateSeekFill(percent) {
  const clamped = Math.max(0, Math.min(100, percent));
  seek_slider.style.background =
    `linear-gradient(to right, var(--light-orange) ${clamped}%, var(--dark-blue) ${clamped}%)`;
}

function loadTrack(index) {
  clearInterval(updateTimer);
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
  isPlaying = true;
  playpause_btn.innerHTML = "<img src='media/pause-button.png' class='audio-buttons' alt='Pause Button'>";
  if (playerEl) playerEl.classList.add("is-playing");
}

function pauseAudio() {
  currAudio.pause();
  isPlaying = false;
  playpause_btn.innerHTML = "<img src='media/play-button.png' class='audio-buttons' alt='Play Button' width='22px'>";
  if (playerEl) playerEl.classList.remove("is-playing");
}

function nextAudio() {
  audioIndex = (audioIndex < audioList.length - 1) ? audioIndex + 1 : 0;
  loadTrack(audioIndex);
  playAudio();
}

function prevAudio() {
  audioIndex = (audioIndex > 0) ? audioIndex - 1 : audioList.length - 1;
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
}

function getTimestamps() {
  let seekto = parseFloat(localStorage.getItem("seekto"));
  currAudio.currentTime = seekto;
  seek_slider.value = (seekto / currAudio.duration) * 100;
  updateSeekFill(seek_slider.value);
  curr_time.textContent = localStorage.getItem("currentMinutes") + ":" + localStorage.getItem("currentSeconds");
  total_duration.textContent = localStorage.getItem("durationMinutes") + ":" + localStorage.getItem("durationSeconds");
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

document.addEventListener("keydown", handleSpacebarShortcut);

/* ---------- Boot everything ---------- */

buildAudioLists();
renderFilters();
applyFilters();
setupProjectClickHandler();

seek_slider.addEventListener("input", seekTo);
volume_slider.addEventListener("input", setVolume);

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
