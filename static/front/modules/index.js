import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';
import { user } from '../stores/user.js';
import { cookie } from './Cookie.js';

const handleClickCard = (e) => {
  e.stopPropagation();

  if (e.target.id !== 'feed_detail') return;

  const { id } = e.target.dataset;

  location.href = `/feed/detail/${id}`;
};

const createFeedCards = async (target = $('.card-list')) => {
  const feeds = await apiService.fetchFeed();

  const cardsHTML = feeds
    .map(
      ({ image, detail, _id }) =>
        `
				<li id="feed_detail" data-id="${_id}">
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

  target.innerHTML = cardsHTML;
};

document.addEventListener('DOMContentLoaded', async () => {
  const $cardList = $('.card-list');
  $cardList.addEventListener('click', handleClickCard);
  const JWTtoken = cookie.getToken();
  $('.logout-btn').addEventListener('click', () => {
    cookie.deleteAllCookies();
    location.href = '/feed';
  });

  if (
    !document.cookie.includes('token') ||
    document.cookie.split('; ')[0] !== 'token'
  ) {
    $('.logout-btn').classList.add('hidden');
    $('.write-btn').classList.add('hidden');
    $('.watch-my-feed-btn').classList.add('hidden');
    $('.login-btn').classList.remove('hidden');
  }

  if (document.cookie.includes('token')) {
    $('.logout-btn').classList.remove('hidden');
    $('.write-btn').classList.remove('hidden');
    $('.watch-my-feed-btn').classList.remove('hidden');
    $('.login-btn').classList.add('hidden');
  }

  await createFeedCards($cardList);
});
