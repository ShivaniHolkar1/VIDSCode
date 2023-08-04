import React from 'react';
import './App.css';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import Setting from './components/Setting';
import Login from './components/Login';

import Dashboard from './pages/Dashboard.jsx';
import VehicleDetection from './pages/VehicleDetection.jsx';
import ObjectDetection from './pages/ObjectDetection.jsx';
import AnimalDetection from './pages/AnimalDetection.jsx';
import WrongSide from './pages/WrongSide.jsx';
import FireDetection from './pages/FireDetection.jsx';
import Live from './pages/Live.jsx';
import FogWarning from './pages/FogWarning.jsx';


const App = () => {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>

        <Sidebar >
          <Routes>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<Live />} />
            {/* <Route path="/vehicledetection" element={<VehicleDetection />} /> */}
            <Route path="/wrongside" element={<WrongSide />} />
            <Route path="/animaldetection" element={<AnimalDetection />} />
            <Route path="/objectdetection" element={<ObjectDetection />} />
            <Route path="/firedetection" element={<FireDetection />} />
            <Route path="/fogwarning" element={<FogWarning />} />

            <Route path="/notification" element={<Notification />} />
            <Route path="/setting" element={<Setting />} />

          </Routes>
        </Sidebar>
      </BrowserRouter>

    </div>
  );
};

export default App;