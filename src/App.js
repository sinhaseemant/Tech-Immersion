import logo from './logo.svg';
import './App.css';
import LocateNearestHospital from './pages/LocateNearestHospital.js';
import AdminLogin  from './pages/AdminLogin.js';
import Crud from './pages/Crud.js';
import Home from './pages/Home.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount.js';

function App() {

 
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Routes>
        <Route index element={<Home/>}/>

          <Route path="/locate" element={<LocateNearestHospital/>}/>
          <Route path="/adminLogin" element={<AdminLogin/>}/>
          <Route path="/crud" element={<Crud/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/createAcc" element={<CreateAccount/>}/>


          


          

        </Routes>
        
        
        </BrowserRouter>
       
      
      </header>
    </div>
  );
}

export default App;
