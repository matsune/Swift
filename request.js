import fetch from 'node-fetch';

export default async function request(options) {
  let url = options.url;

  // console.log("Sending", JSON.stringify({...options, ...{body: ""}}));
  // console.log("Body   ", options.body);
  try {
    let response = await fetch(url, options);
    if (response.ok) {
      // console.log("Response", response, Object.fromEntries(response.headers.entries()));
      return response;
    }

    throw new Error("Request error: " + await response.text());
  } catch(e) {
    throw e;
  }
}
