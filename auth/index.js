import Auth1 from './v1.js'
import Auth2 from './v2.js'
import Auth3 from './v3.js'

export default function(data) {
  if (data.authUrl.indexOf("v3") != -1) {
    return new Auth3(data);
  } else if (data.authUrl.indexOf("v2") != -1) {
    return new Auth2(data);
  }
  return new Auth1(data);
}
