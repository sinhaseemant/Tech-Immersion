import {React,useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

    

    const LocateNearestHospital=()=> {
  const [hospitalData, setHospitalData] = useState();

      
const navigate = useNavigate();
      
      function gotoHome(){
        navigate("/home");
      }
    const [dept, setDept] = useState("");
    const [nearestHospital,setNearestHospital]=useState("");
    const [distanceHospital,setDistanceHospital]=useState("");
    const [address,setAddress]=useState("");
    getHospitalDatafromDB();

      //using the ‘Haversine’ formula.
        console.log("locateNearestHospital is called");
        const arr=[["AIIMS Delhi",28.5672,77.21,"ortho,dental,gp,opthalmology,cardio"],
        ["Apollo Hyd",17.4276,78.4134,"ortho,dental,gp,cardio"],
                    ["Medicover Madhapur",17.4469,78.38,"gp"],
                    ["AIG Hospital Hyderabad",17.443183, 78.366294,"ortho,cardio"],
                    ["PACE Hospitals HitechCity", 17.446773, 78.384252,"ortho,cardio"],
                    ["KIMS Kondapur",17.466881, 78.368515,"dental,gp,cardio"],
                    ["KIMS Bhubaneswar",20.3539, 85.8136,"ortho,dental,gp,opthalmology,cardio"],
                    ["Apollo Bhubaneswar",20.305592, 85.831093,"ortho,dental,gp,opthalmology,cardio"],
                    ["AIIMS BHubaneswar",20.2318, 85.7750,"ortho,dental,gp,opthalmology,cardio"]

      ];

      function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }

      function getHospitalDatafromDB(){
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
        
        fetch("http://localhost:7071/api/getHospitalsList", requestOptions)
          .then((response) => response.text())
          .then((result) => {console.log(result);
            setHospitalData(result);
          })
          .catch((error) => console.error(error));
      }
      
      
      



      const FindAddress=(latitude, longitude)=>{
        console.log(latitude,"latitude",longitude);
        
        
          //update this to dynamic
          fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=668f77953c443921364690nrf6d0eb9`)
            .then((res) => {
              console.log(res,"res");
              return res.json();
            })
            .then((data) => {
              console.log("data from api",data);
              setAddress(data);
              console.log("data from address",address);

              
            });
        
      }


        function succeeded(position){
          console.log("Location fetch succeeded");
          var currLatitude=position.coords.latitude;
          var currLongitude=position.coords.longitude;
          console.log(currLatitude,currLongitude);
          let minDist=0;
          let nearestHospital="";
          let arr="";
          if(hospitalData)arr=JSON.parse(hospitalData);
          let latNearestHospital=0,longNearestHospital=0;
          
          for(let i=0;i<arr?.length;i++){
            console.log("arr",arr[i].SpecialitiesAvailable);
            let dist=getDistanceFromLatLonInKm(currLatitude,currLongitude,arr[i]["Latitude"],arr[i]["Longitude"]);
            console.log(minDist,"dist",dist);
            if((minDist===0 || dist<minDist)&&arr[i].SpecialitiesAvailable.includes(dept)){minDist=dist;
              nearestHospital=arr[i]["Name"];
              latNearestHospital=arr[i]["Latitude"];
              longNearestHospital=arr[i]["Longitude"];
              
              
            }
          }
          console.log("Nearest Hospital: ", nearestHospital);
          setNearestHospital(nearestHospital);
          FindAddress(latNearestHospital,longNearestHospital);

          
              setDistanceHospital(minDist);         

        }
      
        function failed(){
          console.log("Location fetch failed");
        }
        function findLocation(){
          console.log("tester called");
          //FindDistance();
      
          const result=navigator.geolocation.getCurrentPosition(succeeded,failed);
          console.log(result);
        }

        const handleDept=(event)=>{
          console.log(event.target.value);
          setDept(event.target.value);
        }


        const findHospital=()=>{
          findLocation();

        }

      return (
        <header className="Header">
 <button onClick={findLocation}>Locate Me</button>

 <div>
 <select onChange={handleDept}>

<option value="ortho">Orthopaedics</option>

<option value="cardio">Cardiology</option>

<option value="gp">Others</option>
<option value="dental">Dental</option>
<option value="opthalmology">Opthalmology</option>



</select>
 </div>
 

 <button onClick={findHospital}>Find Nearest Hospital</button>
 {nearestHospital && <div> <p>The nearest Hospital is {nearestHospital} at a distance of {distanceHospital}.
        Hospital Address: {address.address.commercial}, {address.address.road}, {address.address.state},{address.address.postcode}.</p>
 </div>

 
 }

<button onClick={gotoHome}>Go to Home</button>


          
        </header>
      );
    }
    
    export default LocateNearestHospital;