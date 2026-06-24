import { useState } from "react";
import API from "../api/api";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const loginUser = async () => {
try {
const res = await API.post("/auth/login", {
email,
password,
});


  localStorage.setItem("token", res.data.token);

  alert("Login Successful");
  window.location.reload();

} catch (error) {
  console.log(error);

  if (error.response) {
    alert(error.response.data.message);
  } else {
    alert("Cannot connect to server. Make sure backend is running on port 5000.");
  }
}


};

return ( <div className="container"> <h2>Login</h2>
  <input
    type="email"
    placeholder="Enter Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    placeholder="Enter Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button onClick={loginUser}>
    Login
  </button>
</div>


);
}

export default Login;
