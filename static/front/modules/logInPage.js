import { $ } from '../utils/dom.js';
import { apiService } from './ApiService.js';
import { cookie } from './Cookie.js';

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

    if (res.result === 'fail') {
      alert(res.message);
      return;
    }

    if (res.result === 'success') {
      const { token, userName } = res;
      console.log(token, userName);
      cookie.setCookies({
        token,
        nickName: userName,
      });

      alert('로그인 성공 !');
      location.href = '/feed';
    }
  });
});
