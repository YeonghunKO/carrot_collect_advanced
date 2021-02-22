import * as sound from './sound.js';

const jsToggle = document.querySelectorAll('.js_toggle');
const toggleContent = document.querySelector('.toggle_content');
const toggleSection = toggleContent.querySelector('.toggle_section');

function toggleFunc(event) {
  const btnClass = event.target.classList;
  //   console.log(btnClass);
  if (btnClass.contains('open_toggle')) {
    sound.playSwooshSound();
    toggleContent.classList.toggle('non_display');
    toggleContent.classList.replace('swirl-out-bck', 'swirl-in-fwd');
    setTimeout(sectionToggle, 400);
  } else {
    sound.playBlobSound();
    toggleContent.classList.toggle('non_display');
    // toggleContent.classList.replace('swirl-in-fwd', 'swirl-out-bck');
    sectionToggle();
  }

  function sectionToggle() {
    toggleSection.classList.toggle('non_display');
    toggleSection.classList.toggle('bounce-in-top');
  }
}

function init() {
  jsToggle.forEach(btn => btn.addEventListener('click', toggleFunc));
}

init();
