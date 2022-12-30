export const createDlElement = ({term, definition, classname = 'description-list'}) => {
  let termDt = '';
  if (term) {
    termDt = `<dt class='${classname}__term'>Страна</dt>\
  <dd class='${classname}__definition'>${term}</dd>`;
  }
  let definitionDt = '';
  if (definition) {
    definitionDt = `<dt class='${classname}__term'>Разработан</dt>\
  <dd class='${classname}__definition'>${definition}</dd>`;
  }
  let list = '';
  if (term || definition) {
    list = `<dl class='${classname}'>${termDt}${definitionDt}</dl>`;
  }

  return list;
};
