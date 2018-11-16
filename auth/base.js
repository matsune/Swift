// abstract class
module.exports = class AuthBase {
  constructor(data) {
    this.data = data
  }

  unimplemented(method) {
    return new Error('not implemented ' + method)
  }

  authOptions(url) {
    this.unimplemented("authOptions")
  }

  token(response) {
    this.unimplemented("token")
  }

  storageUrl(response) {
    this.unimplemented("storageUrl")
  }
}
