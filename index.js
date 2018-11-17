const SwiftContainer = require("./container")
const {request, requestWithPipe} = require('./request')

module.exports = class Swift {

  constructor(data) {
    this.authUrl = data.authUrl
    this.auth = require("./auth")(data)
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
    let options = this.auth.authOptions(this.authUrl)
    return request(options, (resolve, response) => {
      this.token = this.auth.token(response)
      this.storageUrl = this.auth.storageUrl(response)
      resolve(this)
    })
  }

  async call(options, onSuccess) {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers["X-Auth-Token"] = this.token
    return request(options, (resolve, response) => {
      onSuccess(resolve, response)
    })
  }

  async callWithPipe(options, pipe) {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers["X-Auth-Token"] = this.token
    return requestWithPipe(options, pipe)
  }

  Container(name) {
    return new SwiftContainer(this, name)
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-account-details-and-list-containers
  *
  * GET
  * /v1/{account}
  * Show account details and list containers
  */
  async list() {
    return this.call({
      url: this.storageUrl,
      method: "GET",
      qs: {
        format: "json"
      }
    }, (resolve, response) => {
      if (response.body) {
        resolve(JSON.parse(response.body))
      } else {
        resolve([])
      }
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-account-metadata
  *
  * HEAD
  * /v1/{account}
  * Show account metadata
  */
  async metadata() {
    return this.call({
      url: this.storageUrl,
      method: "HEAD"
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-update-or-delete-account-metadata
  *
  * POST
  * /v1/{account}
  * Create, update, or delete account metadata
  */
  async updateMetadata(headers) {
    return this.call({
      url: this.storageUrl,
      method: "POST",
      headers: headers
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-container
  *
  * PUT
  * /v1/{account}/{container}
  * Create container
  */
  async create(container, headers) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "PUT",
      headers: headers
    }, (resolve, response) => {
      resolve(this.Container(container))
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#delete-container
  *
  * DELETE
  * /v1/{account}/{container}
  * Delete container
  */
  async delete(container) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "DELETE"
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }
}
