import { cookie } from '../modules/Cookie.js';

class User {
  #nickName;
  #isLogin;

  constructor() {
    this.#nickName = !!cookie.getNickName() ? cookie.getNickName() : '게스트';
    this.#isLogin = !!cookie.getToken;
  }

  getNickName() {
    return this.#nickName;
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
