import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';

document.addEventListener('DOMContentLoaded', () => {
  const $loginForm = $('.log-in-form');
  const $loginBtn = $('.log-in-btn');

  $loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const formData = new FormData($loginForm);
    const [user_id, user_password] = formData.values();

    const res = await apiService.login({
      id: user_id,
      password: user_password,
    });

    const { token, userName } = res;

    document.cookie = encodeURIComponent(`token=${token}; name=${userName};`);
  });
});
