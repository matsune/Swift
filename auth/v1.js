const AuthBase = require("./base")

module.exports = class V1Auth extends AuthBase {
  authOptions(url) {
    return {
      url: url,
      method: 'GET',
      headers: {
        'x-storage-user': this.data.tenant+":"+this.data.userName,
        'x-storage-pass': this.data.apiKey
      }
    }
  }

  token(response) {
    return response.headers['x-auth-token']
  }

  storageUrl(response) {
    return response.headers['x-storage-url']
  }
}
