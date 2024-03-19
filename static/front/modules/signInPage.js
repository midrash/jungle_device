import { apiService } from '../modules/ApiService.js';
import { $ } from '../utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
  const $signInBtn = $('.sign-in-btn');
  const $signInForm = $('.sign-in-form');

  $signInBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData($signInForm);
    const [id, nickName, password, password_check] = formData.values();

    console.log(id, nickName, password, password_check);
    apiService.signIn({ id, password, password_check, nickName });
  });
});
