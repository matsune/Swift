const AuthBase = require("./base")

module.exports = class V1Auth extends AuthBase {
  authUrl(url) {
    throw unimplemented("authUrl")
  }
}
