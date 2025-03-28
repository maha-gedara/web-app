import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//primal imports
import PPage from '../src/pages/patient/PPage';
import AddPatient from '../src/pages/patient/AddPatient';
import PatientList from '../src/pages/patient/PatientList';
import AIPrediction from '../src/pages/patient/AIPrediction';
import PatientReport from '../src/pages/patient/PatientReport';
import PatientUpdate from '../src/pages/patient/UpdatePatient';

function App() {

  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<PPage />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/patient-list" element={<PatientList />} />
          <Route path="/patient-edit/:id" element={<PatientUpdate />} />
          <Route path="/ai-prediction" element={<AIPrediction />} />
          <Route path="/patient-report" element={<PatientReport />} />
          

          //sanduni


          //jithma


          //lakshitha


          //primal
        </Routes>
      </div>
    </Router>
  );
}

export default App;
