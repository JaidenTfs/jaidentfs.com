//Javascript!
var audioIndex = 0;
var isPlaying = false;
var updateTimer;

// Create new audio element
var currAudio = document.createElement('audio');

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
  currAudio.load();

  projectImage.style.backgroundImage = "url(" + projectList[audioList[audioIndex].projectIndex].imagePath + ")";
  audioTitle.textContent = audioList[audioIndex].title;
  projectTitle.textContent = projectList[audioList[audioIndex].projectIndex].title
//  now_playing.textContent = "PLAYING " + (audioIndex + 1) + " OF " + audioList.length;

  updateTimer = setInterval(seekUpdate, 1000);
  currAudio.addEventListener("ended", nextAudio);
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(audioIndex);

function playpauseAudio() {
  if (!isPlaying) playAudio();
  else pauseAudio();
}

function playAudio() {
  currAudio.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<img src="pause.png" width="75px" class="html-projects/fa fa-pause-circle fa-5x">';
}

function pauseAudio() {
  currAudio.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<img src="play.png" width="75px" class="html-projects/fa fa-play-circle fa-5x">';
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

function updateScreen() {
  
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
  }
}
