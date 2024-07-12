import React from 'react';
import { useNavigate } from "react-router-dom";

const AdminLogin=()=> {
const navigate = useNavigate();


  function verifyLogin(){
    navigate("/crud");
  }
  function goToCreatePage(){
    navigate("/CreateAccount");
  }
    
    
        console.log("Home is called");
      return (
        <header className="Header">

          <h2>Hospital Locator Admin Login</h2>
 <div>
 <input type="text" placeholder='UserName'></input>
 </div><div>
 <input type="password" placeholder='Password'></input>
 </div><div>
 <button onClick={verifyLogin}>Admin Login</button>
 </div><div>
 <button onClick={goToCreatePage}>Create an Account</button>
 </div>
        </header>
      );
    }
    
    export default AdminLogin;