import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StaffDetails from "./pages/Staff/staffdetails"; 
import AssignSalary from "./pages/Staff/AssignSalary";
import SalaryDetails from "./pages/Staff/SalaryDetails";
import StaffSidebar from "./components/staff/StaffSidebar";
import AddStaff from "./pages/Staff/addstaff";
import HomePage from "./pages/Staff/HomePage";
import './index.css';




function App() {

  return (
    <Router>
 
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}

          //sanduni


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
