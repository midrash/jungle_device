import { apiService } from '../modules/ApiService.js';
import { $ } from '../utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
  const $signInBtn = $('.sign-in-btn');
  const $signInForm = $('.sign-in-form');

  $signInBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData($signInForm);
    const [id, nick_name, password, password_check] = formData.values();

    console.log(
      [...formData].filter(([, val]) => {
        console.log(val);
        !val;
      })
    );

    if ([...formData].filter(([_, val]) => !val).length !== 0) {
      alert('모든 입력창에 값을 입력해 주세요.');

      const notFillInput = [...formData]
        .filter(([_, val]) => !val)
        .map(([key, val]) => key)
        .join('');

      $(
        `#${
          notFillInput.indexOf('_')
            ? notFillInput
            : notFillInput.replace('_', '-')
        }`
      ).focus();

      return;
    }

    if (password !== password_check) {
      alert('동일한 패스워드를 입력해 주세요.');
      return;
    }

    apiService.signIn({ id, password, password_check, nick_name });
  });
});
