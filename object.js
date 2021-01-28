export default class SwiftObject {

  constructor(container, name) {
    this.container = container
    this.name = name
  }

  url() {
    return this.container.url()+"/"+this.name
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=create-or-update-object-metadata-detail,show-container-details-and-list-objects-detail,get-object-content-and-metadata-detail#get-object-content-and-metadata
  *
  * GET
  * /v1/{account}/{container}/{object}
  * Get object content and metadata
  */
  async write() {
    return this.container.client.call({
      url: this.url(),
      method: "GET",
    });
  }

  async get() {
    return this.write();
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-details-and-list-objects-detail#copy-object
  *
  * COPY
  * /v1/{account}/{container}/{object}
  * Copy object
  */
  async copy(dstContainer, dstObjectName, headers = {}) {
    headers["Destination"] = dstContainer+"/"+dstObjectName
    return this.container.client.call({
      url: this.url(),
      method: "COPY",
      headers: headers
    });
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=show-container-details-and-list-objects-detail,show-object-metadata-detail#show-object-metadata
  *
  * HEAD
  * /v1/{account}/{container}/{object}
  * Show object metadata
  */
  async metadata() {
    return (await this.container.client.call({
      url: this.url(),
      method: "HEAD"
    })).headers;
  }

  /**
  * https://developer.openstack.org/api-ref/object-store/?expanded=#create-or-update-object-metadata
  *
  * POST
  * /v1/{account}/{container}/{object}
  * Create or update object metadata
  */
  async updateMetadata(headers) {
    return await (this.container.client.call({
      url: this.url(),
      method: "POST",
      headers: headers
    })).headers;
  }
}
