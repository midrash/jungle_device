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

const createFeedCards = async (target = $('.card-list'), feeds) => {
  const cardsHTML = feeds
    .map(({ image, detail, _id }) => {
      const detailHTML = marked.parse(detail);

      return `
        <li id="feed_detail" data-id="${_id}">
        <div>
          <img
            src="${image}"
            alt="Image"
          />
          <div id="text_preview" class="markdown-body multi-ellipsis">${detailHTML}</div>
        </div>
      </li>
  		`;
    })
    .join('');

  target.innerHTML = cardsHTML;
};

document.addEventListener('DOMContentLoaded', async () => {
  const $cardList = $('.card-list');
  $cardList.addEventListener('click', handleClickCard);
  const token = cookie.getToken();
  $('.logout-btn').addEventListener('click', () => {
    cookie.deleteAllCookies();
    location.href = '/feed';
  });
  $('.watch-my-feed-btn').addEventListener('click', async () => {
    const myFeed = await apiService.fetchMyFeed({ token });
    createFeedCards($cardList, myFeed);
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
  const allFeed = await apiService.fetchFeed();
  await createFeedCards($cardList, allFeed);
  // 마크다운 변환
  const $textPreview = $('#text_preview');
  $('#text_preview').innerHTML = marked.parse($textPreview.innerText);
});
