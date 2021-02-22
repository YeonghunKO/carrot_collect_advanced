'use strict';
import * as sound from './sound.js';
import Field from './playField.js';
import { RecordToggle } from './recordToggle.js';

export const FinishReason = Object.freeze({
  win: 'win',
  bug: 'bug',
  timeout: 'timeout',
  finalStageWin: 'finally',
});

export const StopReason = Object.freeze({
  start: 'start',
  pause: 'pause',
});

export class GameBuilder {
  iconCount(count) {
    this.count = count;
    return this;
  }
  gameDuration(duration) {
    this.duration = duration;
    return this;
  }

  build() {
    return new Game(this.count, this.duration);
  }
}

class Game {
  constructor(iconCount, gameDuration) {
    this.iconCount = iconCount;
    this.gameDuration = gameDuration;
    this.gameDurationRefresh = gameDuration;

    this.level = 1;

    this.playBtn = document.querySelector('.play_button');
    this.countSpan = document.querySelector('.count');
    this.stage = document.querySelector('.stage');
    this.clock = document.querySelector('.clock');
    this.timeDisplay = document.querySelector('.time_display');

    this.intervalId;
    this.veryFirstStart = true;

    this.field = new Field();
    this.field.setIconClickEvent(this.fieldIconClick);

    this.recordToggle = new RecordToggle();
    this.recordToggle.setGameDuration(this.gameDuration);

    this.playBtn.addEventListener('click', event => {
      if (this.veryFirstStart) {
        this.startFromTheVeryFirst();
      } else if (!this.veryFirstStart) {
        if (this.pressedBtn(event) === 'fa-play') {
          this.pauseToStart(StopReason.start);
        } else if (this.pressedBtn(event) === 'fa-pause') {
          this.startToPause(StopReason.pause);
        }
      }
    });
  }

  init(level) {
    if (level === 1) {
      this.field.displayAllIcon(this.iconCount);
    }
    if (level === 2) {
      this.field.displayAllIcon(this.iconCount + 2);
    }
    if (level === 3) {
      this.field.displayAllIcon(this.iconCount + 4);
    }
    if (level === 4) {
      this.field.displayAllIcon(this.iconCount + 6);
    }
  }

  // 여기도 바인딩? yep
  startFromTheVeryFirst = () => {
    // 와..... 이거이거 오래걸렸다.refresh랑 pausetostart랑 시간타이머가 겹쳐서 계속 오류났는데 이렇게 해결했다.
    // 사실 기존에 time을 새로 설정했었는데 그걸 잘 생각했다면 이건 금방 생각해냈을텐데.
    // 새로운 신박한걸 생각하지 말고 기존에 있는것을 토대로 어떻게 다시 재구성할지 생각하자.
    this.veryFirstStart = false;
    this.gameDuration = this.gameDurationRefresh;
    this.startTimer();
    this.showPlayBtn();
    this.gameBtnChange('pause');
    sound.playBgFromTheStart();
    this.init(this.level);
    this.countCarrotFunc();
    this.updateStage(this.level);
  };

  startToPause(reason) {
    this.gameBtnChange('play');
    sound.stopBgSound();
    this.stopGameTimer();
    this.onFinishBanner && this.onFinishBanner(reason);
  }

  pauseToStart(reason) {
    this.gameBtnChange('pause');
    sound.playBgSound();
    this.startTimer();
    //pause에서 start로 넘어갈때는 duration을 초기화하면 안됨
    this.onFinishBanner && this.onFinishBanner(reason);
  }

  finish(reason) {
    this.hidePlayBtn();
    this.stopGameTimer();
    sound.stopBgSound();
    this.onFinishBanner && this.onFinishBanner(reason);
  }

  levelUp() {
    ++this.level;
  }

  levelInitalized() {
    this.level = 1;
  }

  onFinishBannerEvent(func) {
    this.onFinishBanner = func;
  }

  // 여기도 바인딩? yep
  fieldIconClick = icon => {
    if (icon === 'carrot') {
      this.countCarrotFunc();
    } else if (icon === 'bug') {
      this.finish(FinishReason.bug);
      //여기서도 '왜 배경음악중지가 없는데 배경음악이 중지될까?' 라는 의문이 들면 이전 알고리즘으로 차근차근 올라가보자
    }
  };

  // setInterval 함수에 const를 추가하면 매번 실행할떄마다 const를 만들어야하므로 프레임이 상당히 저하되었음
  // 따라서 전역변수를 만들고 그걸 업데이트하는 방식을 사용해야
  // 또한 --연산자를 따로 빼지않고 아예 update함수에 pass함
  // 프레임 대폭 향상됨

  updateTimer(count) {
    // let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    this.timeDisplay.textContent = `00:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }

  startTimer() {
    this.updateTimer(this.gameDuration);
    this.intervalId = setInterval(() => {
      if (this.gameDuration <= 0) {
        this.finish(FinishReason.timeout);
        return;
      } else {
        this.updateTimer(--this.gameDuration);
        this.clockRing(this.gameDuration);
      }
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.intervalId);
    this.stopClockRing();
  }

  clockRing(time) {
    if (time < 5) {
      sound.playClockSound();
      this.clock.setAttribute('src', './img/clock-ring.png');
      this.clock.setAttribute('class', 'clock ring-fast');
    } else {
      this.clock.className = 'clock ring';
    }
  }

  stopClockRing() {
    sound.stopClockSound();
    this.clock.setAttribute('class', 'clock');
    this.clock.setAttribute('src', './img/clock.png');
  }

  countCarrotFunc() {
    const carrotCount = this.field.carrotCount.length;
    if (carrotCount < 1) {
      if (this.level === 4) {
        this.finish(FinishReason.finalStageWin);
        this.levelInitalized();
        // this.recordToggle.aggregateRecord();
        // update에서 aggregateRecord() 선언할때 이미 실행되므로 여기서 굳이 실행할 필요없음
        this.recordToggle.updateRecord();
      } else {
        this.finish(FinishReason.win);
        this.countSpan.innerHTML = carrotCount;
        // 여기서 레벨업을 하면 한 stage를 다 끝내고 나서 다시 하기 버튼을 클릭했을때 다음레벨로 넘어가게 됨
        // this.levelUp();
        this.recordToggle.aggregateRecord();
      }
    } else {
      this.countSpan.innerHTML = carrotCount;
    }
  }

  gameBtnChange(btn) {
    let button;
    switch (btn) {
      case 'play':
        button = `<i class="fas fa-play"></i>`;
        break;
      case 'pause':
        button = `<i class="fas fa-pause"></i>`;
        break;
      default:
        throw new Error('unvalid button');
    }
    this.playBtn.innerHTML = button;
  }

  showPlayBtn() {
    this.playBtn.style.visibility = 'visible';
  }

  hidePlayBtn() {
    this.playBtn.style.visibility = 'hidden';
  }

  pressedBtn(event) {
    const whichBtn = event.target.classList[1];
    return whichBtn;
  }

  updateStage(stageNum) {
    this.stage.innerHTML = `Stage ${stageNum}`;
  }
}
