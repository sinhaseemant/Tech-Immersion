import React from 'react';
import { useNavigate } from "react-router-dom";

const Home=()=> {
const navigate = useNavigate();



  function gotoLocatePage(){
    ValidateUser();
    navigate("/locate");
  }
  function gotoAdminLoginPage(){
    navigate("/adminLogin");
  }
  function gotoCreatePage(){
    navigate("/createAcc");
  }

  function ValidateUser(userName="tesuser1",password="test123"){
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "Username": userName,
  "Password": password
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:7071/api/validateUser", requestOptions)
  .then((response) => response.text())
  .then((result) => alert(result))
  .catch((error) => console.error(error));
  }

  
    
    
        console.log("Home is called");
      return (
        <header className="Header">

          <h2>Hospital Locator</h2>
 <div>
 <input type="text" placeholder='UserName'></input>
 </div><div>
 <input type="password" placeholder='Password'></input>
 </div><div>
 <button onClick={gotoLocatePage}>Login</button>
 <button onClick={gotoAdminLoginPage}>Admin Login</button>
 </div><div>
 <button onClick={gotoCreatePage}>Create an Account</button>
 </div>
        </header>
      );
    }
    
    export default Home;