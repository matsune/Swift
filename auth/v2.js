const AuthBase = require("./base")

module.exports = class V2Auth extends AuthBase {
  json() {
    let v2Auth = {}
    v2Auth.region = this.data.region

    let auth = {}
    let useApiKey = this.data.apiKey.length >= 32
    if (useApiKey) {
      auth.apiKeyCredentials = {
        username: this.data.userName,
        apiKey: this.data.apiKey
      }
      auth.tenantName = this.data.tenant,
      auth.tenantId = this.data.tenantId
    } else {
      auth.passwordCredentials = {
        username: this.data.userName,
        password: this.data.apiKey
      }
      auth.tenantName = this.data.tenant
      auth.tenantId = this.data.tenantId
    }
    v2Auth.auth = auth
    return v2Auth
  }

  authOptions(url) {
    return {
      url: url + "/tokens",
      method: 'POST',
      json: this.json()
    }
  }

  token(response) {
    return response.body.access.token.id
  }

  storageUrl(response) {
    let type = "object-store"
    let region = this.data.region || ""

    let catalog = response.body.access.serviceCatalog.find(e => e.type == type)
    if (!catalog) {
      throw new Error("catalog not found")
    }

    let endpoint = catalog.endpoints.find(e => region == "" || region == e.region)
    if (!endpoint) {
      throw new Error("endpoints not found")
    }
    return endpoint.publicURL
  }
}
