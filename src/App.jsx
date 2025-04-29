import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from '../src/pages/Login';


//primal imports
import PPage from '../src/pages/patient/PPage';
import AddPatient from '../src/pages/patient/AddPatient';
import PatientList from '../src/pages/patient/PatientList';
import AIPrediction from '../src/pages/patient/AIPrediction';
import PatientReport from '../src/pages/patient/PatientReport';
import PatientUpdate from '../src/pages/patient/UpdatePatient';

//lakshitha imports
import AssignSalary from "./pages/Staff/AssignSalary";
import SalaryDetails from "./pages/Staff/SalaryDetails";
import StaffSidebar from "./components/staff/StaffSidebar";
import AddStaff from "./pages/Staff/addstaff";
import HomePage from "./pages/Staff/HomePage";
import StaffDetails from "./pages/Staff/staffdetails"; 

//jithma
import AddDoctors from "./pages/Doctor/addDoctors"; 
import DisDoctors from "./pages/Doctor/disDoctors"; 

//saduni
import PharmacyDashboard from './pages/Parmacy_Management/PharmacyDashboard';
import InventoryForm from './pages/Parmacy_Management/InventoryForm';
import InventryDetails from './pages/Parmacy_Management/InventryDetails';
import BillForm from './pages/Parmacy_Management/BillForm';
import BillDetails from './pages/Parmacy_Management/BillDetails';

function App() {

  return (
    <Router>

      <div>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} /> */}

          <Route path="/" element={<Login />} />


          //sanduni
          <Route path = "/parmacyhome" element = {<PharmacyDashboard/>}></Route>
          <Route path = "/inventory" element = {<InventoryForm/>}></Route>
          <Route path = "/inventoryDetails" element = {<InventryDetails/>}></Route>
          <Route path = "/billing" element = {<BillForm/>}></Route>
          <Route path = "/billingDetails" element = {<BillDetails/>}></Route>


          //jithma
          <Route path="/doctors" element={<AddDoctors />} />
          <Route path="/disdoctors" element={<DisDoctors />} />



          //lakshitha          
          <Route path="/AddStaff" element={<AddStaff />} />     
          <Route path="/StaffDetails" element={<StaffDetails />} />
          <Route path="/AssignSalary" element={<AssignSalary />} />
          <Route path="/SalaryDetails" element={<SalaryDetails />} />
          <Route path="/StaffSidebar" element={<StaffSidebar />} />
          <Route path="/HomePage" element={<HomePage />} />
          

          //primal
          <Route path="/pp" element={<PPage />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/patient-list" element={<PatientList />} />
          <Route path="/patient-edit/:id" element={<PatientUpdate />} />
          <Route path="/ai-prediction" element={<AIPrediction />} />
          <Route path="/patient-report" element={<PatientReport />} />



        </Routes>
      </div>
    </Router>
  );
}


export default App;
