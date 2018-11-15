const request = require(`request`)

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

module.exports = class Swift {
  constructor(url, data) {
    this.url = url
    this.auth = require("./auth")(url, data)
    this.token = ""
    this.storageUrl = ""
  }

  authenticated() {
    return this.token != "" && this.storageUrl != ""
  }

  unauthenticate() {
    this.token = ""
    this.storageUrl = ""
  }

  async authenticate() {
    let options = {
      url: this.auth.authUrl(this.url),
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      json: this.auth.json()
    }

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (isOk(response)) {
          this.token = this.auth.token(response)
          this.storageUrl = this.auth.storageUrl(body)
          resolve(this)
        } else {
          onError(reject, error, response)
        }
      })
    })
  }

  async call(options, onSuccess) {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers["X-Auth-Token"] = this.token
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (isOk(response)) {
          onSuccess(resolve, response)
        } else {
          onError(reject, error, response)
        }
      })
    })
  }

  async containers(qs) {
    return this.call({
      url: this.storageUrl,
      method: "GET",
      qs: qs
    }, (resolve, response) => {
      resolve(response.body.split("\n").filter(e => e))
    })
  }

  async account(qs) {
    return this.call({
      url: this.storageUrl,
      method: "HEAD",
      qs: qs
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  async updateAccount(headers = {}) {
    return this.call({
      url: this.storageUrl,
      method: "POST",
      headers: headers
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  async container(container, qs) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "GET",
      qs: qs
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  async createContainer(container, headers = {}) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "PUT",
      headers: headers
    }, (resolve, response) => {
      resolve()
    })
  }

  async deleteContainer(container) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "DELETE"
    }, (resolve, response) => {
      resolve()
    })
  }

}
