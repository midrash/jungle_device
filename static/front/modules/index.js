import { $ } from '../utils/dom.js';
import { mock } from '../public/mock/mock.js';

const appendCards = () => {
  const $cardList = $('.card-list');

  const cardsHTML = mock
    .map(
      ({ imageUrl, content }) =>
        `
        <li>
        <div>
          <img
            src="${imageUrl}"
            alt="Image"
          />
            <p class="multi-ellipsis">
            ${content}
            </p>
        </div>
      </li>
  `
    )
    .join('');
  $cardList.innerHTML = cardsHTML;
};

document.addEventListener('DOMContentLoaded', () => {
  appendCards();
});
