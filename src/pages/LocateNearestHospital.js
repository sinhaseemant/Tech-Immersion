import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
//import axios from "axios";
//import {Input, Card} from "antd";
//import { AutoComplete } from 'primereact/autocomplete';

const LocateNearestHospital = () => {
  const [hospitalData, setHospitalData] = useState();

  const navigate = useNavigate();

  function gotoHome() {
    navigate("/home");
  }
  const [dept, setDept] = useState("");
  const [nearestHospital, setNearestHospital] = useState("");
  const [distanceHospital, setDistanceHospital] = useState("");
  const [address, setAddress] = useState("");
  const [newAdresslatlon, setNewAddresslatlon] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [textToSearch, setTextToSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  getHospitalDatafromDB();

  //using the ‘Haversine’ formula.
  console.log("locateNearestHospital is called");
  const arr = [
    ["AIIMS Delhi", 28.5672, 77.21, "ortho,dental,gp,opthalmology,cardio"],
    ["Apollo Hyd", 17.4276, 78.4134, "ortho,dental,gp,cardio"],
    ["Medicover Madhapur", 17.4469, 78.38, "gp"],
    ["AIG Hospital Hyderabad", 17.443183, 78.366294, "ortho,cardio"],
    ["PACE Hospitals HitechCity", 17.446773, 78.384252, "ortho,cardio"],
    ["KIMS Kondapur", 17.466881, 78.368515, "dental,gp,cardio"],
    [
      "KIMS Bhubaneswar",
      20.3539,
      85.8136,
      "ortho,dental,gp,opthalmology,cardio",
    ],
    [
      "Apollo Bhubaneswar",
      20.305592,
      85.831093,
      "ortho,dental,gp,opthalmology,cardio",
    ],
    [
      "AIIMS BHubaneswar",
      20.2318,
      85.775,
      "ortho,dental,gp,opthalmology,cardio",
    ],
  ];

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function getHospitalDatafromDB() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:7071/api/getHospitalsList", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setHospitalData(result);
      })
      .catch((error) => console.error(error));
  }

  function fetchSuggestions() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    // Replace this URL with the URL of your API and adjust query parameter if needed
    return  fetch(
      `https://geocode.maps.co/search?q=${textToSearch}&api_key=668f77953c443921364690nrf6d0eb9`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setSearchList(JSON.parse(result ?? []));
        console.log(result, "result");
      })
      .catch((error) => console.error(error));
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedFetchSearchResults = debounce(async()=>{
  const result = await fetchSuggestions();
  console.log(result,"result");
  //displaySuggestions(result)
  return result;
  }, 1000);

  useEffect(() => {
    
    debouncedFetchSearchResults();

    
    //const response = await axios.get(`https://geocode.maps.co/search?q=${textToSearch}&api_key=668f77953c443921364690nrf6d0eb9`);
    //setSearchList(response.data);
  }, [textToSearch]);

  const updateDynamicLatLon = (value) => {
    console.log(value, "value");
    let lat = value.lat,
      lon = value.lon;
    let arr = [lat, lon];
    setSelectedCity(value.display_name);
    setTextToSearch(value.display_name);
    setNewAddresslatlon(arr);
    setSearchList([]);
  };
  console.log(searchList,"SearchList");

  const FindAddress = (latitude, longitude) => {
    console.log(latitude, "latitude", longitude);

    //update this to dynamic
    fetch(
      `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=668f77953c443921364690nrf6d0eb9`
    )
      .then((res) => {
        console.log(res, "res");
        return res.json();
      })
      .then((data) => {
        console.log("data from api", data);
        setAddress(data);
        console.log("data from address", address);
      });
  };

  function succeeded(position) {
    console.log("Location fetch succeeded");
    var currLatitude = position.coords.latitude;
    var currLongitude = position.coords.longitude;
    console.log(currLatitude, currLongitude);
    let minDist = 0;
    let nearestHospital = "";
    let arr = "";
    if (hospitalData) arr = JSON.parse(hospitalData);
    let latNearestHospital = 0,
      longNearestHospital = 0;

    for (let i = 0; i < arr?.length; i++) {
      console.log("arr", arr[i].SpecialitiesAvailable);
      let dist = getDistanceFromLatLonInKm(
        currLatitude,
        currLongitude,
        arr[i]["Latitude"],
        arr[i]["Longitude"]
      );
      console.log(minDist, "dist", dist);
      if (
        (minDist === 0 || dist < minDist) &&
        arr[i].SpecialitiesAvailable.includes(dept)
      ) {
        minDist = dist;
        nearestHospital = arr[i]["Name"];
        latNearestHospital = arr[i]["Latitude"];
        longNearestHospital = arr[i]["Longitude"];
      }
    }
    console.log("Nearest Hospital: ", nearestHospital);
    setNearestHospital(nearestHospital);
    FindAddress(latNearestHospital, longNearestHospital);

    setDistanceHospital(minDist);
  }

  function calculateDistance(value){
    var currLatitude ;
    var currLongitude ;
    console.log(searchList,"value from CalDis",value.target.value);
    for(let i=0;i<searchList.length;i++){
      if(searchList[i].display_name==value.target.value){
          currLatitude=searchList[i].lat;
          currLongitude=searchList[i].lon;
          console.log(searchList[i],"Found",currLatitude);
        break;
      }
    }

    
    console.log(currLatitude, currLongitude);
    let minDist = 0;
    let nearestHospital = "";
    let arr = "";
    if (hospitalData) arr = JSON.parse(hospitalData);
    let latNearestHospital = 0,
      longNearestHospital = 0;

    for (let i = 0; i < arr?.length; i++) {
      console.log("arr", arr[i].SpecialitiesAvailable);
      let dist = getDistanceFromLatLonInKm(
        currLatitude,
        currLongitude,
        arr[i]["Latitude"],
        arr[i]["Longitude"]
      );
      console.log(minDist, "dist", dist);
      if (
        (minDist === 0 || dist < minDist) &&
        arr[i].SpecialitiesAvailable.includes(dept)
      ) {
        minDist = dist;
        nearestHospital = arr[i]["Name"];
        latNearestHospital = arr[i]["Latitude"];
        longNearestHospital = arr[i]["Longitude"];
      }
    }
    console.log(latNearestHospital,"Nearest Hospital: ", nearestHospital);
    setNearestHospital(nearestHospital);
    FindAddress(latNearestHospital, longNearestHospital);

    setDistanceHospital(minDist);
  }

  function failed() {
    console.log("Location fetch failed");
  }
  function findLocation() {
    console.log("tester called");
    //FindDistance();

    const result = navigator.geolocation.getCurrentPosition(succeeded, failed);
    console.log(result);
  }
  const setSearchedPlace = (e) => {
    console.log("setSearchedPlace");
  };

  const updatePlace = (e) => {
    console.log("setSearchedPlace");
  };

  const handleDept = (event) => {
    console.log(event.target.value);
    setDept(event.target.value);
  };

  const findHospital = () => {
    findLocation();
  };

  return (

<div className="container">
<div className="top-right-buttons">
        <Button onClick={() => navigate("/createAcc")} className="button">
          Create Admin Account
        </Button>
        <Button onClick={() => navigate("/")} className="button">
          Admin Login
        </Button>
  </div>
<div className="card">
  <h2>Locate Nearest Hospital</h2>

  <Button onClick={findLocation} className="button">
    Locate Me
  </Button>

  <FormControl variant="outlined" className="form-control">
    <InputLabel>Select Department</InputLabel>
    <Select className="select" value={dept} onChange={handleDept} label="Select Department">
      <MenuItem value="ortho">Orthopaedics</MenuItem>
      <MenuItem value="cardio">Cardiology</MenuItem>
      <MenuItem value="gp">Others</MenuItem>
      <MenuItem value="dental">Dental</MenuItem>
      <MenuItem value="opthalmology">Opthalmology</MenuItem>
    </Select>
  </FormControl>

  <Button onClick={findHospital} className="button">
    Find Nearest Hospital
  </Button>

  {nearestHospital && (
    <div>
      <p>
        The nearest Hospital is {nearestHospital} at a distance of {distanceHospital}. Hospital Address:{" "}
        {address.address.commercial}, {address.address.road}, {address.address.state}, {address.address.postcode}.
      </p>
    </div>
  )}

  <Autocomplete
  className="autocomplete"
    disablePortal
    id="combo-box-demo"
    options={searchList.map((item) => item.display_name)}
    sx={{ width: 300 }}
    renderInput={(params) => <TextField onChange={(e) => setTextToSearch(e.target.value)} {...params} label="Enter Address" />}
    onBlur={(e) => {
      calculateDistance(e);
    }}
  />

</div>
</div>
  );
};

export default LocateNearestHospital;
