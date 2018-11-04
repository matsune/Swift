function unimplemented(method) {
  return new Error('You have to implement ' + method)
}

class Auth {
  constructor(credentials) {
    this.url = credentials.url
    this.username = credentials.username
    this.password = credentials.password
    this.isInternal = credentials.isInternal || false
  }

  requestData() {
    throw unimplemented("authUrl")
  }

  authUrl() {
    throw unimplemented("authUrl")
  }

  token(response) {
    unimplemented("token")
  }

  endpointUrl(body, type, _interface, region) {
    let catalog = body.token.catalog.find(e => e.type == type)
    if (!catalog) {
      return ""
    }
    console.log(catalog.endpoints);
    let endpoint = catalog.endpoints.find(e => e.interface == _interface && (!region || region == e.region))
    if (!endpoint) {
      return ""
    }
    return endpoint.url
  }

  storageUrl(body) {
    unimplemented("storageUrl")
  }
}

class V2Auth extends Auth {
  constructor(credentials) {
    super(credentials)
  }
}

class V3Auth extends Auth {
  constructor(credentials) {
    super(credentials)
    this.domain = credentials.domain
    this.region = credentials.region
  }

  authUrl() {
    return this.url + "/auth/tokens"
  }

  requestData() {
    let v3Request = {
      "auth": {
        "identity": {
          "methods": ["password"],
          "password": {
            "user": {
              "name": this.username,
              "password": this.password,
              "domain": {
                "id": this.domain
              }
            }
          }
        }
      }
    }
    return v3Request
  }

  token(response) {
    return response.headers["x-subject-token"]
  }

  storageUrl(body) {
    let _interface = this.isInternal ? "internal" : "public"
    return this.endpointUrl(body, "object-store", _interface, this.region)
  }
}

module.exports.V3Auth = V3Auth
