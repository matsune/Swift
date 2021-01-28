import AuthBase from './base.js';

export default class V1Auth extends AuthBase {
  authOptions(authUrl) {
    return {
      url: authUrl,
      method: 'GET',
      headers: {
        'x-storage-user': this.data.tenant+":"+this.data.userName,
        'x-storage-pass': this.data.apiKey
      }
    }
  }

  token(response, headers) {
    return headers.get('x-auth-token');
  }

  storageUrl(response, headers) {
    return headers.get('x-storage-url');
  }
}
