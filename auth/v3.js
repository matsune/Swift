const AuthBase = require("./base")

module.exports = class V3Auth extends AuthBase {

  json() {
    let v3Auth = {}
    let auth = {}
    let identity = {}

    if (this.data.userName || this.data.userId) {
      identity.methods = ["password"]
      identity.password = {
        user: {
          name: this.data.userName,
          id: this.data.userId,
          password: this.data.apiKey
        }
      }

      let domain = {}
      if (this.data.domain) {
        domain.name = this.data.domain
      } else if (this.data.domainId) {
        domain.id = this.data.domainId
      }
      identity.password.user.domain = domain
    } else {
      identity.methods = ["token"]
      identity.token = {
        id: this.data.apiKey
      }
    }

    if (this.data.trustId) {
      auth.scope = {
        trust: {
          id: this.data.trustId
        }
      }
    } else if (this.data.tenantId || this.data.tenant){
      let scope = {
        project: {}
      }
      if (this.data.tenantId) {
        scope.project.id = this.data.tenantId
      } else if (this.data.tenant) {
        scope.project.name = this.data.tenant
        if (this.data.tenantDomain) {
          scope.project.domain = {
            name: this.data.tenantDomain
          }
        } else if (this.data.tenantDomainId) {
          scope.project.domain = {
            id: this.data.tenantDomainId
          }
        } else if (this.data.domain) {
          scope.project.domain = {
            name: this.data.domain
          }
        } else if (this.data.domainId) {
          scope.project.domain = {
            id: this.data.domainId
          }
        } else {
          scope.project.domain = {
            name: "Default"
          }
        }
      }
      auth.scope = scope
    }

    auth.identity = identity
    v3Auth.auth = auth
    return v3Auth
  }

  authOptions(authUrl) {
    return {
      url: authUrl + "/auth/tokens",
      method: 'POST',
      json: this.json()
    }
  }

  token(response) {
    return response.headers["x-subject-token"]
  }

  storageUrl(response) {
    let type = "object-store"
    let endpointType = this.data.endpointType || "public"
    let region = ""

    if (!response.body.token.catalog) {
      throw new Error("body.token.catalog not found")
    }
    let catalog = response.body.token.catalog.find(e => e.type == type)
    if (!catalog) {
      throw new Error("catalog not found")
    }
    let endpoint = catalog.endpoints.find(e => e.interface == endpointType && (!region || region == e.region))
    if (!endpoint) {
      throw new Error("endpoint not found")
    }
    return endpoint.url
  }
}
