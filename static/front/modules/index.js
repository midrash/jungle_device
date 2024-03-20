import { $ } from '../utils/dom.js';
import { mock } from '../public/mock/mock.js';

const appendCards = () => {
  const $cardList = $('.card-list');

  const cardsHTML = mock
    .map(
      ({ imageUrl, content }) =>
			`
				<li id="feed_detail">
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

document.addEventListener('click', (e) => {
	if (e.target.id === 'feed_detail') {
		location.href = 'feed/detail/1';
	}
});