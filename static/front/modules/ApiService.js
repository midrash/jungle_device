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
    let body = {
      user_id: id,
      user_password: password,
      user_name: nickName,
    }
    fetch('http://192.168.1.175:5000/api/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify(body),
    })
  .then((response) => console.log("response:", response.message))
  .catch((error) => console.log("error:", error));
    //console.log(data);
  }
}

export const apiService = new ApiService();
