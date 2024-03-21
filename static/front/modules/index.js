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
      <button class="like-btn">
      <svg width="100" height="100" viewBox="0 0 24 24">
            <path fill="red" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
      <button>
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
  const $watchMyFeedBtn = $('.watch-my-feed-btn');
  const $logoutBtn = $('.logout-btn');
  const token = cookie.getToken();

  $cardList.addEventListener('click', handleClickCard);
  $logoutBtn.addEventListener('click', () => {
    cookie.deleteAllCookies();
    location.href = '/feed';
  });
  $watchMyFeedBtn.addEventListener('click', async () => {
    const myFeed = await apiService.fetchMyFeed({ token });

    $watchMyFeedBtn.classList.add('hidden');
    $('.watch-all-feed-btn').classList.remove('hidden');

    await createFeedCards($cardList, myFeed);
  });
  $('.watch-all-feed-btn').addEventListener('click', async () => {
    const allFeed = await apiService.fetchFeed();

    $watchMyFeedBtn.classList.remove('hidden');
    $('.watch-all-feed-btn').classList.add('hidden');

    await createFeedCards($cardList, allFeed);
  });
  $cardList.addEventListener('click', async (e) => {
    e.stopPropagation();

    if (e.target.className !== 'like-btn') return;
    const postID = e.target.closest('#feed_detail').dataset.id;

    await apiService.increaseLikeCount({ postID });
  });

  if (
    !document.cookie.includes('token') ||
    document.cookie.split('; ')[0] !== 'token'
  ) {
    $('.logout-btn').classList.add('hidden');
    $('.write-btn').classList.add('hidden');
    $watchMyFeedBtn.classList.add('hidden');
    $('.login-btn').classList.remove('hidden');
    $('.welcome-title').innerText = '게스트';
  }

  if (document.cookie.includes('token')) {
    $('.logout-btn').classList.remove('hidden');
    $('.write-btn').classList.remove('hidden');
    $watchMyFeedBtn.classList.remove('hidden');
    $('.login-btn').classList.add('hidden');
    $('.welcome-title').innerText = '게스트';

    $('.welcome-title').innerText = `${
      document.cookie.split('; ')[1].split('=')[1]
    }`;
  }

  const allFeed = await apiService.fetchFeed();
  await createFeedCards($cardList, allFeed);

  // 마크다운 변환
  const $textPreview = $('#text_preview');
  $('#text_preview').innerHTML = marked.parse($textPreview.innerText);
});
