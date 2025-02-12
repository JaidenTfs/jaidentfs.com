// //Javascript!
// console.log ("JaidenTfs");
//  window.onload = function() 
//   { document.getElementById("hideAll").style.display = "none"; 
//     console.log (Loading Main HTML);}

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
