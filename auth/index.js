module.exports = function(data) {
  let version = "v1"
  if (data.authUrl.indexOf("v3") != -1) {
    version = "v3"
  } else if (data.authUrl.indexOf("v2") != -1) {
    version = "v2"
  }
  const Auth = require("./"+version)
  return new Auth(data)
}
