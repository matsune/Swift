const _request = require("request")

function isOk(response) {
  return response && 199 < response.statusCode && response.statusCode < 300
}

function onError(reject, error, response) {
  if (error) {
    reject(error)
  } else if (response.body.error) {
    reject(response.body.error)
  } else {
    reject(response.body)
  }
}

module.exports = function request(options, onSuccess) {
  return new Promise((resolve, reject) => {
    _request(options, (error, response, body) => {
      if (isOk(response)) {
        onSuccess(resolve, response)
      } else {
        onError(reject, error, response)
      }
    })
  })
}
