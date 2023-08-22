class Game {
  rouletteObj = new Roulette();

  scrapList = [];
  betResult = 0;

  selectedScrap = null;

  constructor() {
    this.spinRoulette = this.spinRoulette.bind(this);

    this.createSpinButton();
    this.dropEventMapping();

    // scrap 생성
    this.scrapList.push(new Scrap(1, 100, document.querySelector('#my')));
  }

  selectScrap(s) {
    this.selectedScrap = s;
  }

  // spin 버튼 생성
  createSpinButton() {
    const spinBtn = document.createElement('button');
    spinBtn.innerText = 'spin';
    spinBtn.addEventListener('click', this.spinRoulette);
    document.querySelector('#main').appendChild(spinBtn);
  }

  // drop 이벤트 매핑
  dropEventMapping() {
    const slotList = document.querySelectorAll('.inventory-slot');

    slotList.forEach((slot) => {
      slot.addEventListener('dragover', (e) => e.preventDefault());

      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const scrap = this.getDragScrapItem();
        if (scrap) {
          scrap.isDragging = false;
          scrap.setParent(slot);
        }
      });
    });
  }

  // drag scrap Item
  getDragScrapItem() {
    const scrap = this.scrapList.find((s) => s.isDragging);
    return scrap;
  }

  // 룰렛 돌리기
  spinRoulette() {
    if (!this.rouletteObj) return;
    this.rouletteObj.spin();

    const interval = setInterval(() => {
      if (!this.rouletteObj.spinning) {
        clearInterval(interval);
        this.checkResult();
      }
    }, 10);
  }

  // 결과 확인
  checkResult() {
    const result = this.rouletteObj.result;
    let resultCount = 0;
    this.scrapList.forEach((scrap) => {
      const id = scrap.parent.getAttribute('id');
      if (id.replace('bet', '') === String(result)) {
        resultCount = scrap.count + scrap.count * result;
      }

      if (id !== 'my' || id !== 'result') {
        scrap.remove();
      }
    });

    if (resultCount > 0) {
      const resultSlot = document.querySelector(`#result`);
      const item = new Scrap(1, resultCount, resultSlot);
      this.scrapList.push(item);
    }
  }
}
