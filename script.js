//Javascript!
let audioIndex = 0;
let isPlaying = false;
let updateTimer;

if (!isNaN(localStorage.getItem("audioIndex"))) audioIndex = localStorage.getItem("audioIndex");
if (isNaN(localStorage.getItem("isPlaying"))) isPlaying = localStorage.getItem("isPlaying");
if (isNaN(localStorage.getItem("updateTimer"))) updateTimer = localStorage.getItem("updateTimer");

//let now_playing = document.querySelector(".now-playing");
let project_image = document.querySelector(".project-image");
let audio_title = document.querySelector(".audio-title");
let project_title = document.querySelector(".project-title");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
// Create new audio element

let currAudio = document.createElement("audio");

// Load the first track in the tracklist
let projectList = [];
let audioList = [];
loadLists();
loadTrack(audioIndex);
updateScreen();

// Only letting one audio play at a single time

document.addEventListener("DOMContentLoaded", function() {
  onlyPlayOneIn(document.body);
});

function onlyPlayOneIn(container) {
  container.addEventListener("play", function(event) {
  audio_elements = container.getElementsByTagName("audio")
    for(i=0; i < audio_elements.length; i++) {
      audio_element = audio_elements[i];
      if (audio_element !== event.target) {
        audio_element.pause();
      }
    }
  }, true);
  
}

//For audio player
function loadTrack(audioIndex) {
  clearInterval(updateTimer);
  resetValues();
  currAudio.src = projectList[audioList[audioIndex].projectIndex].audioPath + audioList[audioIndex].songFile;    
  updateTimer = setInterval(seekUpdate, 1000);
  currAudio.addEventListener("ended", nextAudio);
  
  updateScreen()
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseAudio() {
  if (!isPlaying) playAudio();
  else pauseAudio();
}

function playAudio() {
  currAudio.play();
  isPlaying = true;
  playpause_btn.innerHTML = "<img src='html-projects/pause.png' width='75px' class='playpause-track'>";
}

function pauseAudio() {
  currAudio.pause();
  isPlaying = false;
  playpause_btn.innerHTML = "<img src='html-projects/play.png' width='75px' class='playpause-track'>";
}

function nextAudio() {
  if (audioIndex < audioList.length - 1)
    audioIndex += 1;
  else audioIndex = 0;
  loadTrack(audioIndex);
  playAudio();
}

function prevAudio() {
  if (audioIndex > 0)
    audioIndex -= 1;
  else audioIndex = audioList.length;
  loadTrack(audioIndex);
  playAudio();
}

function seekTo() {
  let seekto = currAudio.duration * (seek_slider.value / 100);
  currAudio.currentTime = seekto;
}

function setVolume() {
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
    localStorage.setItem("seekPosition", seekPosition);
    localStorage.setItem("currentMinutes", currentMinutes);
    localStorage.setItem("currentSeconds", currentSeconds);
    localStorage.setItem("durationMinutes", durationMinutes);
    localStorage.setItem("durationSeconds", durationSeconds);
    
    updateScreen();
  }
}

function updateScreen() {
    currAudio.load();
    project_image.style.backgroundImage = "url(" + projectList[audioList[audioIndex].projectIndex].imagePath + ")";
    audio_title.textContent = audioList[audioIndex].title;
    project_title.textContent = projectList[audioList[audioIndex].projectIndex].title;
//  now_playing.textContent = "PLAYING " + (audioIndex + 1) + " OF " + audioList.length;
  
    localStorage.setItem("audioIndex", audioIndex);
    localStorage.setItem("isPlaying", isPlaying);
    localStorage.setItem("updateTimer", updateTimer);

}
