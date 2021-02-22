'use strict';

const audioBackground = new Audio('./sound/curious_kiddo.mp3');
const audioLose = new Audio('./sound/game_lose.mp3');
const audioWin = new Audio('./sound/game_win.mp3');
const audioCarrot = new Audio('./sound/carrot_pull.mp3');
const audioBug = new Audio('./sound/bug_pull.mp3');
const audioClock = new Audio('./sound/clock.wav');
const audioFireworks = new Audio('./sound/fireworks.mp3');


const swooshSound = new Audio('./sound/swoosh.mp3');
const blobSound = new Audio('./sound/blop.mp3');
const recordSound = new Audio('./sound/page_flip.mp3');

export function playSwooshSound() {
  playSound(swooshSound);
}

export function playBlobSound() {
  playSound(blobSound);
}

export function playBgFromTheStart() {
  audioBackground.currentTime = 0;
  playSound(audioBackground);
}

export function playBgSound() {
  playSound(audioBackground);
}

export function playLoseSound() {
  playSound(audioLose);
}

export function playWinSound() {
  playSound(audioWin);
}

export function playCarrotSound() {
  playSound(audioCarrot);
}

export function playBugSound() {
  playSound(audioBug);
}

export function stopBgSound() {
  stopSound(audioBackground);
}

export function playClockSound() {
  playSound(audioClock);
}

export function stopClockSound() {
  stopSound(audioClock);
}

export function playRecordSound() {
  playSound(recordSound);
}

export function playfireworksSound() {
  playSound(audioFireworks);
}

function playSound(sound) {
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
