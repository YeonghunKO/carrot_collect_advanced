import * as sound from './sound.js';

const CARROT_SIZE = 60;

export default class Field {
  constructor() {
    // this.IconCount = IconCount;
    this.playField = document.querySelector('.play_field');
    this.carrotCount = this.playField.getElementsByClassName('carrot');
  }

  setIconClickEvent(func) {
    this.onClick = func;
    // this.onClick && this.onClick.bind(this);
  }

  onIconButton = event => {
    const whichIcon = event.target;
    if (whichIcon.matches('.carrot')) {
      whichIcon.remove();
      this.onClick && this.onClick('carrot');
      sound.playCarrotSound();
    }
    if (whichIcon.matches('.bug')) {
      this.onClick && this.onClick('bug');
      sound.playBugSound();
    }
  };

  _creatIcon(iconName, iconPath) {
    // private 한 함수는 underscore를 붙여줌. typescript에선 private이라고 지정하는 기능이 있는데 바닐라 JS는 아직 없다ㅠ
    iconName.src = `./img/${iconPath}.png`;
    iconName.classList.add(`${iconPath}`);
    const playCoor = this.playField.getBoundingClientRect();
    const x = 0;
    const y = 0;
    const x1 = playCoor.width;
    const y1 = playCoor.height;
    // CARROT_SIZE 를 빼는 이유는?
    // icon이 출력되는 범위를 화면에 꽉 채우게 될때, 만약 좌표가 화면 끝에 위치하게 된다고 했을때, 당근 왼쪽 끝부분이 그 좌표에 맞춰지게 된다.
    // 따라서 화면 밖으로 벗어나게 됨. 그래서 화면 안에서 출력되게 하려면 애초에 화면의 가로, 세로 길이가 당근의 가로 세로만큼 줄어들어야 당근이 삐져나오지 않게 됨
    var translateX = getRandomCoor(x, x1 - CARROT_SIZE);
    var translateY = getRandomCoor(y, y1 - CARROT_SIZE);

    iconName.style.transform = `translate(${translateX}px,${translateY}px)`;
    return iconName;
  }

  createCarrotIcon() {
    const imgCarrot = new Image();
    const carrotIcon = this._creatIcon(imgCarrot, 'carrot');
    this.playField.append(carrotIcon);
  }

  createBugIcon() {
    const imgBug = new Image();
    const bugIcon = this._creatIcon(imgBug, 'bug');
    this.playField.append(bugIcon);
  }

  displayAllIcon(count) {
    // 콜백으로 넘겨줄때 this 바인딩함! callback function binded with this.
    // 이거때문에 좀 헤맴 ㅋ 버그있을때는 똑같은 stage에 머무르지말고 알고리즘내에서 버그가 발생했다고 생각하는 지점에서
    // 차근차근 한단계씩 거슬러올라가보길
    this.playField.addEventListener('click', this.onIconButton);
    this.playField.innerHTML = '';
    var i = 0;
    for (i = 0; i < count; i++) {
      this.createCarrotIcon();
      this.createBugIcon();
    }
  }
}

function getRandomCoor(min, max) {
  return Math.random() * (max - min) + min;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 참고
}
