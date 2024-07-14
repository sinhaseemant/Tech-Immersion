import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";


const CreateAccount = () => {
  
  const [ showPassword, setShowPassword ] = useState(false);
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

  function gotoHomePage() {
    navigate("/");
  }
  console.log("CreateAccount is called");
  return (
    <div className="login-signup-main">
      <div className="login-signup-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-signup-right">
        <div className="login-signup-right-container">
          <div className="login-signup-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-signup-center">
            <h2>Hospital Locator</h2>
            <p>Register</p>
            <form>
              <input type="text" placeholder="Username" onChange={(e) => {
                setLoginUsername(e.target.value);
              }}/>
              <input type="email" placeholder="Email" />
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" onChange={(e) => {
                setLoginPassword(e.target.value);
                }}/>
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
              </div>
              <div className="login-signup-center-buttons">
                <button onClick={createAccount} type="button">Sign up</button>
              </div>
            </form>
          </div>

          <p className="login-signup-bottom-p">
            Already have an account? <a href="#" onClick={gotoHomePage}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
