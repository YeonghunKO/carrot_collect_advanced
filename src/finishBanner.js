import { game } from './main.js';

export default class Banner {
  constructor() {
    this.finishBanner = document.querySelector('.popup');
    this.gameResult = this.finishBanner.querySelector('span');
    this.replayBtn = document.querySelector('.replay');
    this.nextStageBtn = document.querySelector('.next_stage');

    this.replayBtn.addEventListener('click', () => {
      this.OnReplayClick && this.OnReplayClick();
      this.hide();
    });
    this.nextStageBtn.addEventListener('click', () => {
      game.levelUp();
      this.onNextBtnClick && this.onNextBtnClick();
      this.hide();
    });
  }

  setOnReplayClick(func) {
    this.OnReplayClick = func;
  }

  setOnNextStageClick(func) {
    this.onNextBtnClick = func;
  }

  hide() {
    this.finishBanner.classList.add('non_display');
  }

  show(result) {
    this.finishBanner.classList.remove('non_display');
    let message;
    switch (result) {
      case 'win':
        message = 'you won!  replay?🎉';
        break;
      case 'lose':
        message = 'You clicked the bug😝 wanna play again?';
        break;
      case 'timeout':
        message = `Time out..😅 Wanna play again?`;
        break;
      case 'restart':
        message = `Restart?`;
        break;
      case 'finally':
        message = 'Completed all stages🎉 going back to stage 1?';
        break;
      default:
        throw new Error('unvalid mesage');
    }
    this.gameResult.innerHTML = message;
  }

  hideNextStageBtn() {
    this.nextStageBtn.classList.add('non_display');
  }

  showNextStageBtn() {
    this.nextStageBtn.classList.remove('non_display');
  }
}
