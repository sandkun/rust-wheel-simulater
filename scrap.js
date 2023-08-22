class Scrap {
  id = null;
  count = 0;
  parent = null;
  item = null;
  isDragging = false;
  isSplit = false;
  isKeydownShift = false;

  constructor(id, count, parent) {
    this.id = id;
    this.count = count;

    const item = this.createScrapItem();
    this.item = item;

    this.setParent(parent);
  }

  createScrapItem() {
    const item = document.createElement('div');
    item.classList.add('scrap-item');
    item.draggable = true;

    const scrapImg = document.createElement('img');
    scrapImg.src = `./scrap.webp`;
    scrapImg.draggable = false;

    const scrapCount = document.createElement('span');
    scrapCount.innerText = this.count;

    item.appendChild(scrapImg);
    item.appendChild(scrapCount);

    item.addEventListener('dragstart', (e) => this.handleDragStart(e, item));
    window.addEventListener('dragend', (e) => this.handleDragEnd(e, item));
    window.addEventListener('keydown', (e) => {
      e.key === 'Shift' && (this.isKeydownShift = true);
    });
    window.addEventListener('keyup', (e) => {
      e.key === 'Shift' && (this.isKeydownShift = false);
    });

    return item;
  }

  handleDragStart(e, item) {
    this.isDragging = true;
    item.style.cursor = 'grabbing';

    if (this.isKeydownShift) {
      this.isSplit = true;
    }
  }

  handleDragEnd(e, item) {
    item.style.cursor = 'grab';
  }

  setParent(parent) {
    if (this.parent !== null) {
      this.parent.removeChild(this.item);
    }
    this.parent = parent;
    parent.appendChild(this.item);
  }

  remove() {
    this.item.remove();
  }
}
