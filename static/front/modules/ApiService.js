class ApiService {
  #BASE_URL = 'http://192.168.1.175:5000';

  // async login({ id, password }) {
  //   const res = await fetch(this.#BASE_URL, {
  //     method: 'POST',
  //     body: {
  //       id,
  //       password,
  //     },
  //   });

  //   const data = res.json();
  //   // 400 -> error
  //   // 200 -> success
  //   // 추가처리...
  // }

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
      console.log(res.status);
    }
  }
}

export const apiService = new ApiService();
