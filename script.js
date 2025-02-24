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

let projectList = [];
let audioList = [];
loadLists();
loadTrack(audioIndex);

let seekUpdater = localStorage.getItem("seekto");

if (typeof seekUpdater !== 'undefined' && seekUpdater !== null) {
  getTimestamps();
}

updateScreen();

function loadTrack(audioIndex) {
  clearInterval(updateTimer);
  resetValues();
  currAudio.src = projectList[audioList[audioIndex].projectIndex].audioPath + audioList[audioIndex].songFile;
  currAudio.load();

  updateTimer = setInterval(seekUpdate, 1000);
  currAudio.addEventListener("ended", nextAudio);

  updateScreen();
}

function loadTrackButton(audioIndex2) {
  audioIndex = audioIndex2;
  clearInterval(updateTimer);
  resetValues();
  currAudio.src = projectList[audioList[audioIndex2].projectIndex].audioPath + audioList[audioIndex2].songFile;
  currAudio.load();

  updateTimer = setInterval(seekUpdate, 1000);
  currAudio.addEventListener("ended", nextAudio);

  updateScreen();
  playAudio();
}

function resetValues() {
  curr_time.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseAudio() {
  if (!isPlaying) playAudio();
  else pauseAudio();
}

function playAudio() {
  currAudio.play();
  isPlaying = true;
  playpause_btn.innerHTML = "<img src='media/pause-button.png' class='audio-buttons' alt='Pause Button'>";
}

function pauseAudio() {
  currAudio.pause();
  isPlaying = false;
  playpause_btn.innerHTML = "<img src='media/play-button.png' class='audio-buttons' alt='Play Button' width='22px'>";
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

seek_slider.addEventListener("input", seekTo);
volume_slider.addEventListener("input", setVolume);

function seekTo() {
  let seekto = currAudio.duration * (seek_slider.value / 100);
  currAudio.currentTime = seekto;
  localStorage.setItem("seekto", seekto);
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

    let currentMinutes = Math.floor(currAudio.currentTime / 60);
    let currentSeconds = Math.floor(currAudio.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(currAudio.duration / 60);
    let durationSeconds = Math.floor(currAudio.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

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
  localStorage.setItem("updateTimer", updateTimer);

  console.log("Now playing: " + projectList[audioList[audioIndex].projectIndex].title);
}

function getTimestamps() {
  let seekto = parseFloat(localStorage.getItem("seekto"));
  currAudio.currentTime = seekto;
  seek_slider.value = (seekto / currAudio.duration) * 100;
  curr_time.textContent = localStorage.getItem("currentMinutes") + ":" + localStorage.getItem("currentSeconds");
  total_duration.textContent = localStorage.getItem("durationMinutes") + ":" + localStorage.getItem("durationSeconds");
}

playAudio();
