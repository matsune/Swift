import AuthBase from './base.js';

export default class V3Auth extends AuthBase {

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
      headers: {
        'Content-Type': 'application/json',
        // This force the (CORS) preflight request to include
        // Access-Control-Request-Headers: X-Subject-Token
        // But keystone's HTTP headers must be configured propertly:
        // Access-Control-(Allow|Expose)-Headers
        'x-subject-token': '_foo_',
      },
      body: JSON.stringify(this.json())
    }
  }

  token(response, headers) {
    return headers.get("x-subject-token")
  }

  storageUrl(response, headers) {
    let type = "object-store",
        endpointType = this.data.endpointType || "public",
        region = this.data.region || "";

    if (!response.token.catalog) {
      throw new Error("token.catalog not found")
    }

    let catalog = response.token.catalog.find(e => e.type == type)
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
