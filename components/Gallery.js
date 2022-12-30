import {createDlElement} from '../utils.js';

class Gallery {
  constructor({data, levelNames, onAudioPlay}) {
    this.data = data;
    this.levelNames = levelNames;
    this.content = '';
    this.onAudioPlay = onAudioPlay;
    this.init();
  }

  init() {
    this.data.forEach((elem) => {
      for (let i = 0; i < elem.length; i++) {
        const audioGalleryElement = new Audio(`./sounds/${elem[i].audio}`);
        audioGalleryElement.controls = true;
        elem[i].audioGalleryElement = audioGalleryElement;
        audioGalleryElement.onplay = () => this.onAudioPlay(audioGalleryElement);
      }
    });
    this.createDomElement().render();
  }

  createDomElement() {
    this.data.forEach((elem, index) => {
      this.content += `<h2 class='gallery-page__type'>${this.levelNames[index]}</h2>`;
      this.content += elem.reduce((str, {id, name, country, year, description, model}) => {
        const text = description.reduce((acc, item) => acc + `<p>${item}</p>`, '');
        str =
          str +
          `<article class='card'><h3 class='card__name'>${name}</h3>\
          <img src='./images/${model}' class='card__img' data-id='${
            id + name
          }' alt='${name}'/>${createDlElement({term: country, definition: year})}${text}\
          </article>`;

        return str;
      }, '');
    });

    return this;
  }

  render() {
    document.querySelector('.gallery').innerHTML = `<article class="gallery-page">
    <h1 class="gallery-page__title">Gallery</h1>${this.content}</article>`;

    this.data.forEach((elem) => {
      elem.forEach(({id, name, audioGalleryElement}) => {
        document.querySelector(`.card__img[data-id="${id + name}"]`).after(audioGalleryElement);
      });
    });
  }
}

export default Gallery;
