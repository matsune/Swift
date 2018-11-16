# Swift
Swift is a client library for connecting Object Storage OpenStack Swift, supporting all Identity API versions (v1.0, v2.0, v3).   
This library is inspired by golang's swift client library [ncw/swift](https://github.com/ncw/swift).

## Installation
```sh
$ npm install --save client-swift
```

## Usage
```node
const Swift = require("client-swift")

let authUrl = "http://127.0.0.1/v3"
let data = {
  userName: "admin",
  apiKey: "password",
  tenant: "admin",
  domain: "Default",
  tenantDomain: "Default"
}

let client = new Swift(authUrl, data)
client.authenticate()
  .then(() => {
    console.log("authenticated")
    return client.containers({format: "json"})
  })
  .then(res => {
    console.log("containers:", res.body)
  })
  .catch(e => console.log(e))
```
