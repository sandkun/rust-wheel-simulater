const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorMap = {
  1: '#fdd835',
  3: '#81c784',
  5: '#2196f3',
  10: '#f48fb1',
  20: '#ff5722',
};
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 3;

class Roulette {
  dataset = [1, 3, 1, 20, 1, 3, 1, 5, 1, 3, 1, 10, 1, 3, 1, 5, 1, 5, 3, 1, 10, 1, 3, 1, 5];
  sectorAngle = 0;
  result = 0;

  // 애니메이션 변수
  angularVelocity = 0.5; // 초기 각속도
  friction = 0.98; // 감속을 위한 계수
  spinning = false; // 룰렛이 돌아가는지 여부
  angle = 1.5 * Math.PI; // 룰렛의 시작 각도

  constructor() {
    this.drawRoulette = this.drawRoulette.bind(this);
    this.sectorAngle = (2 * Math.PI) / this.dataset.length;
    this.drawRoulette();
  }

  drawArrow() {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.moveTo(centerX - 10, canvas.height / 5 - 30);
    ctx.lineTo(centerX + 10, canvas.height / 5 - 30);
    ctx.lineTo(centerX, canvas.height / 5);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  drawRoulette() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.dataset.length; i++) {
      const data = this.dataset[i];

      // 호 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, this.angle, this.angle + this.sectorAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = colorMap[String(data)];
      ctx.fill();
      ctx.stroke();
      ctx.closePath();

      // 각 섹션의 중앙각
      const sectorMidAngle = this.angle + this.sectorAngle / 2;

      // 텍스트 회전 각도 (부채꼴의 중앙각 + 90도)
      const rotationAngle = sectorMidAngle + Math.PI / 2;

      // 텍스트 그리기
      ctx.save();
      const textX = centerX + (radius - 15) * Math.cos(sectorMidAngle);
      const textY = centerY + (radius - 15) * Math.sin(sectorMidAngle);
      ctx.translate(textX, textY);
      ctx.rotate(rotationAngle);
      ctx.fillStyle = 'black';
      ctx.font = '13px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data, 0, 0);
      ctx.restore();

      // 결과값 계산 (12시 각도의 항목 체크)
      const target = 1.5 * Math.PI;
      const currentAngle = this.angle % (Math.PI * 2);
      if (currentAngle < target && currentAngle + this.sectorAngle > target) {
        this.result = data;
      }

      this.angle += this.sectorAngle;
    }

    this.drawArrow();

    if (this.spinning && this.angularVelocity > 0.001) {
      // 각속도 감소
      this.angularVelocity *= this.friction;
      this.angle += this.angularVelocity;

      // 프레임 갱신
      requestAnimationFrame(this.drawRoulette);
    } else {
      this.spinning = false;
    }
  }

  spin() {
    const minValue = 4;
    const maxValue = 8;
    const randomValue = minValue + Math.random() * (maxValue - minValue);
    this.spinning = true;
    this.angularVelocity = randomValue;
    this.drawRoulette();
  }
}
