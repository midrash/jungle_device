import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';

const appendCards = (feeds) => {
  const $cardList = $('.card-list');

  const cardsHTML = feeds
    .map(
      ({ image, detail }) =>
        `
				<li id="feed_detail">
					<div>
						<img
							src="${image}"
							alt="Image"
						/>
							<p class="multi-ellipsis">
							${detail}
							</p>
					</div>
				</li>
  		`
    )
    .join('');
  $cardList.innerHTML = cardsHTML;
};

document.addEventListener('DOMContentLoaded', async () => {
  const feeds = await apiService.fetchFeed();

  appendCards(feeds);
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'feed_detail') {
    location.href = 'feed/detail/1';
  }
});
