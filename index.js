import SwiftContainer from './container.js';
import request from './request.js';
import Auth from './auth/index.js';

export default class Swift {

  constructor(data) {
    this.authUrl = data.authUrl

    this.auth = Auth(data);
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
    let response = await request(options);

    let headers = response.headers,
        json = await response.json();
    this.token = this.auth.token(response, headers)
    this.storageUrl = await this.auth.storageUrl(json, headers)

    if (! this.token) {
      throw new Error('Could not authenticate. No token');
    }

    return this;
  }

  call(options) {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers["X-Auth-Token"] = this.token
    return request(options);
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
    let response = await this.call({
      url: this.storageUrl + '?format=json',
      method: "GET"
    });

    return await response.json() || [];
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#show-account-metadata
  *
  * HEAD
  * /v1/{account}
  * Show account metadata
  */
  async metadata() {
    return (await this.call({
      url: this.storageUrl,
      method: "HEAD"
    })).headers;
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-update-or-delete-account-metadata
  *
  * POST
  * /v1/{account}
  * Create, update, or delete account metadata
  */
  async updateMetadata(headers) {
    return (await this.call({
      url: this.storageUrl,
      method: "POST",
      headers: headers
    })).headers;
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-metadata-detail#create-container
  *
  * PUT
  * /v1/{account}/{container}
  * Create container
  */
  async create(container, headers) {
    return this.Container(await this.call({
      url: this.storageUrl+"/"+container,
      method: "PUT",
      headers: headers
    }));
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#delete-container
  *
  * DELETE
  * /v1/{account}/{container}
  * Delete container
  */
  async delete(container) {
    return (await this.call({
      url: this.storageUrl+"/"+container,
      method: "DELETE"
    })).headers;
  }
}
