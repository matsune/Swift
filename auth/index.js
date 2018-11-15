module.exports = function(url, data) {
  let version = "v1"
  if (url.indexOf("v3") != -1) {
    version = "v3"
  } else if (url.indexOf("v2") != -1) {
    version = "v2"
  }
  const Auth = require("./"+version)
  return new Auth(data)
}
