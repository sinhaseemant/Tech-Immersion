import { React, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

const Crud=()=> {

  const [hospitalName, setHospitalName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [address, setAddress] = useState("");
  

const navigate = useNavigate();


  function PushtoDB(){
    createHospitalEntry();
    navigate("/crud");
    fetchCoordinates();
  }
  function goToCreatePage(){
    navigate("/home");
  }

  function createHospitalEntry(){
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "Name": hospitalName,
  "Latitude": latitude,
  "Longitude": longitude,
  "SpecialitiesAvailable": speciality,
  "Address": address
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:7071/api/addHospitalData", requestOptions)
  .then((response) => response.text())
  .then((result) => alert(result))
  .catch((error) => console.error(error));
  }

  function fetchCoordinates(){
    if(address.length<3)return;
    fetch(` https://geocode.maps.co/search?q=${address}&api_key=668f77953c443921364690nrf6d0eb9`)
            .then((res) => {
              console.log(res,"res");
              return res.json();
            })
            .then((data) => {
              console.log("data from api",data);
              //setAddress(data);
              setLatitude(data[0].lat);
              setLongitude(data[0].lon);

              console.log("data from crud",data[0]);

              
            });
  }
    
    
        console.log("Home is called");
      return (
        <header className="Header">

          <h2>Hospital Locator Admin Operations</h2>
 <div>
 <input type="text" placeholder='Hospital Name' onChange={(e) => {
            setHospitalName(e.target.value);
          }}></input>
 </div>
 <div>
 <input type="text" placeholder='Address'onChange={(e) => {
    setAddress(e.target.value);
            
          }}></input>
 </div>
 
 <div>
 <input type="text" placeholder='Departments available'onChange={(e) => {
            setSpeciality(e.target.value);
          }}></input>
 </div><div>
    
 <button onClick={PushtoDB}>Submit</button>
 </div><div>
 <button onClick={goToCreatePage}>Home</button>
 </div>
        </header>
      );
    }
    
    export default Crud;