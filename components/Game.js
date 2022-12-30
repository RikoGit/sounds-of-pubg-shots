import Gallery from './Gallery.js';
import Level from './Level.js';
import Popup from './Popup.js';

class Game {
  constructor({data}) {
    this.initdata = data;
    this.length = data.length;
    this.data = data;
    this.level = 0;
    this.score = 0;
    this.currentPage = 'preview';
    this.levelNames = [
      'Пистолеты',
      'Дробовики',
      'Пистолеты-пулемёты',
      'Ручной пулемёт',
      'Штурмовые винтовки',
      'Марксманские винтовки',
      'Снайперские винтовки',
      //Гранаты и оружие для рукопашного боя Сковорода, Граната, Коктейль Молотова, Дымовая граната, Оглушающая граната, Лом, Мачете, Сковорода, Серп
    ];
    this.maxLevelScore = 5;
    this.levels = [];
    this.gallery = null;
    this.mainImages = [
      'main1.jpg',
      'main2.jpg',
      'main3.jpg',
      'main4.jpg',
      'main5.jpg',
      'main6.jpg',
    ];
    this.isGameOver = false;
    this.currentAudio = new Audio();
    this.audioErrorElement = null;
    this.audioCorrectElement = null;
    this.init();
  }

  init() {
    this.onDomContentLoadedHandler();
    this.data = this.data.map((x) => x.map((elem) => ({...elem})));
    this.audioErrorElement = new Audio();
    this.audioErrorElement.src = './sounds/error.mp3';
    this.audioCorrectElement = new Audio();
    this.audioCorrectElement.src = './sounds/correct.mp3';
    this.onClickHandler();
    this.printLevelNames();
    this.popup = new Popup({
      parentNode: document.querySelector('.app'),
    });
    this.start();
  }

  switchPage(name = this.currentPage) {
    const navElement = document.querySelector(`.nav__item[data-name = ${name}]`);
    if (this.currentPage === name) return;

    this.currentPage = name;
    this.currentAudio.pause();
    document
      .querySelectorAll(`.nav__item:not([data-name = ${name}])`)
      .forEach((elem) => elem.classList.remove('nav__item_active'));
    navElement.classList.add('nav__item_active');
    document.querySelector('.main:not([hidden])').setAttribute('hidden', true);
    document.querySelector(`.main.${name}`).removeAttribute('hidden');
  }

  DOMContentLoadedHandler() {
    const randomIndex = Math.floor(Math.random() * this.mainImages.length);
    const imgElement = document.createElement('img');
    imgElement.src = `./images/${this.mainImages[randomIndex]}`;
    imgElement.alt = 'preview game';
    imgElement.className = 'preview__img';
    document.querySelector('.start-button').append(imgElement);
  }

  onDomContentLoadedHandler() {
    if (document.readyState !== 'loading') {
      this.DOMContentLoadedHandler();

      return;
    }

    document.addEventListener('DOMContentLoaded', this.DOMContentLoadedHandler);
  }

  onClickHandler() {
    document.querySelector('.app').addEventListener('click', (event) => {
      let {target} = event;

      while (target.parentNode != null) {
        if (target.classList.contains('list__button')) {
          if (
            !document
              .querySelector(`.tabpanel[aria-labelledby = ${target.id}]`)
              .hasAttribute('hidden')
          ) {
            return;
          }
          document.querySelectorAll('.list__button').forEach((elem) => {
            elem.setAttribute('aria-selected', false);
          });
          target.setAttribute('aria-selected', true);
          document.querySelectorAll('.tabpanel').forEach((elem) => {
            elem.setAttribute('hidden', true);
            if (elem.id === target.getAttribute('aria-controls')) {
              elem.removeAttribute('hidden');
            }
          });
          if (this.levels[this.level - 1].getLevelState() === 'complete') {
            return;
          }
          if (
            !target.classList.contains('list__button_type_correct') &&
            !target.classList.contains('list__button_type_incorrect')
          ) {
            if (this.levels[this.level - 1].checkResult(Number(target.dataset.id))) {
              this.audioErrorElement.currentTime = 0;
              this.audioErrorElement.pause();
              this.audioCorrectElement.play();
              target.classList.add('list__button_type_correct');
              this.currentAudio.pause();
            } else {
              this.audioErrorElement.currentTime = 0;
              this.audioCorrectElement.pause();
              this.audioErrorElement.play();
              target.classList.add('list__button_type_incorrect');
            }
            if (this.isGameOver) {
              document.querySelector('.next-level-button').textContent = 'Show result';

              return;
            }
          }

          return;
        }

        if (target.classList.contains('nav__item')) {
          this.switchPage(target.dataset.name);

          if (target.dataset.name === 'gallery') {
            if (this.gallery) return;

            this.gallery = new Gallery({
              data: this.data,
              levelNames: this.levelNames,
              onAudioPlay: (audioElement) => {
                if (this.currentAudio !== audioElement) this.currentAudio.pause();
                this.currentAudio = audioElement;
              },
            });
          }

          return;
        }

        if (target.classList.contains('next-level-button')) {
          if (this.isGameOver) {
            this.end();

            return;
          }
          this.newLevel();

          return;
        }

        if (target.classList.contains('start-button')) {
          this.switchPage('game');
          this.start();

          return;
        }

        if (target.classList.contains('description__button') && !target.hasAttribute('disabled')) {
          this.popup.show();

          return;
        }

        if (target.classList.contains('popup__button_type_close')) {
          this.popup.hide();

          return;
        }

        target = target.parentNode;
      }
    });
  }

  printLevelNames() {
    let content = '';
    for (let index = 0; index < this.length; index++) {
      const name = this.levelNames[index] ? this.levelNames[index] : `Level ${index + 1}`;
      content += `<li class='completeness__item' aria-label='${name}' title='Level ${
        index + 1
      }'></li>`;
    }
    document.querySelector('.completeness').innerHTML = content;
  }

  start() {
    this.level = 0;
    this.score = 0;
    this.printScore();
    this.isGameOver = false;
    document.querySelector('.next-level-button').textContent = 'Next level';
    this.newLevel();
  }

  printScore() {
    document.querySelector('.game__score-value').textContent = this.score;
  }

  newLevel() {
    this.audioErrorElement.pause();
    this.audioCorrectElement.pause();
    this.audioErrorElement.currentTime = 0;
    this.audioCorrectElement.currentTime = 0;
    if (this.level === 0) {
      document
        .querySelectorAll('.completeness__item_active')
        .forEach((elem) => elem.classList.remove('completeness__item_active'));
    }
    if (this.level !== 0) {
      document
        .querySelectorAll('.completeness__item')
        [this.level - 1].classList.remove('completeness__item_active');
    }
    document
      .querySelectorAll('.completeness__item')
      [this.level].classList.add('completeness__item_active');
    document.querySelector('.next-level-button').setAttribute('disabled', true);
    document.querySelectorAll('.list__button').forEach((elem) => {
      elem.classList.remove('list__button_type_correct');
      elem.classList.remove('list__button_type_incorrect');
      elem.classList.remove('list__button_state_play');
      elem.setAttribute('aria-selected', false);
    });
    document.querySelectorAll('.tabpanel').forEach((elem) => {
      elem.setAttribute('hidden', true);
    });
    document.querySelector('.description').classList.remove('description_active');
    document.querySelector('.description__title').textContent = '******';
    document.querySelector('.description__img').src = './images/default.png';
    document.querySelector('.description__button').setAttribute('disabled', 'true');
    if (!this.levels[this.level]) {
      this.levels[this.level] = new Level({
        data: this.data[this.level],
        maxScore: this.maxLevelScore,
        onComplete: (score) => {
          this.score += score;
          this.printScore();
          if (this.length === this.level) this.isGameOver = true;
          document.querySelector('.next-level-button').removeAttribute('disabled');
        },
        onAudioPlay: (audioElement) => {
          if (this.currentAudio !== audioElement) this.currentAudio.pause();
          this.currentAudio = audioElement;
        },
      });
    }
    this.levels[this.level].start();
    this.popup.create(this.levels[this.level].target.image);
    document.querySelector('.tabpanel_type_preview').removeAttribute('hidden');
    this.level += 1;
  }

  end() {
    const maxScore = this.length * this.maxLevelScore;
    document.querySelector('.result-score__value').textContent = `${this.score} / ${maxScore}`;
    document.querySelector('.game').setAttribute('hidden', true);
    document.querySelector('.start-button').removeAttribute('hidden');
    document.querySelector('.main.result').removeAttribute('hidden');
    this.currentPage = 'result';
    if (document.querySelector('.list__button_state_play'))
      document
        .querySelector('.list__button_state_play')
        .classList.remove('list__button_state_play');
    this.currentAudio.pause();
    if (this.score === maxScore) {
      document.querySelector('.result-page__win').removeAttribute('hidden');
    } else document.querySelector('.result-page__win').setAttribute('hidden', true);
  }
}

export default Game;
