import { jwtDecode } from "jwt-decode";

function decode(token) {
  try {
    const decodedToken = jwtDecode(token);
    console.log("decoded:", decodedToken);
    return decodedToken;
  } catch (err) {
    return null;
  }
}

export default decode;
