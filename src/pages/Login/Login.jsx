import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { login, signUp } from "../../firebase";
import netflix_spinner from "../../assets/netflix_spinner.gif";

const Login = () => {
  const [signState, setSignState] = useState("In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignUp() {
    setSignState("Up");
  }

  function handleSignIn() {
    setSignState("In");
  }

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (signState === "In") {
      await login(email, password);
    } else {
      await signUp(name, email, password);
    }
    setLoading(false);
  };

  return loading ? (
    <div className="login-spinner">
      <img src={netflix_spinner} alt="" />
    </div>
  ) : (
    <div className="login">
      <img src={logo} className="login-logo" alt="" />
      <div className="login-form">
        <h1>Sign {signState}</h1>
        <form>
          {signState === "Up" ? (
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              placeholder="Your Name"
            />
          ) : (
            <></>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button onClick={user_auth} type="submit">
            Sign {signState}
          </button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remeber me</label>
            </div>
            <p>Need Help?</p>
          </div>
        </form>
        <div className="form-switch">
          {signState === "In" ? (
            <p>
              New to Netflix? <span onClick={handleSignUp}>Sign up now</span>
            </p>
          ) : signState === "Up" ? (
            <p>
              Already have account?{" "}
              <span onClick={handleSignIn}>Sign In now</span>
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
