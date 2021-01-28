import SwiftObject from './object.js';

export default class SwiftContainer {
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
    let response = await this.client.call({
      url: this.url() + '?format=json',
      method: "GET",
    });

    return response.body ? await response.json() : [];
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#show-container-metadata
  *
  * HEAD
  * /v1/{account}/{container}
  * Show container metadata
  */
  async metadata() {
    return (await this.client.call({
      url: this.url(),
      method: "HEAD"
    })).headers;
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-update-or-delete-container-metadata
  *
  * POST
  * /v1/{account}/{container}
  * Create, update, or delete container metadata
  */
  async updateMetadata(headers) {
    return (await this.client.call({
      url: this.url(),
      method: "POST",
      headers: headers
    })).headers;
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
    return this.Object(await this.client.call({
      url: this.url()+"/"+objectName,
      method: "PUT",
      body: readStream
    }));
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=create-or-update-object-metadata-detail,show-container-details-and-list-objects-detail#delete-object
  *
  * DELETE
  * /v1/{account}/{container}/{object}
  * Delete object
  */
  async delete(objectName) {
    return (await this.client.call({
      url: this.url()+"/"+objectName,
      method: "DELETE"
    })).headers;
  }
}
