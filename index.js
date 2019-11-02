class Select {
  constructor (settings) {
    this.selector = settings.selector;
    this.label = settings.label;
    this.url = settings.url;
    this.create();
  }

  create = () => {
    this.select = document.querySelector(this.selector);
    let label = document.createElement('label');
    let span = document.createElement('span');
    let dropdown = document.createElement('ul');
    dropdown.classList.add('loading');

    label.textContent = this.label;
    label.append(span);
    this.select.append(label);
    this.select.append(dropdown);

    this.select.addEventListener('click', (e) => {
      if (e.target === label || e.target === span) {
        this.opened ? this.close() : this.open();
      } else {
        this.close();
      }
    });
  }

  loadData = () => {
    fetch(this.url).then(response => {
      if (response.ok) {
        return(response.json());
      } else {
        const e = new Error('Ошибка загрузки данных');
        e.data = response;
        throw e;
      }
    }).then(data => this.render(data));
    this.dataLoaded = true;
  }

  update = () => {
    let label = this.select.querySelector('label');
    let span = label.querySelector('span');

    label.classList = this.opened ? (this.selected ? 'opened value-selected' : 'opened') : (this.selected ? 'value-selected' : '');

    span.textContent = this.selected ? this.selected : '';

    let options = this.select.querySelectorAll('li');

    options.forEach((option) => {
        option.classList = option.textContent === this.selected ? 'selected' : '';
    });
  }

  render = (data) => {
    let map = new Map(Object.entries(data));
    let dropdown = this.select.querySelector('ul');
    dropdown.classList.remove('loading');

    for (let value of map.values()) {
      let option = document.createElement('li');
      option.textContent = value.label;
      option.addEventListener('click', () => {
        this.selected = value.label;
        this.update();
      });

      dropdown.append(option);
    }
  }

  open = () => {
    this.dataLoaded ? null : this.loadData();
    this.opened = true;
    this.update();
  }

  close = () => {
    this.opened = false;
    this.update();
  }

  clear = () => {
    this.selected = '';
    this.update();
  }

  destroy = () => {
    this.select.innerHTML = '';
  }

  getSelected = () => {
    return `Выбранный элемент ${this.selected}`;
  }
}

const select = new Select({
  selector: '#select',
  label: 'Выберите технологию',
  url: 'https://vladilen-dev.firebaseio.com/technologies.json',
  onSelect(selectedItem) {}
})

const openSelect = document.querySelector('button[data-type=\"open\"]');
const closeSelect = document.querySelector('button[data-type=\"close\"]');
const selectFiveIndex = document.querySelector('button[data-type=\"set\"]');
const getSelected = document.querySelector('button[data-type=\"get\"]');
const clearSelect = document.querySelector('button[data-type=\"clear\"]');
const destroySelect = document.querySelector('button[data-type=\"destroy\"]');

openSelect.addEventListener('click', function () {
  select.open();
});

closeSelect.addEventListener('click', function () {
  select.close();
});

clearSelect.addEventListener('click', function () {
  select.clear();
});

destroySelect.addEventListener('click', function () {
  select.destroy();
});

getSelected.addEventListener('click', function () {
  let log = document.getElementById('log');
  log.textContent = select.getSelected();
});