// abstract class
module.exports = class AuthBase {
  constructor(data) {
    this.data = data
  }

  unimplemented(method) {
    return new Error('not implemented ' + method)
  }

  authUrl(url) {
    this.unimplemented("authUrl")
  }

  token(response) {
    this.unimplemented("token")
  }

  storageUrl(body) {
    this.unimplemented("storageUrl")
  }

  json() {
    this.unimplemented("json")
  }
}
