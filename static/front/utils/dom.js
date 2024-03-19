export const $ = (dom, element = document) => {
  const el = element.querySelector(dom);

  if (!el) {
    throw new Error('찾고자 하는 dom element가 존재하지 않습니다 !');
  }

  return el;
};

export const $$ = (dom, element = document) => {
  const elements = element.querySelectorAll(dom);

  if (!el) {
    throw new Error('찾고자 하는 dom element가 존재하지 않습니다 !');
  }

  return elements;
};
