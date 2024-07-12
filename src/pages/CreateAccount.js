import { React, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [loginPassword, setLoginPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");

  const navigate = useNavigate();


  function createAccount() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      Username: loginUsername,
      Password: loginPassword,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:7071/api/createUser", requestOptions)
      .then((response) => response.text())
      .then((result) => {alert(result, "Account created successfully");
      if(result.includes("User created successfully!"))navigate("/home");
   })
      .catch((error) => console.error(error));
    
  }


  console.log("CreateAccount is called");
  return (
    <header className="Header">
      <h2>Hospital Locator</h2>
      <div>
        <input
          type="text"
          placeholder="UserName"
          onChange={(e) => {
            setLoginUsername(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
        ></input>
      </div>
      <div></div>
      <div>
        <button onClick={createAccount}>Create Account</button>
      </div>
    </header>
  );
};

export default CreateAccount;
