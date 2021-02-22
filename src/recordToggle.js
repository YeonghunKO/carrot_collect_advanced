'use strict';

import * as sound from './sound.js';
import { startFireworks, stopFireworks } from './fireworks.js';

export class RecordToggle {
  constructor() {
    this.recordToggle = document.querySelectorAll('.record_toggle');
    this.recordContent = document.querySelector('.record_content');
    this.recordRankingDisplay = document.querySelector('.record_ranking');
    this.firstRankingSpan = this.recordRankingDisplay.querySelector('.first');
    this.fromSecondSpan = this.recordRankingDisplay.querySelector(
      '.from_second'
    );

    this.timeDisplay = document.querySelector('.time_display');

    this.RECORD_LS = 'currentRecord';
    this.recordList;
    this.recordBoxtoAgg = [];

    this.recordToggle.forEach(btn =>
      btn.addEventListener('click', this.recordFunc)
    );

    this._restoreRecordStorage();
    this._loadRecord();
  }

  recordFunc = event => {
    const btnClass = event.target.classList;
    if (btnClass.contains('record_open_toggle')) {
      sound.playRecordSound();
      this.recordContent.classList.toggle('non_display');
    } else {
      sound.playBlobSound();
      this.recordContent.classList.toggle('non_display');
    }
  };

  updateRecord() {
    this.timeRecord = this.aggregateRecord();
    this._compareRecord(this.timeRecord);
    this._firstRankingDetector(this.timeRecord);
    this._paintRecord(this.recordList);
    this._saveRecord();
    this.recordBoxtoAgg = [];
  }
  // 요런식으로 만들 함수를 미리 적음으로써 가이드라인을 형성한다

  _getTime() {
    return this.timeDisplay.innerHTML;
  }

  _compareRecord(recordTime) {
    for (var i = 0; i < this.recordList.length; i++) {
      if (recordTime === this.recordList[i] || recordTime === NaN) {
        return;
      }
    }

    this.recordList.push(recordTime);
    // compare function passed to sort the array in ascending order
    this.recordList.sort((a, b) => a - b);
    if (this.recordList.length > 3) {
      // remove the last element of the array
      this.recordList.pop();
    }
  }

  _paintRecord(recordList) {
    this.fromSecondSpan.innerHTML = '';
    recordList.forEach((record, index) => {
      const span = document.createElement('span');
      if (record === null) {
        return;
      }
      switch (index) {
        case 0:
          this.firstRankingSpan.innerHTML = `1st: ${record} sec`;
          break;
        case 1:
          span.innerHTML = `2nd: ${record} sec`;
          break;
        case 2:
          span.innerHTML = `3rd: ${record} sec`;
          break;
        default:
          throw Error('not valid index');
      }
      this.fromSecondSpan.appendChild(span);
    });
  }

  _firstRankingDetector(record) {
    let firstRankingNumberOnly = this.firstRankingSpan.innerHTML.substring(
      5,
      7
    );
    let difference = record - firstRankingNumberOnly;
    if (this.firstRankingSpan.innerHTML === '') {
      console.log('first record!');
      startFireworks();
      stopFireworks();
      sound.playfireworksSound();
    } else if (difference > 0) {
      console.log('not that special');
    } else if (difference === 0) {
      console.log('same record');
    } else if (difference < 0) {
      console.log('new record');
      startFireworks();
      stopFireworks();
      sound.playfireworksSound();
    }
  }

  _saveRecord() {
    localStorage.setItem(this.RECORD_LS, JSON.stringify(this.recordList));
  }

  _loadRecord() {
    this._paintRecord(this.recordList);
  }

  _restoreRecordStorage() {
    this.recordList = JSON.parse(localStorage.getItem(this.RECORD_LS)) || [];
  }

  aggregateRecord() {
    this.timeRecord = this._getTime();
    const modifiedCurrentValue = this.gameDuration - this.timeRecord.slice(-2);
    this.recordBoxtoAgg.push(modifiedCurrentValue);
    return this.recordBoxtoAgg.reduce((a, b) => {
      return a + b;
    }, 0);
  }

  setGameDuration(duration) {
    this.gameDuration = duration;
  }

  // 사실 위에 paintRecord()-switch 에서 충분히 바뀐걸 알 수 있는데 이 함수를 굳이 사용하는 이유는
  // 새로배운 mutationobserver를 사용하고 싶었다.
  // 하지만 지금같이 기록요소가 시작하자마자 매번 새로 쓰여지는 상황에서는 mutationdetector를 사용하는게 의미가 없다.
  firstSpanChangeDetector() {
    const config = { childList: true };
    const callBack = function (mutationList) {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          console.log('child changed');
        }
      }
    };
    const observer = new MutationObserver(callBack);
    observer.observe(this.firstRankingSpan, config);
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#monitoring_text_content________changes 참고
  startFireworks() {
    this.fireworkSetTimeId = setTimeout(firework, 10);
  }

  clearFireworks() {
    clearTimeout(this.fireworkSetTimeId);
  }

  stopFireworks() {
    setTimeout(this.clearFireworks, 4000);
  }
}

// 기록 갱신하면(first ranking이 바뀌면) 폭죽을 터뜨리자
//https://slicker.me/javascript/fireworks.htm 참고
