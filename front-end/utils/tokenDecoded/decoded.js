import { jwtDecode } from "jwt-decode";

function decode() {
  const token = localStorage.getItem("isAuth");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log("decoded fun:", decodedToken);
      return decodedToken;
    } catch (err) {
      return false;
    }
  } else return false;
}

export default decode;
