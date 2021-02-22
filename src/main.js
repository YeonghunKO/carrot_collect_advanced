'use strict';
import { GameBuilder, FinishReason, StopReason } from './gameControl.js';
import Banner from './finishBanner.js';
import * as sound from './sound.js';

const finishBanner = new Banner();

export let game = new GameBuilder() //
  .iconCount(3)
  .gameDuration(10)
  .build();

game.onFinishBannerEvent(reason => {
  finishBanner.hideNextStageBtn();
  switch (reason) {
    case FinishReason.win:
      finishBanner.show('win');
      finishBanner.showNextStageBtn();
      break;
    case FinishReason.bug:
      finishBanner.show('lose');
      break;
    case FinishReason.timeout:
      finishBanner.show('timeout');
      sound.playLoseSound();
      break;
    case FinishReason.finalStageWin:
      finishBanner.show('finally');
      sound.playWinSound();
      break;
    case StopReason.start:
      finishBanner.hide();
      break;
    case StopReason.pause:
      finishBanner.show('restart');
      break;
    default:
      throw new Error('unvalid reason');
  }
});

finishBanner.setOnNextStageClick(game.startFromTheVeryFirst);

finishBanner.setOnReplayClick(game.startFromTheVeryFirst);
