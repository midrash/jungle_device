class ApiService {
  #BASE_URL = 'https://192.168.1.175:5000';

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

  // async fetchFeed() {
  //   try {
  //     const res = await fetch(this.#BASE_URL);
  //     const feeds = res.json();
  //   } catch (error) {
  //     if (error instanceof TypeError) {
  //       alert('네트워크 오류가 발생했습니다.');
  //     }
  //   }

  //   return feeds;
  // }

  async signIn({ id, password, password_check, nickName }) {
    try {
      const res = await fetch(`${this.#BASE_URL}/api/signup`, {
        method: 'POST',
        body: {
          user_id: id,
          user_password: password,
          user_name: nickName,
        },
      });
      const data = res.json();
      alert('성공');
    } catch (error) {
      console.log(error);
    }

    console.log(data);
  }
}

export const apiService = new ApiService();
