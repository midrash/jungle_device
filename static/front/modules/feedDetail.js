import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';
import { cookie } from './Cookie.js';

document.addEventListener('DOMContentLoaded', async (event) => {
  const markdownContent = document.querySelector('#markdown_section').innerHTML;
  document.querySelector('#markdown_section').innerHTML =
    marked.parse(markdownContent);

  $('.logout-btn').addEventListener('click', (e) => {
    e.preventDefault();

    cookie.deleteAllCookies();
    location.href = '/user/login';
  });

  $('.delete-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const postIdIdx = location.href.split('/').length - 1;
    const postId = location.href.split('/')[postIdIdx];

    console.log(postId);
    // 토큰이랑 id 보내서 삭제 post delete구현
  });

  const myFeed = await apiService.fetchMyFeed();
  console.log(location.href.split('/').at(-1));
  console.log(myFeed);
  const is = myFeed.findIndex(({ _id }) => {
    return _id === location.href.split('/').at(-1);
  });

  if (is === 1) {
    $('.delete-btn').classList.remove('hidden');
  }
});
