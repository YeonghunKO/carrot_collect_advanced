const max_fireworks = 10,
  max_sparks = 10;
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

var fireworkId;
let num = 0;

context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight - 5;

let fireworks = [];

function makeFireworks() {
  num = 0;

  for (let i = 0; i < max_fireworks; i++) {
    let firework = {
      sparks: [],
    };
    for (let n = 0; n < max_sparks; n++) {
      let spark = {
        vx: Math.random() * 5 + 0.5,
        vy: Math.random() * 5 + 0.5,
        weight: Math.random() * 0.3 + 0.03,
        red: Math.floor(Math.random() * 199),
        green: Math.floor(Math.random() * 199),
        blue: Math.floor(Math.random() * 199),
      };
      if (Math.random() > 0.5) spark.vx = -spark.vx;
      if (Math.random() > 0.5) spark.vy = -spark.vy;
      firework.sparks.push(spark);
    }
    fireworks.push(firework);
    resetFirework(firework);
  }
}

function resetFirework(firework) {
  firework.x = Math.floor(Math.random() * canvas.width);
  firework.y = canvas.height;
  firework.age = 0;
  firework.phase = 'fly';
}

function explode() {
  num++;
  context.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((firework, index) => {
    if (firework.phase == 'explode') {
      firework.sparks.forEach(spark => {
        for (let i = 0; i < 10; i++) {
          let trailAge = firework.age + i;
          let x = firework.x + spark.vx * trailAge;
          let y =
            firework.y +
            spark.vy * trailAge +
            spark.weight * trailAge * spark.weight * trailAge;
          let r = Math.floor(spark.red * 2);
          let g = Math.floor(spark.green * 2);
          let b = Math.floor(spark.blue * 2);

          context.beginPath();
          context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',1)';
          context.rect(x, y, 4, 4);
          context.fill();
        }
      });
      firework.age++;
      if (firework.age > 100 && Math.random() < 0.05) {
        resetFirework(firework);
      }
    } else {
      firework.y = firework.y - 10;
      for (let spark = 0; spark < 15; spark++) {
        context.beginPath();
        context.fillStyle = 'rgba(' + index * 50 + ',' + spark * 17 + ',0,1)';
        context.rect(
          firework.x + Math.random() * spark - spark / 2,
          firework.y + spark * 4,
          4,
          4
        );
        context.fill();
      }
      if (Math.random() < 0.001 || firework.y < 200) firework.phase = 'explode';
    }
  });

  fireworkId = window.requestAnimationFrame(explode);
  switch (num) {
    case 100:
      fireworks.length = 8;
      break;
    case 250:
      fireworks.length = 5;
      break;
    case 300:
      fireworks.length = 3;
      break;
    case 350:
      fireworks.length = 1;
      break;
    case 400:
      fireworks.length = 0;
      break;
  }

  //어느정도 시간지나면 '서서히' 없어지게끔 해봐라. 그리고 다시 시작했을때 원상복구하고
}

export default function startFireworks() {
  canvas.style.zIndex = 2;
  makeFireworks();
  fireworkId = window.requestAnimationFrame(explode);
  setTimeout(stop, 7000);
  console.log('startfire');
}

function stop() {
  window.cancelAnimationFrame(fireworkId);
  canvas.style.zIndex = -3;
}


//결국에 관건은 explode안에 있는 request에 id를 할당했어야 했다
// startfireworks에만 fireworkid를 부여하면 cancel했을때 startfirework 애니메이션만 멈추고 explode애니메이션은 여전히 돌아가니깐 폭죽이 계속 터졌던것
// 공식문서를 잘 확인하자 어느위치에 id가 할당되는지
