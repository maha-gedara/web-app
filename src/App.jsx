import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


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


function App() {

  return (
    <Router>


          //sanduni
          <Route path = "/parmacyhome" element = {<PharmacyDashboard/>}></Route>
          <Route path = "/inventory" element = {<InventoryForm/>}></Route>
          <Route path = "/inventoryDetails" element = {<InventryDetails/>}></Route>
          <Route path = "/billing" element = {<BillForm/>}></Route>
          <Route path = "/billingDetails" element = {<BillDetails/>}></Route>

          //jithma


          //lakshitha
          
          <Route path="/AddStaff" element={<AddStaff />} />
         
          <Route path="/StaffDetails" element={<StaffDetails />} />

          <Route path="/AssignSalary" element={<AssignSalary />} />

          <Route path="/SalaryDetails" element={<SalaryDetails />} />
          <Route path="/StaffSidebar" element={<StaffSidebar />} />
          <Route path="/HomePage" element={<HomePage />} />
          
          //primal
        </Routes>
      
    </Router>
  );
}


export default App;
