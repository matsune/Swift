const request = require(`request`)
const { V3Auth } = require("./auth")

function unimplemented(method) {
  return new Error('You have to implement ' + method)
}

class Swift {
  constructor(credentials) {
    let url = credentials.url
    if (url.indexOf("v3") != -1) {
      this.auth = new V3Auth(credentials)
    } else if (url.indexOf("v2") != -1) {
      this.auth = new V2Auth(credentials)
    } else {
      this.auth = new Auth(credentials)
    }
    this.token = ""
    this.storageUrl = ""
  }

  authenticated() {
    return this.token != "" && this.storageUrl != ""
  }

  async authenticate() {
    let headers = {
      "Content-Type": "application/json"
    }
    let options = {
      url: this.auth.authUrl(),
      method: 'POST',
      headers: headers,
      json: this.auth.requestData()
    }
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error)
        } else if (Math.floor(response.statusCode / 200) == 1) {
          this.token = this.auth.token(response)
          this.storageUrl = this.auth.storageUrl(body)
          resolve(this)
        } else {
          reject(response.body.error)
        }
      })
    })
  }
}

module.exports = Swift
