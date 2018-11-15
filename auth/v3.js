const AuthBase = require("./base")

const v3AuthMethodToken        = "token"
const v3AuthMethodPassword     = "password"

module.exports = class V3Auth extends AuthBase {

  authUrl(url) {
    return url + "/auth/tokens"
  }

  token(response) {
    return response.headers["x-subject-token"]
  }

  storageUrl(body) {
    let type = "object-store"
    let _interface = "public"
    let region = ""

    if (!body.token.catalog) {
      throw new Error("body.token.catalog not found")
    }
    let catalog = body.token.catalog.find(e => e.type == type)
    if (!catalog) {
      throw new Error("catalog not found")
    }
    let endpoint = catalog.endpoints.find(e => e.interface == _interface && (!region || region == e.region))
    if (!endpoint) {
      throw new Error("endpoint not found")
    }
    return endpoint.url
  }

  json() {
    let v3Auth = {}
    let auth = {}
    let identity = {}

    if (this.data.userName && this.data.userId) {
      identity.methods = [v3AuthMethodToken]
      identity.token = {
        id: this.data.apiKey
      }
    } else {
      identity.methods = [v3AuthMethodPassword]
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
      } else {
        domain.id = this.data.domainId
      }
      identity.password.user.domain = domain
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
}
