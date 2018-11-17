const SwiftObject = require("./object")

module.exports = class SwiftContainer {
  constructor(client, name) {
    this.client = client
    this.name = name
  }

  url() {
    return this.client.storageUrl+"/"+this.name
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-container-details-and-list-objects
  *
  * GET
  * /v1/{account}/{container}
  * Show container details and list objects
  */
  async list() {
    return this.client.call({
      url: this.url(),
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
  * https://developer.openstack.org/api-ref/object-store/?expanded=#show-container-metadata
  *
  * HEAD
  * /v1/{account}/{container}
  * Show container metadata
  */
  async metadata() {
    return this.client.call({
      url: this.url(),
      method: "HEAD"
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-update-or-delete-container-metadata
  *
  * POST
  * /v1/{account}/{container}
  * Create, update, or delete container metadata
  */
  async updateMetadata(headers) {
    return this.client.call({
      url: this.url(),
      method: "POST",
      headers: headers
    }, (resolve, response) => {
      resolve(response.headers)
    })
  }

  Object(name) {
    return new SwiftObject(this, name)
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail,create-or-update-object-metadata-detail#create-or-replace-object
  *
  * PUT
  * /v1/{account}/{container}/{object}
  * Create or replace object
  */
  async create(objectName, readStream) {
    return this.client.call({
      url: this.url()+"/"+objectName,
      method: "PUT",
      body: readStream
    }, (resolve, response) => {
      resolve(this.Object(objectName))
    })
  }
}
