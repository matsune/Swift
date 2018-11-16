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
    let options = this.auth.authOptions(this.url)

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (isOk(response)) {
          this.token = this.auth.token(response)
          this.storageUrl = this.auth.storageUrl(response)
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

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-account-details-and-list-containers
  *
  * GET
  * /v1/{account}
  * Show account details and list containers
  */
  async containers(qs) {
    return this.call({
      url: this.storageUrl,
      method: "GET",
      qs: qs
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-account-metadata
  *
  * HEAD
  * /v1/{account}
  * Show account metadata
  */
  async accountMetadata(qs) {
    return this.call({
      url: this.storageUrl,
      method: "HEAD",
      qs: qs
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-update-or-delete-account-metadata
  *
  * POST
  * /v1/{account}
  * Create, update, or delete account metadata
  */
  async updateAccountMetadata(headers) {
    return this.call({
      url: this.storageUrl,
      method: "POST",
      headers: headers
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-container-details-and-list-objects
  *
  * GET
  * /v1/{account}/{container}
  * Show container details and list objects
  */
  async container(container, qs) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "GET",
      qs: qs
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-container
  *
  * PUT
  * /v1/{account}/{container}
  * Create container
  */
  async createContainer(container, headers) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "PUT",
      headers: headers
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-update-or-delete-container-metadata
  *
  * POST
  * /v1/{account}/{container}
  * Create, update, or delete container metadata
  */
  async updateContainerMetadata(container, headers) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "POST",
      headers: headers
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#show-container-metadata
  *
  * HEAD
  * /v1/{account}/{container}
  * Show container metadata
  */
  async containerMetadata(container) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "HEAD"
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#delete-container
  *
  * DELETE
  * /v1/{account}/{container}
  * Delete container
  */
  async deleteContainer(container) {
    return this.call({
      url: this.storageUrl+"/"+container,
      method: "DELETE"
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=create-or-update-object-metadata-detail,show-container-details-and-list-objects-detail,get-object-content-and-metadata-detail#get-object-content-and-metadata
  *
  * GET
  * /v1/{account}/{container}/{object}
  * Get object content and metadata
  */
  async object(container, objectName, qs, headers) {
    return this.call({
      url: this.storageUrl+"/"+container+"/"+objectName,
      method: "GET",
      qs: qs,
      headers: headers
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail,create-or-update-object-metadata-detail#create-or-replace-object
  *
  * PUT
  * /v1/{account}/{container}/{object}
  * Create or replace object
  */
  async createObject(container, objectName, body) {
    return this.call({
      url: this.storageUrl+"/"+container+"/"+objectName,
      method: "PUT",
      body: body
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-details-and-list-objects-detail#copy-object
  *
  * COPY
  * /v1/{account}/{container}/{object}
  * Copy object
  */
  async copyObject(srcContainer, srcObjectName, dstContainer, dstObjectName, headers = {}) {
    headers["Destination"] = dstContainer+"/"+dstObjectName
    return this.call({
      url: this.storageUrl+"/"+srcContainer+"/"+srcObjectName,
      method: "COPY",
      headers: headers
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=create-or-update-object-metadata-detail,show-container-details-and-list-objects-detail#delete-object
  *
  * DELETE
  * /v1/{account}/{container}/{object}
  * Delete object
  */
  async deleteObject(container, objectName) {
    return this.call({
      url: this.storageUrl+"/"+container+"/"+objectName,
      method: "DELETE"
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-details-and-list-objects-detail,show-object-metadata-detail#show-object-metadata
  *
  * HEAD
  * /v1/{account}/{container}/{object}
  * Show object metadata
  */
  async objectMetadata(container, objectName) {
    return this.call({
      url: this.storageUrl+"/"+container+"/"+objectName,
      method: "HEAD"
    }, (resolve, response) => {
      resolve(response)
    })
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#create-or-update-object-metadata
  *
  * POST
  * /v1/{account}/{container}/{object}
  * Create or update object metadata
  */
  async updateObjectMetadata(container, objectName, headers) {
    return this.call({
      url: this.storageUrl+"/"+container+"/"+objectName,
      method: "POST",
      headers: headers
    }, (resolve, response) => {
      resolve(response)
    })
  }

}
