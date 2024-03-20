class Cookie {
  #token;
  #nickName;

  constructor(
    token = decodeURIComponent(document.cookie).split('; ')[0],
    nickName = decodeURIComponent(document.cookie).split('; ')[1]
  ) {
    this.#token = !!token ? token.split('=')[1] : null;
    this.#nickName = !!nickName ? nickName.split('=')[1] : null;
  }

  getToken() {
    return this.#token;
  }

  getNickName() {
    return this.#nickName;
  }

  setCookies(coockies) {
    [...Object.entries(coockies)].forEach(([key, val]) => {
      if (key === 'nickName') this.#nickName = this.#nickName;
      if (key === 'token') this.#token = val;

      document.cookie = `${key}=${encodeURIComponent(val)}; Path=/;`;
    });
  }

  initialCookie() {
    this.#token = null;
    this.#nickName = null;
    document.cookie = `token=; Path=/;`;
    document.cookie = `nickName=; Path=/;`;
  }
}

export const cookie = new Cookie();
