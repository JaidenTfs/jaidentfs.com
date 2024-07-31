// Add JavaScript functionalities here if needed
console.log("JaidenTfs's Portfolio Website");
document.addEventListener('DOMContentLoaded', function() {
    // Select all links
    const links = document.querySelectorAll('a');

    // Add event listeners for hover effects
    links.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = '#ffd5a4'; // Hover color
        });

        link.addEventListener('mouseout', () => {
            link.style.color = ''; // Revert to original color
        });
    });
});
var audio = document.getElementById("aos");
  audio.volume = 0.7;

