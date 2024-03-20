import { cookie } from './Cookie.js';

const FAIL = 'fail';
const SUCCESS = 'success';
class ApiService {
  #BASE_URL = 'http://192.168.1.175:5000';

  async login({ id, password }) {
    try {
      console.log(id, password);
      const res = await fetch(`${this.#BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          user_password: password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const { result, message } = data;

        if (result === FAIL) {
          return {
            result,
            message,
          };
        }

        if (result === SUCCESS) {
          const { user_name, token } = data;

          return {
            result,
            userName: user_name,
            token,
          };
        }
      }
    } catch (error) {
      alert('서버에 문제가 생겼습니다.');
    }
  }

  async signIn({ id, password, password_check, nick_name }) {
    try {
      const res = await fetch(`${this.#BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          user_password: password,
          user_name: nick_name,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('회원가입 완료 !');
      }

      return data;
    } catch (error) {
      alert('서버에 문제가 생겼습니다.');
    }
  }

  async fetchFeed() {
    try {
      const res = await fetch(`${this.#BASE_URL}/api/feed`, {
        method: 'GET',
      });

      if (res.ok) {
        const data = await res.json();

        return data.message;
      }

      alert('피드 가져오기 실패');
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    }

    return feeds;
  }

  async fetchMyFeed() {
    try {
      const res = await fetch(`${this.#BASE_URL}/api/feed/my`, {
        method: 'GET',
        headers: {
          Authorization: cookie.getToken(),
        },
      });

      if (res.ok) {
        const { message } = await res.json();

        return message;
      }

      alert('피드 가져오기 실패');
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    }

    return feeds;
  }

  async uploadFeed({ image, detail, formData }) {
    await fetch(`${this.#BASE_URL}/api/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        form_data: formData,
      },
    });
  }

  async isLogin({ token }) {
    const res = await fetch(`${this.#BASE_URL}/token`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (res.ok) {
      const data = await res.json();

      if (data.result === SUCCESS) {
        alert('로그인 성공');
        return true;
      }

      if (data.res === FAIL) {
        alert('로그인 실패');
        return false;
      }
    }

    return false;
  }
}

export const apiService = new ApiService();
