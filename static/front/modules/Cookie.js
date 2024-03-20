class Cookie {
  #token;
  #nickName;

  getToken() {
    return document.cookie.split('; ')[0].split('=')[1];
  }

  getNickName() {
    return document.cookie.split('; ')[1].split('=')[1];
  }

  setCookies(coockies) {
    [...Object.entries(coockies)].forEach(([key, val]) => {
      if (key === 'nickName') this.#nickName = key;
      if (key === 'token') this.#token = val;

      document.cookie = `${key}=${encodeURIComponent(val)}; Path=/;`;
    });
  }

  initialCookie() {
    this.#token = null;
    this.#nickName = null;
    document.cookie = `token=''; Path=/;`;
    document.cookie = `nickName=''; Path=/;`;
  }

  deleteAllCookies() {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
  }
}

export const cookie = new Cookie();
