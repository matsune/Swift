# Swift
Swift is a client library for connecting Object Storage OpenStack Swift, supporting all Identity API versions (v1.0, v2.0, v3).   
This library is inspired by golang's swift client library [ncw/swift](https://github.com/ncw/swift).

## Installation
```sh
$ npm install --save client-swift
```

## Usage
```js
let data =  {
  authUrl: "http://127.0.0.1/v3",
  userName: "admin",
  apiKey: "password",
  tenant: "admin",
  domain: "Default",
  tenantDomain: "Default"
}

// authenticate and create client instance
let client = await new Swift(data).authenticate()
// get containers list
let containers = await client.list()
// container instance
let container = client.Container(containers[0].name)
// get objects list
let objects = await container.list()
// object instance
let object = container.Object(objects[0].name)
// download file
let dst = fs.createWriteStream("a.txt")
object.write(dst)
```

## Documentation
### - `Swift` class
```js
const Swift = require("client-swift")

let client = new Swift({
  authUrl: "http://127.0.0.1/v3",
  userName: "admin",
  apiKey: "password",
  tenant: "admin",
  domain: "Default",
  tenantDomain: "Default",
  endpointType: "public"
})
```

|key|Environment Variable|
|---|---|
|authUrl|$OS_AUTH_URL|
|userName|$OS_USERNAME|
|apiKey|$OS_PASSWORD|
|userId|$OS_USER_ID|
|domain|$OS_USER_DOMAIN_NAME|
|domainId|$OS_USER_DOMAIN_ID|
|tenant|$OS_TENANT_NAME (v2)|
|tenant|$OS_PROJECT_NAME (v3)|
|tenantId|$OS_TENANT_ID|
|tenantDomain|$OS_PROJECT_DOMAIN_NAME|
|tenantDomainId|$OS_PROJECT_DOMAIN_ID|
|region|$OS_REGION_NAME (v2)|
|trustId|$OS_TRUST_ID (v3)|
|endpointType|$OS_ENDPOINT_TYPE|

#### Swift#authenticate()
```js
let client = new Swift(data)
await client.authenticate()
//  or
//  let client = await new Swift(data).authenticate()

console.log(client.authenticated()) // `true` if success
// await client.unauthenticate()
```

#### Swift#list()
Get containers list
```js
let containers = await client.list()
```
```js
// containers
[
  { count: 1,
    last_modified: '2018-11-16T01:36:13.378500',
    bytes: 3,
    name: 'container1'
  },
  { count: 2,
    last_modified: '2018-11-17T08:01:24.877880',
    bytes: 25,
    name: 'container2'
  }
]
```

#### Swift#create(containerName, headers)
Create container
```js
let container1 = await client.create("container1") // returns `SwiftContainer` instance
```

#### Swift#delete(containerName)
Delete container
```js
await client.delete("container1")
```

#### Swift#metadata()
Get account metadata
```js
let metadata = await client.metadata()
```
```js
// metadata
{ 'content-length': '0',
  'x-account-object-count': '3',
  'x-account-storage-policy-policy-0-bytes-used': '28',
  'x-account-storage-policy-policy-0-container-count': '2',
  'x-timestamp': '1542330348.41749',
  ...
```

#### Swift#updateMetadata(headers)
Update account metadata
```js
await client.updateMetadata({'X-Account-Meta-Subject': 'Literature'})
```

### - `SwiftContainer` class
```js
let container1 = client.Container("container1")
```


#### SwiftContainer#list()
Get objects list in container
```js
let objects = await container1.list()
```
```js
// objects
[
  { hash: 'd8198139ca62b0333ead15afbb50f99d',
    last_modified: '2018-11-17T08:51:34.103090',
    bytes: 22,
    name: 'a.txt',
    content_type: 'text/plain'
  },
  { hash: 'd41d8cd98f00b204e9800998ecf8427e',
    last_modified: '2018-11-17T08:51:34.160090',
    bytes: 30,
    name: 'b.txt',
    content_type: 'text/plain'
  }
]
```

#### SwiftContainer#create(objectName, stream)
Put object
```js
const src = fs.createReadStream("src.txt", "utf8")
let object = await container1.create("dst.txt", src)
console.log(object); // `SwiftObject` instance
```

#### SwiftContainer#delete(objectName)
Delete object
```js
await container1.delete("b.txt")
```

#### SwiftContainer#metadata()
```js
let metadata = await container1.metadata()
```

#### SwiftContainer#updateMetadata()
```js
await container1.updateMetadata({"X-Container-Meta-Century": "Nineteenth"})
```

### - `SwiftObject` class
```js
let object = container1.Object("sample.txt")
```

#### SwiftObject#write(stream)
```js
let object = container1.Object("sample.txt")
let dstStream = fs.createWriteStream("a.txt")
object.write(dstStream)
```

#### SwiftObject#copy(dstContainer, dstObjectName, headers)
```js
let object = client.Container("container1").Object("a.txt")
await object.copy("container2", "b.txt")
```

#### SwiftObject#metadata()
```js
let metadata = await object.metadata()
```

#### SwiftObject#updateMetadata()
```js
await object.updateMetadata({"X-Object-Meta-Book": "GoodbyeColumbus"})
```
