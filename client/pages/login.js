import React, { useState } from "react";
import propTypes from "prop-types";
import { Redirect, useHistory } from "react-router-dom";

function Login({ io, setToken, setOnlinePlayer }) {
  const [registeDetails, setregisteDetails] = useState({
    username: "",
    password: "",
  });

  const [loginDetails, setloginDetails] = useState({
    username: "",
    password: "",
  });

  function signUp(e) {
    e.preventDefault();
    const body = {
      registeDetails,
    };
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((err) => console.log("registe error"));
    let input = document.getElementById("username");
    input.value = "";
  }

  const history = useHistory();

  function login(e) {
    e.preventDefault();
    const body = {
      loginDetails,
    };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
        Accept: "Application/JSON",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        // let parsedOnlinePlayer = {};
        // if (localStorage.hasOwnProperty("onlinePlayer")) {
        //   parsedOnlinePlayer = JSON.parse(localStorage["onlinePlayer"]);
        // }

        // if (!parsedOnlinePlayer.hasOwnProperty(data.loginDetails.username)) {
        //   parsedOnlinePlayer[data.loginDetails.username] = true;
        //   localStorage["onlinePlayer"] = JSON.stringify(parsedOnlinePlayer);
        setToken(data.loginDetails);
        history.push("/game");
        // } else {
        //   alert("This account is already logged in ");
        // }
      })
      .catch((err) => console.log("login error"));
  }

  return (
    <div>
      <h1 className="login-heading">CodeName</h1>
      <div className="App">
        <form className="sign-up-container">
          <h2>Sign Up</h2>
          <label>Username</label>
          <br></br>
          <input
            id="username"
            name="username"
            type="text"
            onChange={(e) =>
              setregisteDetails({ ...registeDetails, username: e.target.value })
            }
            value={registeDetails.username}
          />
          <br></br>
          <label>Password</label>
          <br></br>
          <input
            name="password"
            type="password"
            onChange={(e) =>
              setregisteDetails({ ...registeDetails, password: e.target.value })
            }
            value={registeDetails.password}
          />
          <br></br>
          <button className="sign-up-button" onClick={signUp}>
            Sign up
          </button>
        </form>
        <form className="login-container" onSubmit={login}>
          <h2>Login</h2>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username..."
            onChange={(e) =>
              setloginDetails({ ...loginDetails, username: e.target.value })
            }
            value={loginDetails.username}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password..."
            onChange={(e) =>
              setloginDetails({ ...loginDetails, password: e.target.value })
            }
            value={loginDetails.password}
          />
          <button className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: propTypes.func.isRequired,
};

export default Login;
