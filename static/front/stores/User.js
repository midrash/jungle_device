import { cookie } from '../modules/Cookie.js';

class User {
  #nickName;
  #isLogin;

  getNickName() {
    return this.#nickName;
  }

  setNickName(nickName) {
    this.#nickName = nickName;
  }

  isLogin() {
    return this.#isLogin;
  }

  setIsLogin(isLogin) {
    this.#isLogin = isLogin;
  }

  logout() {
    this.#isLogin = false;
    cookie.initialCookie();
  }
}

export const user = new User();
