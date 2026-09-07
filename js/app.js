// js/app.js

"use strict";

const audio = document.getElementById("audio");

const playButton = document.getElementById("floatingPlay");
const playIcon = document.getElementById("floatingPlayIcon");

const previousButton = document.getElementById("floatingPrevious");
const nextButton = document.getElementById("floatingNext");

const rewindButton = document.getElementById("floatingRewind");
const forwardButton = document.getElementById("floatingForward");

const progress = document.getElementById("floatingProgress");
const progressFill = document.getElementById("floatingProgressFill");

const currentTimeElement =
    document.getElementById("floatingCurrentTime");

const durationElement =
    document.getElementById("floatingDuration");

const volume =
    document.getElementById("floatingVolume");

const muteButton =
    document.getElementById("floatingMute");

const volumeIcon =
    document.getElementById("floatingVolumeIcon");

const player =
    document.getElementById("floatingPlayer");

const titleElement =
    document.getElementById("floatingTitle");

const PLAY_ICON = `
    <path d="M8 5v14l11-7L8 5z"/>
`;

const PAUSE_ICON = `
    <path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z"/>
`;

const VOLUME_ICON = `
    <path d="M4 9v6h4l5 4V5L8 9H4z"/>
    <path d="M16 9.5c1 1.4 1 3.6 0 5"/>
    <path d="M18.5 7c2.3 2.5 2.3 7.5 0 10"/>
`;

const MUTED_ICON = `
    <path d="M4 9v6h4l5 4V5L8 9H4z"/>
    <path d="m17 9 4 6"/>
    <path d="m21 9-4 6"/>
`;

// js/app.js

// js/app.js

const tracks = [
    { title: "Rabba", file: "assets/image/audio/Rabba.mp3" },
    { title: "Chaar Kadam", file: "assets/image/audio/Chaar Kadam.mp3" },
    { title: "Humsafar", file: "assets/image/audio/Humsafar.mp3" },
    { title: "O Sanam", file: "assets/image/audio/O Sanam.mp3" },
    { title: "Samjhawan", file: "assets/image/audio/Samjhawan.mp3" },
    { title: "Tere Naina", file: "assets/image/audio/Tere Naina.mp3" },
    { title: "Halka Halka", file: "assets/image/audio/Halka Halka.mp3" },
    { title: "Kabira", file: "assets/image/audio/Kabira.mp3" },
    { title: "Main Tera Ho Gaya", file: "assets/image/audio/Main tera ho gaya.mp3" },
    { title: "Mann Ki Lagan", file: "assets/image/audio/Mann Ki Lagan.mp3" },
    { title: "Paheli", file: "assets/image/audio/Paheli.mp3" },
    { title: "Phir Le Aya Dil", file: "assets/image/audio/Phir Le Aya Dil.mp3" },
    { title: "Safarnama", file: "assets/image/audio/Safarnama.mp3" },
    { title: "Sajni", file: "assets/image/audio/sajni.mp3" },
    { title: "Zaalima", file: "assets/image/audio/Zaalima.mp3" },
    { title: "Haareya", file: "assets/image/audio/Haareya.mp3" },
    { title: "Hona Tha Pyar", file: "assets/image/audio/Hona Tha Pyar.mp3" },
    { title: "Is This Love", file: "assets/image/audio/Is This Love.mp3" },
    { title: "Kyon", file: "assets/image/audio/Kyon.mp3" },
    { title: "Pehli Baar", file: "assets/image/audio/Pehli Baar.mp3" },
    { title: "Tu Chahiye", file: "assets/image/audio/Tu Chahiye.mp3" },
    { title: "Zaroor", file: "assets/image/audio/Zaroor.mp3" }
];
let currentTrackIndex = 0;
let previousVolume = 0.75;

function initialize() {
    if (!audio || !playButton || !player) {
        return;
    }

    audio.volume = Number(volume?.value || 0.75);
    previousVolume = audio.volume;

    loadTrack(currentTrackIndex);
    bindEvents();
    updatePlayerState();
}

function bindEvents() {
    playButton.addEventListener("click", togglePlayback);

    previousButton?.addEventListener(
        "click",
        playPreviousTrack
    );

    nextButton?.addEventListener(
        "click",
        playNextTrack
    );

    rewindButton?.addEventListener(
        "click",
        () => seekRelative(-10)
    );

    forwardButton?.addEventListener(
        "click",
        () => seekRelative(10)
    );

    progress?.addEventListener(
        "click",
        handleProgressClick
    );

    progress?.addEventListener(
        "keydown",
        handleProgressKeyboard
    );

    volume?.addEventListener(
        "input",
        handleVolumeChange
    );

    muteButton?.addEventListener(
        "click",
        toggleMute
    );

    audio.addEventListener(
        "loadedmetadata",
        updateDuration
    );

    audio.addEventListener(
        "timeupdate",
        updateProgress
    );

    audio.addEventListener(
        "play",
        updatePlayerState
    );

    audio.addEventListener(
        "pause",
        updatePlayerState
    );

    audio.addEventListener(
        "ended",
        playNextTrack
    );

    audio.addEventListener(
        "error",
        handleAudioError
    );

    document.addEventListener(
        "keydown",
        handleKeyboardShortcuts
    );
}

function loadTrack(index) {
    if (!tracks.length) {
        return;
    }

    currentTrackIndex = normalizeTrackIndex(index);

    const track = tracks[currentTrackIndex];

    audio.pause();
    audio.src = track.file;
    audio.load();

    titleElement.textContent = track.title;

    currentTimeElement.textContent = "0:00";
    durationElement.textContent = "0:00";

    progressFill.style.width = "0%";

    progress?.setAttribute(
        "aria-valuenow",
        "0"
    );

    updatePlayerState();
}

async function togglePlayback() {
    if (!audio.src) {
        return;
    }

    if (audio.paused) {
        await playAudio();
        return;
    }

    audio.pause();
}

async function playAudio() {
    try {
        await audio.play();
    } catch (error) {
        console.error(
            "Noxo FM audio could not play:",
            error
        );
    }
}

function playNextTrack() {
    if (!tracks.length) {
        return;
    }

    const nextIndex =
        currentTrackIndex + 1;

    loadTrack(nextIndex);
    playAudio();
}

function playPreviousTrack() {
    if (!tracks.length) {
        return;
    }

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    const previousIndex =
        currentTrackIndex - 1;

    loadTrack(previousIndex);
    playAudio();
}

function seekRelative(seconds) {
    if (!Number.isFinite(audio.duration)) {
        return;
    }

    audio.currentTime = Math.min(
        Math.max(audio.currentTime + seconds, 0),
        audio.duration
    );
}

function handleProgressClick(event) {
    if (!Number.isFinite(audio.duration)) {
        return;
    }

    const rectangle =
        progress.getBoundingClientRect();

    const position =
        event.clientX - rectangle.left;

    const percentage =
        Math.min(
            Math.max(
                position / rectangle.width,
                0
            ),
            1
        );

    audio.currentTime =
        percentage * audio.duration;
}

function handleProgressKeyboard(event) {
    if (!Number.isFinite(audio.duration)) {
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        seekRelative(5);
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        seekRelative(-5);
    }

    if (event.key === "Home") {
        event.preventDefault();
        audio.currentTime = 0;
    }

    if (event.key === "End") {
        event.preventDefault();
        audio.currentTime = audio.duration;
    }
}

function handleVolumeChange() {
    const newVolume =
        Number(volume.value);

    audio.volume = newVolume;

    if (newVolume > 0) {
        previousVolume = newVolume;
        audio.muted = false;
    }

    updateVolumeIcon();
}

function toggleMute() {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;

        const restoredVolume =
            previousVolume || 0.75;

        audio.volume = restoredVolume;
        volume.value = String(restoredVolume);

        updateVolumeIcon();
        return;
    }

    previousVolume =
        audio.volume || 0.75;

    audio.muted = true;

    updateVolumeIcon();
}

// js/app.js

function updateProgress() {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
    }

    const percentage = Math.min(
        Math.max((audio.currentTime / audio.duration) * 100, 0),
        100
    );

    if (progressFill) {
        progressFill.style.setProperty(
            "--progress-width",
            `${percentage}%`,
            "important"
        );
    }

    progress?.setAttribute(
        "aria-valuenow",
        String(Math.round(percentage))
    );

    if (currentTimeElement) {
        currentTimeElement.textContent = formatTime(audio.currentTime);
    }
}

function updateDuration() {
    if (!Number.isFinite(audio.duration)) {
        durationElement.textContent = "0:00";
        return;
    }

    durationElement.textContent =
        formatTime(audio.duration);

    progress?.setAttribute(
        "aria-valuemax",
        "100"
    );
}

function updatePlayerState() {
    const isPlaying =
        !audio.paused && !audio.ended;

    playIcon.innerHTML =
        isPlaying
            ? PAUSE_ICON
            : PLAY_ICON;

    playButton.setAttribute(
        "aria-label",
        isPlaying
            ? "Pause Noxo After Dark"
            : "Play Noxo After Dark"
    );

    playButton.setAttribute(
        "title",
        isPlaying ? "Pause" : "Play"
    );

    player.classList.toggle(
        "playing",
        isPlaying
    );

    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (!volumeIcon) {
        return;
    }

    const muted =
        audio.muted ||
        audio.volume === 0;

    volumeIcon.innerHTML =
        muted
            ? MUTED_ICON
            : VOLUME_ICON;

    muteButton?.setAttribute(
        "aria-label",
        muted ? "Unmute" : "Mute"
    );
}

function handleAudioError() {
    updatePlayerState();

    currentTimeElement.textContent = "0:00";
    durationElement.textContent = "0:00";

    progressFill.style.width = "0%";

    console.warn(
        "Audio file could not be loaded:",
        tracks[currentTrackIndex]?.file
    );
}

function handleKeyboardShortcuts(event) {
    const activeElement =
        document.activeElement;

    const isTyping =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

    if (isTyping) {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
    }

    if (event.code === "ArrowRight") {
        seekRelative(10);
    }

    if (event.code === "ArrowLeft") {
        seekRelative(-10);
    }

    if (event.code === "ArrowUp") {
        event.preventDefault();
        changeVolume(0.05);
    }

    if (event.code === "ArrowDown") {
        event.preventDefault();
        changeVolume(-0.05);
    }

    if (event.key.toLowerCase() === "m") {
        toggleMute();
    }
}

function changeVolume(amount) {
    const newVolume =
        Math.min(
            Math.max(
                audio.volume + amount,
                0
            ),
            1
        );

    audio.muted = false;
    audio.volume = newVolume;

    volume.value =
        String(newVolume);

    if (newVolume > 0) {
        previousVolume = newVolume;
    }

    updateVolumeIcon();
}

function normalizeTrackIndex(index) {
    if (!tracks.length) {
        return 0;
    }

    return (
        (index % tracks.length) +
        tracks.length
    ) % tracks.length;
}

function formatTime(seconds) {
    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        return "0:00";
    }

    const totalSeconds =
        Math.floor(seconds);

    const minutes =
        Math.floor(totalSeconds / 60);

    const remainingSeconds =
        totalSeconds % 60;

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}

initialize();