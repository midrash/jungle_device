import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';
import { user } from '../stores/user.js';
import { cookie } from './Cookie.js';

const handleClickCard = (e) => {
  e.stopPropagation();
  console.log(e.target.className);
  if (e.target.id !== 'feed_detail') return;
  if (e.target.className === 'like-btn') return;

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
          <span>11</span>
          <div class="stage">
            <div class="heart is-active"></div>
          </div>
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
  $cardList.addEventListener('click', (e) => {
    e.stopPropagation();

    if (e.target.className !== 'like-btn') return;
    const heart = e.target.querySelector('.heart')
    heart.classList.remove('is-active');
    setTimeout(() => {
      heart.classList.add('is-active');
    }, 100);

    // 좋아요 버튼 클릭 시 수행할 작업을 여기에 작성합니다.
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
});
