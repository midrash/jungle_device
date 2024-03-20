import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';
import { cookie } from './Cookie.js';

document.addEventListener('DOMContentLoaded', async (event) => {
  const markdownContent = document.querySelector('#markdown_section').innerHTML;
  document.querySelector('#markdown_section').innerHTML =
    marked.parse(markdownContent);

  const postID = location.href.split('/').at(-1);
  const token = cookie.getToken();
  const myFeedInfo = await apiService.fetchMyFeed({ postID, token });
  const isMyFeed = myFeedInfo.findIndex(({ _id }) => _id === postID);

  console.log(myFeedInfo);
  console.log('token : ', cookie.getToken());
  console.log('hasToken', cookie.getToken());

  if (isMyFeed) $('.delete-btn').classList.remove('hidden');
  if (cookie.getToken) {
    $('.login-btn').classList.remove('hidden');
    $('.logout-btn').classList.add('hidden');
  }
  if (!cookie.getToken) {
    $('.logout-btn').classList.add('hidden');
    $('.logout-btn').classList.remove('hidden');
  }

  $('.logout-btn').addEventListener('click', (e) => {
    e.preventDefault();

    cookie.deleteAllCookies();
    location.href = '/user/login';
  });

  $('.login-btn').addEventListener('click', (e) => {
    e.preventDefault();

    location.href = '/user/login';
  });

  $('.delete-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    await apiService.deleteFeed({ postID, token });

    location.href = '/feed';
  });
});
