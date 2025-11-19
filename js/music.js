/* ============================================================
   HYBRID DDLC × UNDERTALE MINI-PLAYER — FINAL VERSION
   Works on index.html AND story pages automatically
   ============================================================ */

// --- Detect correct music folder based on page depth ---
const isStoryPage = window.location.pathname.includes("story-page/html");

const basePath = isStoryPage
    ? "../music/"             // story pages
    : "story-page/music/";    // index.html

// --- Auto-generate track list ---
const TOTAL_TRACKS = 21; // change if you add more mp3 files
const tracks = Array.from({ length: TOTAL_TRACKS }, (_, i) =>
    `${basePath}track${i + 1}.mp3`
);

// --- Audio object ---
const audio = new Audio();
audio.volume = 0.4;

// Pick random starting track
function setRandomTrackAndNotify() {
    const next = tracks[Math.floor(Math.random() * tracks.length)];
    audio.src = next;
    // notify other scripts that track changed
    window.dispatchEvent(new CustomEvent('trackchange', { detail: { src: next } }));
}

setRandomTrackAndNotify();

let isPlaying = false;
let looping = false;

/* ============================================================
   ELEMENTS
   ============================================================ */
const playPause = document.getElementById("playPause");
const volumeSlider = document.getElementById("volume");
const loopBtn = document.getElementById("loopBtn");
const miniPlayer = document.getElementById("miniPlayer");

/* ============================================================
   PLAY / PAUSE
   ============================================================ */
playPause.addEventListener("click", () => {
    if (!isPlaying) {
        fadeInPlay();
        playPause.textContent = "Pause";
        isPlaying = true;
    } else {
        audio.pause();
        playPause.textContent = "Play";
        isPlaying = false;
    }
});

/* Smooth fade-in effect */
function fadeInPlay() {
    audio.volume = 0;
    audio.play();
    let vol = 0;
    const fade = setInterval(() => {
        vol += 0.02;
        audio.volume = Math.min(vol, volumeSlider.value / 100);
        if (vol >= volumeSlider.value / 100) clearInterval(fade);
    }, 40);
}

/* ============================================================
   VOLUME CONTROL
   ============================================================ */
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
});

/* ============================================================
   LOOP CONTROL
   ============================================================ */
loopBtn.addEventListener("click", () => {
    looping = !looping;
    audio.loop = looping;
    loopBtn.textContent = looping ? "Loop On" : "Loop Off";
});

/* ============================================================
   WHEN SONG ENDS → RANDOM NEXT SONG
   ============================================================ */
audio.addEventListener("ended", () => {
    if (!looping) {
        setRandomTrackAndNotify();
        audio.play();
    }
});

/* ============================================================
   DRAGGING (No stretch / no resize bug)
   ============================================================ */
let drag = false;
let offsetX = 0;
let offsetY = 0;

miniPlayer.addEventListener("mousedown", (e) => {
    drag = true;
    offsetX = e.clientX - miniPlayer.offsetLeft;
    offsetY = e.clientY - miniPlayer.offsetTop;

    miniPlayer.style.transition = "none"; // stop smooth scale when grabbing
});

document.addEventListener("mousemove", (e) => {
    if (drag) {
        miniPlayer.style.left = `${e.clientX - offsetX}px`;
        miniPlayer.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    drag = false;
    miniPlayer.style.transition = "transform 0.2s ease"; // restore scale animation
});

/* ============================================================
   SAFETY: Prevent text highlighting while dragging
   ============================================================ */
document.addEventListener("selectstart", (e) => {
    if (drag) e.preventDefault();
});
