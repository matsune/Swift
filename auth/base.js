// abstract class
export default class AuthBase {
  constructor(data) {
    this.data = data
  }

  unimplemented(method) {
    return new Error('not implemented ' + method)
  }

  authOptions(url) {
    this.unimplemented("authOptions")
  }

  token(response, headers) {
    this.unimplemented("token")
  }

  storageUrl(response, headers) {
    this.unimplemented("storageUrl")
  }
}
