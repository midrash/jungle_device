import { $ } from '../utils/dom.js';
import { mock } from '../public/mock/mock.js';

const appendCards = () => {
  const $cardList = $('.card-list');

  const cardsHTML = mock
    .map(
      ({ imageUrl, content }) =>
        `
        <div class=" shadow-lg w-[240px] border p-[24px]">
        <div class="flex flex-col items-center gap-[16px]">
          <img
            src="${imageUrl}"
            alt="Image"
            class="border rounded-[8px] object-fit"
          />
            <p class="multi-ellipsis h-[100px] multi-ellipsis font-semibold">
            ${content}
            </p>
        </div>
      </div>
  `
    )
    .join('');
  $cardList.innerHTML = cardsHTML;
};

document.addEventListener('DOMContentLoaded', () => {
  appendCards();
});
