class Popup {
  constructor({parentNode = document.body}) {
    this.domElement = document.createElement('article');
    this.createDomElement().setDomElementClass().renderTo(parentNode);
  }

  createDomElement() {
    this.domElement.innerHTML = `<div class='popup__content'>\
    <figure class='popup__figure'><img class="popup__img" src="./images/default.png" alt="big image">\
    <figcaption class="popup__figcaption">\
    <h2 class='popup__title'>default</h2></figcaption></figure>\
    <button class='popup__button popup__button_type_close' \
    type='button' aria-label='Close'></button></div>`;

    return this;
  }

  setDomElementClass() {
    this.domElement.className = 'popup';

    return this;
  }

  renderTo(parentNode) {
    parentNode.appendChild(this.domElement);

    return this;
  }

  create({src, title}) {
    this.domElement.querySelector('.popup__img').src = `./images/${src}`;
    this.domElement.querySelector('.popup__title').textContent = title;

    return this;
  }

  show(text) {
    this.domElement.classList.add('popup_state_open');
    document.body.classList.add('popup_open');
    if (text) {
      document.querySelector('.popup__title').innerHTML = text;
    }

    return this;
  }

  hide() {
    document.body.classList.remove('popup_open');
    if (this.domElement) {
      this.domElement.classList.remove('popup_state_open');
    }

    return this;
  }
}

export default Popup;
