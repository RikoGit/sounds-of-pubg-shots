import {createDlElement} from '../utils.js';

class Level {
  constructor({data, onComplete, maxScore = 5, onAudioPlay}) {
    this.score = 0;
    this.maxScore = maxScore;
    this.data = data;
    this.target = null;
    this.listNode = null;
    this.onComplete = onComplete;
    this.isComplete = false;
    this.onAudioPlay = onAudioPlay;
    this.init();
  }

  init() {
    for (let i = 0; i < this.data.length; i++) {
      const audioElement = new Audio(`./sounds/${this.data[i].audio}`);
      audioElement.controls = true;
      this.data[i].audioElement = audioElement;
      audioElement.onplay = () => {
        document.querySelector(`#tab-${this.data[i].id}`).classList.add('list__button_state_play');
        this.onAudioPlay(audioElement);
      };
      audioElement.onpause = () => {
        document
          .querySelector(`#tab-${this.data[i].id}`)
          .classList.remove('list__button_state_play');
      };
      audioElement.onended = () => {
        document
          .querySelector(`#tab-${this.data[i].id}`)
          .classList.remove('list__button_state_play');
      };
    }
    this.listNode = this.getListNode();
  }

  getTarget() {
    const randomIndex = Math.floor(Math.random() * this.data.length);
    this.target = this.data[randomIndex];

    return this;
  }

  start() {
    this.isComplete = false;
    this.score = this.maxScore;
    this.getTarget();
    if (document.querySelector('.description').querySelector('audio')) {
      document
        .querySelector('.description')
        .querySelector('audio').src = `./sounds/${this.target.audio}`;
    } else {
      const audioElement = new Audio(`./sounds/${this.target.audio}`);
      audioElement.className = 'description__audio';
      audioElement.controls = true;
      audioElement.onplay = () => this.onAudioPlay(audioElement);
      document.querySelector('.description').append(audioElement);
    }
    document.querySelector('.list').replaceWith(this.listNode);
  }

  checkResult(id) {
    if (this.target.id === id) {
      this.complete();

      return true;
    }
    if (this.score !== 0) this.score -= 1;

    return false;
  }

  getLevelState() {
    return this.isComplete ? 'complete' : 'process';
  }

  complete() {
    this.isComplete = true;
    document.querySelector('.description').classList.add('description_active');
    document.querySelector('.description').querySelector('h3').textContent = this.target.name;
    document.querySelector('.description__img').src = `./images/${this.target.image.src}`;
    document.querySelector('.description__button').removeAttribute('disabled');
    this.onComplete(this.score);
  }

  getListNode() {
    const element = document.createElement('article');
    element.className = 'list';
    element.setAttribute('aria-label', 'list of response options');
    const tablistButtons = this.data.reduce((str, {id, name}) => {
      str =
        str +
        `<button id='tab-${id}' role='tab' class='list__button' type='button' data-id='${id}'\
         aria-selected='false' aria-controls='tabpanel-${id}'>${name}</button>`;

      return str;
    }, '');
    const tabpanel = this.data.reduce((str, {id, name, country, year, description, model}) => {
      const text = description.reduce((acc, item) => acc + `<p>${item}</p>`, '');
      str =
        str +
        `<div id="tabpanel-${id}" role='tabpanel' aria-labelledby='tab-${id}' class='tabpanel' hidden>\
        <h4 class='tabpanel__name'>${name}</h4>\
        <img src='./images/${model}' class='tabpanel__img' data-id='${
          id + name
        }' alt='${name}'/>${createDlElement({term: country, definition: year})}${text}</div>`;

      return str;
    }, `<div class='tabpanel tabpanel_type_preview'><p class='tabpanel__default'>Послушайте плеер. Выберите оружие из списка</p></div>`);

    element.innerHTML = `<div role="tablist" class='tablist'>${tablistButtons}</div>${tabpanel}`;
    this.data.forEach(({id, audioElement}) => {
      element.querySelector(`#tabpanel-${id}`).append(audioElement);
    });

    return element;
  }
}

export default Level;
