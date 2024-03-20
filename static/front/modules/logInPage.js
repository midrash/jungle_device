import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';

document.addEventListener('DOMContentLoaded', () => {
  const $loginForm = $('.log-in-form');
  const $loginBtn = $('.log-in-btn');

  $loginBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData($loginForm);
    const [user_id, user_password] = formData.values();

    apiService.logIn({ user_id, user_password });
  });
});
