import { jwtDecode } from "jwt-decode";

function decode(token) {
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export default decode;
