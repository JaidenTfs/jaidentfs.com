//Javascript!
var musicList = [
  {name: "Skip this song",
   image: "",
   path: ""},
  
  {name: "Skip this song",
    image: "",
    path: ""},
  
  {"s2",};
"kc1","kc2","kc3","lgbs1","lgbs2","lgbs3","lgbs4","lgbs5","lgbs6","dc1","dc2","dc3","s1"];
var isPlaying

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

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<img src="pause.png" width="75px" class="fa fa-pause-circle fa-5x">       ';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<img src="play.png" width="75px" class="fa fa-play-circle fa-5x">';;
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

function updateScreen() {
  
  setProperty("test","audio",bandName);
}
